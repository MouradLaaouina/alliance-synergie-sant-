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
                $error = 'Too many attempts. Try again in ' . $wait . ' min.';
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
                header('Location: /admin/');
                exit;
            }

            if ($rateLimitEnabled) {
                [$state, $handle] = load_rate_limit_state($clientIp, $rateLimitWindow);
                $state['count'] = (int)$state['count'] + 1;
                if ($state['count'] >= $rateLimitMax) {
                    $state['lock_until'] = time() + $rateLimitLock;
                    $error = 'Too many attempts. Try again later.';
                } else {
                    $error = 'Invalid credentials.';
                }
                save_rate_limit_state($handle, $state);
            } else {
                $error = 'Invalid credentials.';
            }
        }
    }
}

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: /admin/');
    exit;
}

if (!empty($_SESSION['auth'])) {
    if (!isset($_SESSION['last_activity']) || (time() - (int)$_SESSION['last_activity']) > ($sessionTimeout * 60)) {
        $_SESSION = [];
        session_destroy();
        header('Location: /admin/');
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
        <style>
            body { font-family: Arial, sans-serif; background:#0f172a; color:#e2e8f0; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
            .card { background:#111827; padding:32px; border-radius:16px; width:100%; max-width:420px; box-shadow:0 20px 40px rgba(0,0,0,.35); }
            h1 { margin:0 0 16px; font-size:20px; }
            label { display:block; font-size:12px; letter-spacing:.08em; text-transform:uppercase; margin:16px 0 6px; }
            input { width:100%; padding:12px 14px; border-radius:10px; border:1px solid #1f2937; background:#0b1220; color:#e2e8f0; }
            button { width:100%; margin-top:20px; padding:12px 14px; border-radius:10px; border:none; background:#10b981; color:#052e2b; font-weight:700; cursor:pointer; }
            .error { margin-top:12px; color:#fca5a5; font-size:13px; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Administration A2S</h1>
            <form method="post" autocomplete="off">
                <input type="hidden" name="csrf" value="<?php echo esc($_SESSION['csrf']); ?>">
                <label for="username">Utilisateur</label>
                <input id="username" name="username" type="text" required>
                <label for="password">Mot de passe</label>
                <input id="password" name="password" type="password" required>
                <button type="submit">Se connecter</button>
            </form>
            <?php if ($error !== ''): ?>
                <div class="error"><?php echo esc($error); ?></div>
            <?php endif; ?>
        </div>
    </body>
    </html>
    <?php
    exit;
}

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

$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = 50;
$offset = ($page - 1) * $perPage;

$total = (int)$pdo->query('SELECT COUNT(*) FROM contact_messages')->fetchColumn();
$stmt = $pdo->prepare(
    'SELECT id, name, company, email, phone, interest, other_interest, message, ip_address, created_at
     FROM contact_messages
     ORDER BY created_at DESC
     LIMIT :limit OFFSET :offset'
);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$totalPages = max(1, (int)ceil($total / $perPage));
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Messages - A2S Admin</title>
    <style>
        body { font-family: Arial, sans-serif; background:#0b1220; color:#e2e8f0; margin:0; }
        header { padding:24px 28px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1f2937; }
        h1 { margin:0; font-size:20px; }
        .meta { font-size:12px; color:#94a3b8; }
        .wrap { padding:24px 28px; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th, td { padding:12px; border-bottom:1px solid #1f2937; vertical-align:top; }
        th { text-align:left; color:#cbd5f5; font-weight:600; }
        .chip { display:inline-block; padding:4px 8px; border-radius:999px; background:#1f2937; font-size:11px; }
        .pagination { margin-top:16px; display:flex; gap:8px; align-items:center; }
        .pagination a { color:#93c5fd; text-decoration:none; }
        .message { white-space:pre-wrap; max-width:420px; }
        a.logout { color:#fca5a5; text-decoration:none; font-size:12px; }
    </style>
</head>
<body>
    <header>
        <div>
            <h1>Messages du formulaire</h1>
            <div class="meta"><?php echo esc((string)$total); ?> messages</div>
        </div>
        <div>
            <span class="chip">Page <?php echo esc((string)$page); ?> / <?php echo esc((string)$totalPages); ?></span>
            <a class="logout" href="/admin/?logout=1">Deconnexion</a>
        </div>
    </header>
    <div class="wrap">
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>Societe</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Interet</th>
                <th>Message</th>
                <th>IP</th>
            </tr>
            </thead>
            <tbody>
            <?php if (!$rows): ?>
                <tr><td colspan="8">Aucun message.</td></tr>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr>
                        <td><?php echo esc((string)$row['created_at']); ?></td>
                        <td><?php echo esc((string)$row['name']); ?></td>
                        <td><?php echo esc((string)$row['company']); ?></td>
                        <td><a href="mailto:<?php echo esc((string)$row['email']); ?>"><?php echo esc((string)$row['email']); ?></a></td>
                        <td><?php echo esc((string)$row['phone']); ?></td>
                        <td><?php echo esc((string)$row['interest']); ?><?php echo $row['other_interest'] ? ' - ' . esc((string)$row['other_interest']) : ''; ?></td>
                        <td class="message"><?php echo esc((string)$row['message']); ?></td>
                        <td><?php echo esc((string)$row['ip_address']); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
            </tbody>
        </table>
        <div class="pagination">
            <?php if ($page > 1): ?>
                <a href="/admin/?page=<?php echo esc((string)($page - 1)); ?>">Page precedente</a>
            <?php endif; ?>
            <?php if ($page < $totalPages): ?>
                <a href="/admin/?page=<?php echo esc((string)($page + 1)); ?>">Page suivante</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
