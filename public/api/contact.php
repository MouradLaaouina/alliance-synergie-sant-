<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

ini_set('display_errors', '0');
error_reporting(E_ALL);

$allowedOrigins = [
    // 'https://a2s.ma',
    // 'https://www.a2s.ma',
];
$recipientEmail = 'mourad.laaouina@gmail.com';
$fromEmail = 'noreply@a2s.ma';
$subjectPrefix = '[Alliance synergie santé Contact]';
$rateLimitMax = 5;
$rateLimitWindowSeconds = 3600;
$maxPayloadBytes = 16384;
$dbConfigPath = dirname(__DIR__, 2) . '/config_db.php';
$dbConfigFallbackPath = __DIR__ . '/config_db.php';
$turnstileSecret = '0x4AAAAAACWGqwjPCS-shj97L1I_lJfIG5I';
$turnstileVerifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
$captchaEnabled = $turnstileSecret !== '' && $turnstileSecret !== 'change_me';

function respond(bool $success, string $message, int $status = 200, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

function safe_len(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

function strip_newlines(string $value): string
{
    return str_replace(["\r", "\n"], ' ', $value);
}

function normalize_message(string $value): string
{
    $value = trim($value);
    return preg_replace("/\r\n?/", "\n", $value);
}

function is_origin_allowed(string $origin, array $allowedOrigins): bool
{
    if (in_array('*', $allowedOrigins, true)) {
        return true;
    }

    return in_array($origin, $allowedOrigins, true);
}

function apply_cors(array $allowedOrigins): void
{
    if (empty($allowedOrigins)) {
        return;
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }

    if (!is_origin_allowed($origin, $allowedOrigins)) {
        respond(false, 'Origin not allowed.', 403);
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
}

function check_rate_limit(string $key, int $maxAttempts, int $windowSeconds): bool
{
    $dir = sys_get_temp_dir();
    $file = $dir . DIRECTORY_SEPARATOR . 'a2s_contact_' . hash('sha256', $key) . '.json';
    $now = time();

    $payload = [
        'count' => 0,
        'reset' => $now + $windowSeconds,
    ];

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return true;
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return true;
    }

    $existing = stream_get_contents($handle);
    if ($existing) {
        $decoded = json_decode($existing, true);
        if (is_array($decoded) && isset($decoded['count'], $decoded['reset'])) {
            $payload = $decoded;
        }
    }

    if ($now > (int) $payload['reset']) {
        $payload = [
            'count' => 0,
            'reset' => $now + $windowSeconds,
        ];
    }

    if ((int) $payload['count'] >= $maxAttempts) {
        flock($handle, LOCK_UN);
        fclose($handle);
        return false;
    }

    $payload['count'] = (int) $payload['count'] + 1;

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($payload));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return true;
}

function verify_turnstile(string $secret, string $token, string $ip, string $verifyUrl): bool
{
    if ($secret === '') {
        return false;
    }

    if ($token === '') {
        return false;
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $ip,
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 6,
        ],
    ]);

    $response = @file_get_contents($verifyUrl, false, $context);
    if ($response === false) {
        return false;
    }

    $result = json_decode($response, true);
    if (!is_array($result)) {
        return false;
    }

    return !empty($result['success']);
}

apply_cors($allowedOrigins);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > $maxPayloadBytes) {
    respond(false, 'Payload too large.', 413);
}

$raw = file_get_contents('php://input', false, null, 0, $maxPayloadBytes + 1);
if ($raw !== false && strlen($raw) > $maxPayloadBytes) {
    respond(false, 'Payload too large.', 413);
}

$payload = json_decode((string)$raw, true);
if ($raw !== '' && $payload === null && json_last_error() !== JSON_ERROR_NONE) {
    respond(false, 'Invalid JSON.', 400);
}

if (!is_array($payload) || $payload === []) {
    $payload = $_POST;
}

if (!is_array($payload) || $payload === []) {
    respond(false, 'Invalid payload.', 400);
}

$honeypot = trim((string)($payload['website_url'] ?? ''));
if ($honeypot !== '') {
    respond(true, 'Thank you.', 200);
}

$name = strip_newlines(trim((string)($payload['name'] ?? '')));
$company = strip_newlines(trim((string)($payload['company'] ?? '')));
$email = strip_newlines(trim((string)($payload['email'] ?? '')));
$phone = strip_newlines(trim((string)($payload['phone'] ?? '')));
$interest = strip_newlines(trim((string)($payload['interest'] ?? '')));
$otherInterest = strip_newlines(trim((string)($payload['otherInterest'] ?? '')));
$message = normalize_message((string)($payload['message'] ?? ''));
$captchaToken = trim((string)($payload['captchaToken'] ?? ''));

if ($name === '' || $company === '' || $email === '' || $phone === '' || $interest === '' || $message === '') {
    respond(false, 'Missing required fields.', 422);
}

if ($interest === 'Autres' && $otherInterest === '') {
    respond(false, 'Missing other interest.', 422);
}

if (safe_len($name) > 100 || safe_len($company) > 120 || safe_len($email) > 254) {
    respond(false, 'Field length exceeded.', 422);
}

if (safe_len($phone) > 40 || safe_len($interest) > 120 || safe_len($otherInterest) > 120) {
    respond(false, 'Field length exceeded.', 422);
}

if (safe_len($message) > 4000) {
    respond(false, 'Message too long.', 422);
}

if (safe_len($captchaToken) > 2048) {
    respond(false, 'Invalid captcha token.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.', 422);
}

if (!preg_match('/^[0-9+().\\s-]+$/', $phone)) {
    respond(false, 'Invalid phone number.', 422);
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = strip_newlines((string)($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));

if (!check_rate_limit($clientIp . '|' . $userAgent, $rateLimitMax, $rateLimitWindowSeconds)) {
    respond(false, 'Too many requests. Please try again later.', 429);
}

if ($captchaEnabled) {
    if (!verify_turnstile($turnstileSecret, $captchaToken, $clientIp, $turnstileVerifyUrl)) {
        respond(false, 'Captcha invalid.', 422);
    }
}

$dbConfig = null;
if (is_readable($dbConfigPath)) {
    $dbConfig = require $dbConfigPath;
} elseif (is_readable($dbConfigFallbackPath)) {
    $dbConfig = require $dbConfigFallbackPath;
}

if (!is_array($dbConfig) || empty($dbConfig['enabled'])) {
    respond(false, 'Database configuration missing.', 500);
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
    respond(false, 'Database connection failed.', 500);
}

try {
    $stmt = $pdo->prepare(
        'INSERT INTO contact_messages
            (name, company, email, phone, interest, other_interest, message, ip_address, created_at)
         VALUES
            (:name, :company, :email, :phone, :interest, :other_interest, :message, :ip_address, NOW())'
    );
    $stmt->execute([
        ':name' => $name,
        ':company' => $company,
        ':email' => $email,
        ':phone' => $phone,
        ':interest' => $interest,
        ':other_interest' => $otherInterest !== '' ? $otherInterest : null,
        ':message' => $message,
        ':ip_address' => $clientIp,
    ]);
} catch (PDOException $e) {
    respond(false, 'Database insert failed.', 500);
}

$subject = $subjectPrefix . ' ' . $interest;
if ($interest === 'Autres' && $otherInterest !== '') {
    $subject .= ' - ' . $otherInterest;
}

$bodyLines = [
    'Nouvelle demande depuis le formulaire de contact A2S',
    '',
    'Nom: ' . $name,
    'Societe: ' . $company,
    'Email: ' . $email,
    'Telephone: ' . $phone,
    'Interet: ' . $interest,
    'Autre interet: ' . ($otherInterest ?: '-'),
    '',
    'Message:',
    $message,
    '',
    'IP: ' . $clientIp,
    'User-Agent: ' . $userAgent,
    'Date: ' . date('c'),
];

$headers = [
    'From: A2S Contact <' . $fromEmail . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($recipientEmail, $subject, implode("\n", $bodyLines), implode("\r\n", $headers));

if (!$sent) {
    respond(false, 'Unable to send email at the moment.', 500);
}

// Send confirmation email to client (HTML version)
$confirmationSubject = 'Confirmation de réception - Alliance Synergie Santé';

// Load HTML template
$templatePath = __DIR__ . '/email_template_confirmation.html';
if (!file_exists($templatePath)) {
    // Fallback to text version if template not found
    $confirmationBody = "Bonjour $name,\n\n"
        . "Nous avons bien reçu votre demande de contact et vous en remercions.\n\n"
        . "Notre équipe prendra connaissance de votre message dans les plus brefs délais et vous contactera prochainement pour donner suite à votre demande.\n\n"
        . "Récapitulatif de votre demande :\n"
        . "• Société : $company\n"
        . "• Sujet : $interest" . ($otherInterest !== '' ? " - $otherInterest" : '') . "\n"
        . "• Téléphone : $phone\n\n"
        . "Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement au +212 5 22 37 35 50.\n\n"
        . "Cordialement,\n\n"
        . "──────────────────────────────────────\n"
        . "Alliance Synergie Santé (A2S)\n"
        . "Leader de la Dermo-Cosmétique au Maroc\n\n"
        . "📍 145 Bd Hassan II, Casablanca 20000, Maroc\n"
        . "📞 +212 5 22 37 35 50\n"
        . "✉️  contact@a2s.ma\n"
        . "🌐 https://a2s.ma\n\n"
        . "LinkedIn : https://www.linkedin.com/company/a2smaroc/\n"
        . "Instagram : https://www.instagram.com/a2s.maroc.officiel\n"
        . "Facebook : https://www.facebook.com/alliancesynergiesanteofficiel\n"
        . "──────────────────────────────────────\n\n"
        . "Depuis 2009, votre partenaire stratégique pour une croissance durable.\n";
    $isHtml = false;
} else {
    $confirmationBody = file_get_contents($templatePath);

    // Replace placeholders with actual data
    $confirmationBody = str_replace('{{NAME}}', htmlspecialchars($name, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $confirmationBody = str_replace('{{COMPANY}}', htmlspecialchars($company, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $interestValue = $interest . ($otherInterest !== '' ? ' - ' . $otherInterest : '');
    $confirmationBody = str_replace('{{INTEREST}}', htmlspecialchars($interestValue, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $confirmationBody = str_replace('{{PHONE}}', htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'), $confirmationBody);
    $isHtml = true;
}

// Set headers based on content type
$confirmationHeaders = [
    'From: Alliance Synergie Santé <' . $fromEmail . '>',
    'Reply-To: contact@a2s.ma',
    'MIME-Version: 1.0',
];

if ($isHtml) {
    $confirmationHeaders[] = 'Content-Type: text/html; charset=UTF-8';
} else {
    $confirmationHeaders[] = 'Content-Type: text/plain; charset=UTF-8';
}

// Send confirmation email (don't block on failure)
@mail($email, $confirmationSubject, $confirmationBody, implode("\r\n", $confirmationHeaders));

respond(true, 'Message sent.');
