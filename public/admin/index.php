<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Robots-Tag: noindex, nofollow, noarchive');

$isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('a2s_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
ini_set('session.use_strict_mode', '1');
session_start();

$adminConfigPath = dirname(__DIR__, 2) . '/config_admin.php';
$dbConfigPath = dirname(__DIR__, 2) . '/config_db.php';

if (!is_readable($adminConfigPath)) {
    http_response_code(503);
    echo 'Admin configuration missing.';
    exit;
}

$adminConfig = require $adminConfigPath;
if (!is_array($adminConfig) || empty($adminConfig['enabled'])) {
    http_response_code(503);
    echo 'Admin access not enabled.';
    exit;
}

$adminUser = (string)($adminConfig['username'] ?? '');
$adminHash = (string)($adminConfig['password_hash'] ?? '');
$sessionTimeout = (int)($adminConfig['session_timeout_minutes'] ?? 30);
$rateLimitEnabled = !empty($adminConfig['rate_limit_enabled']);
$rateLimitMax = (int)($adminConfig['rate_limit_max_attempts'] ?? 5);
$rateLimitWindow = (int)($adminConfig['rate_limit_window_minutes'] ?? 10) * 60;
$rateLimitLock = (int)($adminConfig['rate_limit_lock_minutes'] ?? 15) * 60;
$ipAllowlist = $adminConfig['ip_allowlist'] ?? [];
$trustProxy = !empty($adminConfig['trust_proxy']);

if ($adminUser === '' || $adminHash === '') {
    http_response_code(503);
    echo 'Admin credentials not configured.';
    exit;
}

function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function get_client_ip(bool $trustProxy): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if ($trustProxy && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded = explode(',', (string)$_SERVER['HTTP_X_FORWARDED_FOR']);
        $candidate = trim((string)($forwarded[0] ?? ''));
        if ($candidate !== '' && filter_var($candidate, FILTER_VALIDATE_IP)) {
            $ip = $candidate;
        }
    }

    return $ip;
}

function load_rate_limit_state(string $key, int $windowSeconds): array
{
    $dir = sys_get_temp_dir();
    $file = $dir . DIRECTORY_SEPARATOR . 'a2s_admin_' . hash('sha256', $key) . '.json';
    $now = time();
    $payload = [
        'count' => 0,
        'reset' => $now + $windowSeconds,
        'lock_until' => 0,
    ];

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return [$payload, null];
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return [$payload, null];
    }

    $existing = stream_get_contents($handle);
    if ($existing) {
        $decoded = json_decode($existing, true);
        if (is_array($decoded) && isset($decoded['count'], $decoded['reset'], $decoded['lock_until'])) {
            $payload = $decoded;
        }
    }

    if ($now > (int)$payload['reset']) {
        $payload['count'] = 0;
        $payload['reset'] = $now + $windowSeconds;
    }

    return [$payload, $handle];
}

function save_rate_limit_state($handle, array $payload): void
{
    if (!is_resource($handle)) {
        return;
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($payload));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

if (!isset($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

$error = '';
$clientIp = get_client_ip($trustProxy);

if (!empty($ipAllowlist)) {
    if (!in_array($clientIp, $ipAllowlist, true)) {
        http_response_code(403);
        echo 'Access denied.';
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = (string)($_POST['csrf'] ?? '');
    if (!hash_equals($_SESSION['csrf'], $token)) {
        $error = 'Invalid request.';
    } else {
        if ($rateLimitEnabled) {
            [$state, $handle] = load_rate_limit_state($clientIp, $rateLimitWindow);
            $now = time();
            if ($now < (int)$state['lock_until']) {
                $wait = (int)ceil(((int)$state['lock_until'] - $now) / 60);
                if (is_resource($handle)) {
                    save_rate_limit_state($handle, $state);
                }
                $error = 'Trop de tentatives. Réessayez dans ' . $wait . ' min.';
            }
        }

        if ($error !== '') {
            // fall through to render error
        } else {
            $username = trim((string)($_POST['username'] ?? ''));
            $password = (string)($_POST['password'] ?? '');

            if ($username === $adminUser && password_verify($password, $adminHash)) {
                if ($rateLimitEnabled) {
                    [$state, $handle] = load_rate_limit_state($clientIp, $rateLimitWindow);
                    $state['count'] = 0;
                    $state['lock_until'] = 0;
                    save_rate_limit_state($handle, $state);
                }
                session_regenerate_id(true);
                $_SESSION['auth'] = true;
                $_SESSION['last_activity'] = time();
                header('Location: /admin/index.php');
                exit;
            }

            if ($rateLimitEnabled) {
                [$state, $handle] = load_rate_limit_state($clientIp, $rateLimitWindow);
                $state['count'] = (int)$state['count'] + 1;
                if ($state['count'] >= $rateLimitMax) {
                    $state['lock_until'] = time() + $rateLimitLock;
                    $error = 'Trop de tentatives. Réessayez plus tard.';
                } else {
                    $error = 'Identifiants invalides.';
                }
                save_rate_limit_state($handle, $state);
            } else {
                $error = 'Identifiants invalides.';
            }
        }
    }
}

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: /admin/index.php');
    exit;
}

if (!empty($_SESSION['auth'])) {
    if (!isset($_SESSION['last_activity']) || (time() - (int)$_SESSION['last_activity']) > ($sessionTimeout * 60)) {
        $_SESSION = [];
        session_destroy();
        header('Location: /admin/index.php');
        exit;
    }
    $_SESSION['last_activity'] = time();
}

if (empty($_SESSION['auth'])) {
    ?>
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Admin - A2S</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
            }
            .card {
                background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
                padding: 48px;
                border-radius: 24px;
                width: 100%;
                max-width: 460px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                            0 0 0 1px rgba(255, 255, 255, 0.05);
                position: relative;
                overflow: hidden;
            }
            .card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            }
            .logo {
                text-align: center;
                margin-bottom: 32px;
            }
            .logo h1 {
                font-size: 28px;
                font-weight: 700;
                background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 8px;
            }
            .logo p {
                font-size: 14px;
                color: #94a3b8;
                font-weight: 500;
            }
            .form-group {
                margin-bottom: 24px;
            }
            label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                margin-bottom: 8px;
                color: #cbd5e1;
            }
            input {
                width: 100%;
                padding: 14px 16px;
                border-radius: 12px;
                border: 2px solid #334155;
                background: #0f172a;
                color: #e2e8f0;
                font-size: 15px;
                font-family: inherit;
                transition: all 0.2s;
            }
            input:focus {
                outline: none;
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }
            button {
                width: 100%;
                margin-top: 32px;
                padding: 16px;
                border-radius: 12px;
                border: none;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                font-size: 15px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                font-family: inherit;
                letter-spacing: 0.02em;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 24px -8px rgba(16, 185, 129, 0.4);
            }
            button:active {
                transform: translateY(0);
            }
            .error {
                margin-top: 20px;
                padding: 12px 16px;
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
                color: #fca5a5;
                font-size: 14px;
                line-height: 1.6;
            }
            .footer {
                margin-top: 24px;
                text-align: center;
                font-size: 12px;
                color: #64748b;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="logo">
                <h1>A2S</h1>
                <p>Administration</p>
            </div>
            <form method="post" autocomplete="off">
                <input type="hidden" name="csrf" value="<?php echo esc($_SESSION['csrf']); ?>">
                <div class="form-group">
                    <label for="username">Utilisateur</label>
                    <input id="username" name="username" type="text" required autofocus>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input id="password" name="password" type="password" required>
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <?php if ($error !== ''): ?>
                <div class="error"><?php echo esc($error); ?></div>
            <?php endif; ?>
            <div class="footer">
                Alliance Synergie Santé © <?php echo date('Y'); ?>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// User is authenticated - load database and render admin interface
if (!is_readable($dbConfigPath)) {
    http_response_code(503);
    echo 'Database configuration missing.';
    exit;
}

$dbConfig = require $dbConfigPath;
if (!is_array($dbConfig) || empty($dbConfig['enabled'])) {
    http_response_code(503);
    echo 'Database access not enabled.';
    exit;
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $dbConfig['host'],
        $dbConfig['name'],
        $dbConfig['charset']
    );
    $pdo = new PDO($dsn, $dbConfig['user'], $dbConfig['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Database connection failed.';
    exit;
}

// Handle actions (mark as read, delete, export, etc.)
$action = $_GET['action'] ?? '';
$successMessage = '';

if ($action === 'mark_read' && isset($_GET['id']) && isset($_GET['token'])) {
    if (hash_equals($_SESSION['csrf'], (string)$_GET['token'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare('UPDATE contact_messages SET is_read = 1, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $successMessage = 'Message marqué comme lu.';
    }
}

if ($action === 'mark_unread' && isset($_GET['id']) && isset($_GET['token'])) {
    if (hash_equals($_SESSION['csrf'], (string)$_GET['token'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare('UPDATE contact_messages SET is_read = 0, updated_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $successMessage = 'Message marqué comme non lu.';
    }
}

if ($action === 'delete' && isset($_GET['id']) && isset($_GET['token'])) {
    if (hash_equals($_SESSION['csrf'], (string)$_GET['token'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare('DELETE FROM contact_messages WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $successMessage = 'Message supprimé.';
    }
}

if ($action === 'export_csv') {
    // Export to CSV
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="messages_a2s_' . date('Y-m-d_His') . '.csv"');

    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Date', 'Nom', 'Société', 'Email', 'Téléphone', 'Intérêt', 'Autre', 'Message', 'IP', 'Lu', 'Statut']);

    $stmt = $pdo->query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    while ($row = $stmt->fetch()) {
        fputcsv($output, [
            $row['id'],
            $row['created_at'],
            $row['name'],
            $row['company'],
            $row['email'],
            $row['phone'],
            $row['interest'],
            $row['other_interest'] ?? '',
            $row['message'],
            $row['ip_address'],
            ($row['is_read'] ?? 0) ? 'Oui' : 'Non',
            $row['status'] ?? 'new'
        ]);
    }
    fclose($output);
    exit;
}

// Pagination and filtering
$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = (int)($_GET['per_page'] ?? 25);
$perPage = min(100, max(10, $perPage)); // Between 10 and 100

$search = trim((string)($_GET['search'] ?? ''));
$filterStatus = (string)($_GET['filter_status'] ?? '');
$filterRead = (string)($_GET['filter_read'] ?? '');
$filterDate = (string)($_GET['filter_date'] ?? '');
$filterInterest = (string)($_GET['filter_interest'] ?? '');
$sortBy = (string)($_GET['sort'] ?? 'created_at');
$sortOrder = (string)($_GET['order'] ?? 'DESC');

// Validate sort parameters
$allowedSort = ['created_at', 'name', 'company', 'email'];
if (!in_array($sortBy, $allowedSort, true)) {
    $sortBy = 'created_at';
}
if (!in_array($sortOrder, ['ASC', 'DESC'], true)) {
    $sortOrder = 'DESC';
}

// Build query
$where = [];
$params = [];

if ($search !== '') {
    $where[] = '(name LIKE :search OR company LIKE :search OR email LIKE :search OR message LIKE :search)';
    $params['search'] = '%' . $search . '%';
}

if ($filterStatus !== '' && in_array($filterStatus, ['new', 'in_progress', 'resolved', 'archived'], true)) {
    $where[] = 'status = :status';
    $params['status'] = $filterStatus;
}

if ($filterRead === '1') {
    $where[] = 'is_read = 1';
} elseif ($filterRead === '0') {
    $where[] = 'is_read = 0';
}

if ($filterDate !== '') {
    switch ($filterDate) {
        case 'today':
            $where[] = 'DATE(created_at) = CURDATE()';
            break;
        case 'yesterday':
            $where[] = 'DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';
            break;
        case 'week':
            $where[] = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
            break;
        case 'month':
            $where[] = 'created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
            break;
    }
}

if ($filterInterest !== '') {
    $where[] = 'interest = :interest';
    $params['interest'] = $filterInterest;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// Get distinct interests for filter dropdown
$interestStmt = $pdo->query('SELECT DISTINCT interest FROM contact_messages WHERE interest IS NOT NULL AND interest != "" ORDER BY interest');
$interests = $interestStmt->fetchAll(PDO::FETCH_COLUMN);

// Get total count
$countQuery = "SELECT COUNT(*) FROM contact_messages $whereClause";
$countStmt = $pdo->prepare($countQuery);
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

// Get statistics
$stats = $pdo->query('
    SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread,
        SUM(CASE WHEN status = "new" THEN 1 ELSE 0 END) as new_messages,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
    FROM contact_messages
')->fetch();

// Get messages
$offset = ($page - 1) * $perPage;
$query = "
    SELECT id, name, company, email, phone, interest, other_interest, message, ip_address, created_at,
           is_read, notes, priority, status, updated_at
    FROM contact_messages
    $whereClause
    ORDER BY $sortBy $sortOrder
    LIMIT :limit OFFSET :offset
";

$stmt = $pdo->prepare($query);
foreach ($params as $key => $value) {
    $stmt->bindValue(':' . $key, $value);
}
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$totalPages = max(1, (int)ceil($total / $perPage));

// Helper function to build query string
function buildQuery($params): string {
    global $search, $filterStatus, $filterRead, $filterDate, $filterInterest, $sortBy, $sortOrder, $perPage;
    $defaults = [
        'search' => $search,
        'filter_status' => $filterStatus,
        'filter_read' => $filterRead,
        'filter_date' => $filterDate,
        'filter_interest' => $filterInterest,
        'sort' => $sortBy,
        'order' => $sortOrder,
        'per_page' => $perPage
    ];
    $merged = array_merge($defaults, $params);
    $filtered = array_filter($merged, fn($v) => $v !== '');
    return http_build_query($filtered);
}

// Count active filters
$activeFiltersCount = 0;
$activeFiltersList = [];
if ($search !== '') { $activeFiltersCount++; $activeFiltersList[] = ['label' => 'Recherche: ' . mb_substr($search, 0, 20) . (mb_strlen($search) > 20 ? '...' : ''), 'param' => 'search']; }
if ($filterStatus !== '') {
    $statusLabels = ['new' => 'Nouveau', 'in_progress' => 'En cours', 'resolved' => 'Résolu', 'archived' => 'Archivé'];
    $activeFiltersCount++;
    $activeFiltersList[] = ['label' => 'Statut: ' . ($statusLabels[$filterStatus] ?? $filterStatus), 'param' => 'filter_status'];
}
if ($filterRead !== '') { $activeFiltersCount++; $activeFiltersList[] = ['label' => 'Lecture: ' . ($filterRead === '1' ? 'Lus' : 'Non lus'), 'param' => 'filter_read']; }
if ($filterDate !== '') {
    $dateLabels = ['today' => "Aujourd'hui", 'yesterday' => 'Hier', 'week' => '7 derniers jours', 'month' => '30 derniers jours'];
    $activeFiltersCount++;
    $activeFiltersList[] = ['label' => 'Date: ' . ($dateLabels[$filterDate] ?? $filterDate), 'param' => 'filter_date'];
}
if ($filterInterest !== '') { $activeFiltersCount++; $activeFiltersList[] = ['label' => 'Intérêt: ' . $filterInterest, 'param' => 'filter_interest']; }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Messages - A2S Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0b1220;
            color: #e2e8f0;
            min-height: 100vh;
        }

        /* Header */
        header {
            background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
            padding: 24px 32px;
            border-bottom: 1px solid rgba(16, 185, 129, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }

        .header-left h1 {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 4px;
        }

        .header-left .subtitle {
            font-size: 13px;
            color: #94a3b8;
        }

        .header-right {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
            background: #1f2937;
            color: #e2e8f0;
            border: 1px solid #374151;
        }

        .btn-secondary:hover {
            background: #374151;
        }

        .btn-danger {
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        /* Stats */
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            padding: 24px 32px;
        }

        .stat-card {
            background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #1f2937;
        }

        .stat-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
            margin-bottom: 8px;
        }

        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #10b981;
        }

        /* Filters */
        .filters {
            padding: 0 32px 24px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 14px;
        }

        .search-box::before {
            content: "🔍";
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
        }

        select {
            padding: 12px 16px;
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 14px;
            cursor: pointer;
        }

        select:focus, .search-box input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .filter-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
            width: 100%;
        }

        .filter-actions {
            display: flex;
            gap: 8px;
            margin-left: auto;
        }

        .btn-reset {
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-reset:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .active-filters {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            padding: 0 32px 16px;
        }

        .filter-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 999px;
            font-size: 12px;
            color: #34d399;
        }

        .filter-tag a {
            color: #fca5a5;
            text-decoration: none;
            font-weight: bold;
        }

        .filter-tag a:hover {
            color: #ef4444;
        }

        /* Table */
        .table-container {
            padding: 0 32px 32px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
            border-radius: 12px;
            overflow: hidden;
        }

        th {
            text-align: left;
            padding: 16px;
            background: #111827;
            color: #cbd5e1;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #1f2937;
        }

        td {
            padding: 16px;
            border-bottom: 1px solid #1f2937;
            font-size: 14px;
        }

        tr:hover {
            background: rgba(16, 185, 129, 0.05);
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .badge-unread {
            background: rgba(59, 130, 246, 0.1);
            color: #93c5fd;
        }

        .badge-read {
            background: rgba(107, 114, 128, 0.1);
            color: #9ca3af;
        }

        .badge-new {
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
        }

        .message-preview {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #94a3b8;
        }

        .btn-view {
            background: rgba(59, 130, 246, 0.1);
            color: #93c5fd;
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-view:hover {
            background: rgba(59, 130, 246, 0.2);
        }

        /* Modal */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal {
            background: linear-gradient(180deg, #1e293b 0%, #111827 100%);
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid #374151;
        }

        .modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid #374151;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #e2e8f0;
        }

        .modal-close {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 24px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .modal-close:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #fca5a5;
        }

        .modal-body {
            padding: 24px;
            overflow-y: auto;
            max-height: calc(90vh - 140px);
        }

        .modal-field {
            margin-bottom: 16px;
        }

        .modal-field:last-child {
            margin-bottom: 0;
        }

        .modal-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 6px;
            display: block;
        }

        .modal-value {
            font-size: 14px;
            color: #e2e8f0;
            line-height: 1.6;
        }

        .modal-value a {
            color: #10b981;
            text-decoration: none;
        }

        .modal-value a:hover {
            text-decoration: underline;
        }

        .modal-message {
            background: #0f172a;
            padding: 16px;
            border-radius: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.7;
            color: #cbd5e1;
            border: 1px solid #1f2937;
        }

        .modal-footer {
            padding: 16px 24px;
            border-top: 1px solid #374151;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .modal-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        @media (max-width: 500px) {
            .modal-grid {
                grid-template-columns: 1fr;
            }
        }

        .actions {
            display: flex;
            gap: 8px;
        }

        .action-link {
            color: #10b981;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
        }

        .action-link:hover {
            text-decoration: underline;
        }

        /* Pagination */
        .pagination {
            padding: 0 32px 32px;
            display: flex;
            justify-content: center;
            gap: 8px;
            align-items: center;
        }

        .pagination a, .pagination span {
            padding: 8px 14px;
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 8px;
            color: #e2e8f0;
            text-decoration: none;
            font-size: 14px;
        }

        .pagination a:hover {
            background: #1f2937;
        }

        .pagination .current {
            background: #10b981;
            color: white;
            border-color: #10b981;
        }

        .success-message {
            margin: 24px 32px;
            padding: 12px 16px;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            color: #34d399;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            header {
                padding: 16px;
            }
            .stats, .filters, .table-container, .pagination {
                padding-left: 16px;
                padding-right: 16px;
            }
            .stats {
                grid-template-columns: 1fr 1fr;
            }
            table {
                font-size: 12px;
            }
            th, td {
                padding: 12px 8px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-left">
            <h1>Messages de Contact</h1>
            <div class="subtitle">Gestion centralisée • <?php echo esc((string)$total); ?> messages</div>
        </div>
        <div class="header-right">
            <a href="/admin/index.php?action=export_csv" class="btn btn-secondary">📥 Export CSV</a>
            <a href="/admin/index.php?logout=1" class="btn btn-danger">🚪 Déconnexion</a>
        </div>
    </header>

    <?php if ($successMessage): ?>
        <div class="success-message"><?php echo esc($successMessage); ?></div>
    <?php endif; ?>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-label">Total Messages</div>
            <div class="stat-value"><?php echo esc((string)($stats['total'] ?? 0)); ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Non Lus</div>
            <div class="stat-value"><?php echo esc((string)($stats['unread'] ?? 0)); ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Nouveaux</div>
            <div class="stat-value"><?php echo esc((string)($stats['new_messages'] ?? 0)); ?></div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Aujourd'hui</div>
            <div class="stat-value"><?php echo esc((string)($stats['today'] ?? 0)); ?></div>
        </div>
    </div>

    <form class="filters" method="get">
        <div class="filter-row">
            <div class="search-box">
                <input type="search" name="search" placeholder="Rechercher par nom, société, email, message..." value="<?php echo esc($search); ?>">
            </div>
            <select name="filter_read">
                <option value="">📖 Tous (lecture)</option>
                <option value="0" <?php echo $filterRead === '0' ? 'selected' : ''; ?>>📩 Non lus</option>
                <option value="1" <?php echo $filterRead === '1' ? 'selected' : ''; ?>>✅ Lus</option>
            </select>
            <select name="filter_status">
                <option value="">📋 Tous statuts</option>
                <option value="new" <?php echo $filterStatus === 'new' ? 'selected' : ''; ?>>🆕 Nouveaux</option>
                <option value="in_progress" <?php echo $filterStatus === 'in_progress' ? 'selected' : ''; ?>>⏳ En cours</option>
                <option value="resolved" <?php echo $filterStatus === 'resolved' ? 'selected' : ''; ?>>✔️ Résolus</option>
                <option value="archived" <?php echo $filterStatus === 'archived' ? 'selected' : ''; ?>>📦 Archivés</option>
            </select>
        </div>
        <div class="filter-row">
            <select name="filter_date">
                <option value="">📅 Toutes dates</option>
                <option value="today" <?php echo $filterDate === 'today' ? 'selected' : ''; ?>>Aujourd'hui</option>
                <option value="yesterday" <?php echo $filterDate === 'yesterday' ? 'selected' : ''; ?>>Hier</option>
                <option value="week" <?php echo $filterDate === 'week' ? 'selected' : ''; ?>>7 derniers jours</option>
                <option value="month" <?php echo $filterDate === 'month' ? 'selected' : ''; ?>>30 derniers jours</option>
            </select>
            <select name="filter_interest">
                <option value="">🎯 Tous intérêts</option>
                <?php foreach ($interests as $interest): ?>
                    <option value="<?php echo esc($interest); ?>" <?php echo $filterInterest === $interest ? 'selected' : ''; ?>><?php echo esc($interest); ?></option>
                <?php endforeach; ?>
            </select>
            <select name="per_page">
                <option value="10" <?php echo $perPage === 10 ? 'selected' : ''; ?>>10 par page</option>
                <option value="25" <?php echo $perPage === 25 ? 'selected' : ''; ?>>25 par page</option>
                <option value="50" <?php echo $perPage === 50 ? 'selected' : ''; ?>>50 par page</option>
                <option value="100" <?php echo $perPage === 100 ? 'selected' : ''; ?>>100 par page</option>
            </select>
            <div class="filter-actions">
                <button type="submit" class="btn btn-primary">🔍 Filtrer</button>
                <?php if ($activeFiltersCount > 0): ?>
                    <a href="/admin/index.php" class="btn btn-reset">✕ Réinitialiser</a>
                <?php endif; ?>
            </div>
        </div>
    </form>

    <?php if ($activeFiltersCount > 0): ?>
        <div class="active-filters">
            <span style="font-size: 12px; color: #64748b; margin-right: 8px;">Filtres actifs (<?php echo $activeFiltersCount; ?>):</span>
            <?php foreach ($activeFiltersList as $filter): ?>
                <span class="filter-tag">
                    <?php echo esc($filter['label']); ?>
                    <a href="?<?php echo buildQuery([$filter['param'] => '']); ?>" title="Supprimer ce filtre">×</a>
                </span>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Statut</th>
                    <th><a href="?<?php echo buildQuery(['sort' => 'created_at', 'order' => $sortBy === 'created_at' && $sortOrder === 'DESC' ? 'ASC' : 'DESC']); ?>" style="color: inherit; text-decoration: none;">Date <?php echo $sortBy === 'created_at' ? ($sortOrder === 'DESC' ? '↓' : '↑') : ''; ?></a></th>
                    <th><a href="?<?php echo buildQuery(['sort' => 'name', 'order' => $sortBy === 'name' && $sortOrder === 'ASC' ? 'DESC' : 'ASC']); ?>" style="color: inherit; text-decoration: none;">Nom <?php echo $sortBy === 'name' ? ($sortOrder === 'DESC' ? '↓' : '↑') : ''; ?></a></th>
                    <th><a href="?<?php echo buildQuery(['sort' => 'company', 'order' => $sortBy === 'company' && $sortOrder === 'ASC' ? 'DESC' : 'ASC']); ?>" style="color: inherit; text-decoration: none;">Société <?php echo $sortBy === 'company' ? ($sortOrder === 'DESC' ? '↓' : '↑') : ''; ?></a></th>
                    <th>Contact</th>
                    <th>Intérêt</th>
                    <th>Message</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$rows): ?>
                    <tr><td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">Aucun message trouvé.</td></tr>
                <?php else: ?>
                    <?php foreach ($rows as $row): ?>
                        <tr>
                            <td>
                                <?php if (($row['is_read'] ?? 0) == 0): ?>
                                    <span class="badge badge-unread">Non lu</span>
                                <?php else: ?>
                                    <span class="badge badge-read">Lu</span>
                                <?php endif; ?>
                                <?php if (($row['status'] ?? 'new') === 'new'): ?>
                                    <br><span class="badge badge-new" style="margin-top: 4px;">Nouveau</span>
                                <?php endif; ?>
                            </td>
                            <td style="white-space: nowrap;"><?php echo esc(date('d/m/Y H:i', strtotime((string)$row['created_at']))); ?></td>
                            <td><strong><?php echo esc((string)$row['name']); ?></strong></td>
                            <td><?php echo esc((string)$row['company']); ?></td>
                            <td>
                                <a href="mailto:<?php echo esc((string)$row['email']); ?>" style="color: #10b981; text-decoration: none;"><?php echo esc((string)$row['email']); ?></a><br>
                                <span style="color: #64748b; font-size: 13px;"><?php echo esc((string)$row['phone']); ?></span>
                            </td>
                            <td style="font-size: 13px;"><?php echo esc((string)$row['interest']); ?><?php echo $row['other_interest'] ? '<br><em style="color: #64748b;">' . esc((string)$row['other_interest']) . '</em>' : ''; ?></td>
                            <td><div class="message-preview" title="<?php echo esc((string)$row['message']); ?>"><?php echo esc((string)$row['message']); ?></div></td>
                            <td class="actions">
                                <button type="button" class="btn-view" onclick="showMessage(<?php echo (int)$row['id']; ?>)">👁 Voir</button>
                                <?php if (($row['is_read'] ?? 0) == 0): ?>
                                    <a href="?action=mark_read&id=<?php echo (int)$row['id']; ?>&token=<?php echo esc($_SESSION['csrf']); ?>&<?php echo buildQuery(['page' => $page]); ?>" class="action-link">✓ Lire</a>
                                <?php else: ?>
                                    <a href="?action=mark_unread&id=<?php echo (int)$row['id']; ?>&token=<?php echo esc($_SESSION['csrf']); ?>&<?php echo buildQuery(['page' => $page]); ?>" class="action-link">↩ Non lu</a>
                                <?php endif; ?>
                                <a href="?action=delete&id=<?php echo (int)$row['id']; ?>&token=<?php echo esc($_SESSION['csrf']); ?>&<?php echo buildQuery(['page' => $page]); ?>" class="action-link" style="color: #fca5a5;" onclick="return confirm('Supprimer ce message ?');">🗑</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <?php if ($totalPages > 1): ?>
        <div class="pagination">
            <?php if ($page > 1): ?>
                <a href="?<?php echo buildQuery(['page' => 1]); ?>">‹‹ Première</a>
                <a href="?<?php echo buildQuery(['page' => $page - 1]); ?>">‹ Précédente</a>
            <?php endif; ?>

            <?php
            $start = max(1, $page - 2);
            $end = min($totalPages, $page + 2);
            for ($i = $start; $i <= $end; $i++):
            ?>
                <?php if ($i === $page): ?>
                    <span class="current"><?php echo $i; ?></span>
                <?php else: ?>
                    <a href="?<?php echo buildQuery(['page' => $i]); ?>"><?php echo $i; ?></a>
                <?php endif; ?>
            <?php endfor; ?>

            <?php if ($page < $totalPages): ?>
                <a href="?<?php echo buildQuery(['page' => $page + 1]); ?>">Suivante ›</a>
                <a href="?<?php echo buildQuery(['page' => $totalPages]); ?>">Dernière ››</a>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <!-- Modal pour afficher le message complet -->
    <div class="modal-overlay" id="messageModal">
        <div class="modal">
            <div class="modal-header">
                <h2>📧 Détails du message</h2>
                <button type="button" class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-grid">
                    <div class="modal-field">
                        <span class="modal-label">Nom</span>
                        <div class="modal-value" id="modal-name"></div>
                    </div>
                    <div class="modal-field">
                        <span class="modal-label">Société</span>
                        <div class="modal-value" id="modal-company"></div>
                    </div>
                    <div class="modal-field">
                        <span class="modal-label">Email</span>
                        <div class="modal-value" id="modal-email"></div>
                    </div>
                    <div class="modal-field">
                        <span class="modal-label">Téléphone</span>
                        <div class="modal-value" id="modal-phone"></div>
                    </div>
                    <div class="modal-field">
                        <span class="modal-label">Intérêt</span>
                        <div class="modal-value" id="modal-interest"></div>
                    </div>
                    <div class="modal-field">
                        <span class="modal-label">Date</span>
                        <div class="modal-value" id="modal-date"></div>
                    </div>
                </div>
                <div class="modal-field" style="margin-top: 20px;">
                    <span class="modal-label">Message complet</span>
                    <div class="modal-message" id="modal-message"></div>
                </div>
            </div>
            <div class="modal-footer">
                <a id="modal-mark-read" href="#" class="btn btn-primary">✓ Marquer comme lu</a>
                <a id="modal-reply" href="#" class="btn btn-secondary">📧 Répondre</a>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Fermer</button>
            </div>
        </div>
    </div>

    <script>
        // Données des messages pour la modal
        const messagesData = {
            <?php foreach ($rows as $row): ?>
            <?php echo (int)$row['id']; ?>: {
                name: <?php echo json_encode($row['name']); ?>,
                company: <?php echo json_encode($row['company']); ?>,
                email: <?php echo json_encode($row['email']); ?>,
                phone: <?php echo json_encode($row['phone']); ?>,
                interest: <?php echo json_encode($row['interest'] . ($row['other_interest'] ? ' (' . $row['other_interest'] . ')' : '')); ?>,
                message: <?php echo json_encode($row['message']); ?>,
                date: <?php echo json_encode(date('d/m/Y à H:i', strtotime((string)$row['created_at']))); ?>,
                isRead: <?php echo (int)($row['is_read'] ?? 0); ?>,
                markReadUrl: "?action=mark_read&id=<?php echo (int)$row['id']; ?>&token=<?php echo esc($_SESSION['csrf']); ?>&<?php echo buildQuery(['page' => $page]); ?>"
            },
            <?php endforeach; ?>
        };

        function showMessage(id) {
            const data = messagesData[id];
            if (!data) return;

            document.getElementById('modal-name').textContent = data.name;
            document.getElementById('modal-company').textContent = data.company || '-';
            document.getElementById('modal-email').innerHTML = '<a href="mailto:' + data.email + '">' + data.email + '</a>';
            document.getElementById('modal-phone').textContent = data.phone || '-';
            document.getElementById('modal-interest').textContent = data.interest || '-';
            document.getElementById('modal-date').textContent = data.date;
            document.getElementById('modal-message').textContent = data.message;

            // Bouton répondre
            document.getElementById('modal-reply').href = 'mailto:' + data.email + '?subject=Re: Votre demande A2S';

            // Bouton marquer comme lu
            const markReadBtn = document.getElementById('modal-mark-read');
            if (data.isRead) {
                markReadBtn.style.display = 'none';
            } else {
                markReadBtn.style.display = 'inline-flex';
                markReadBtn.href = data.markReadUrl;
            }

            document.getElementById('messageModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('messageModal').classList.remove('active');
            document.body.style.overflow = '';
        }

        // Fermer avec Escape ou clic en dehors
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
        });

        document.getElementById('messageModal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    </script>
</body>
</html>