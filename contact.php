<?php
/* ============================================================
   WSN — contact form handler
   Emails each enquiry from your Hostinger mailbox to your inbox
   over authenticated SMTP. Self-contained — no libraries needed.
   ============================================================ */

/* ---- CONFIG ------------------------------------------------ */
$MAIL_HOST      = 'smtp.hostinger.com';
$MAIL_PORT      = 465;                        // 465 = implicit SSL/TLS
$MAIL_USER      = 'contact@wsnstudio.co.uk';  // Hostinger mailbox (SMTP login)
$MAIL_FROM      = 'contact@wsnstudio.co.uk';  // must match the mailbox above
$MAIL_FROM_NAME = 'WSN Website';
$MAIL_TO        = 'contact@wsnstudio.co.uk';  // where enquiries arrive

/* The password is NEVER stored here. It is loaded from a file kept out of
   the repo (mail-secret.php), or from a WSN_MAIL_PASSWORD environment
   variable. See mail-secret.sample.php for how to create it. */
$MAIL_PASS = getenv('WSN_MAIL_PASSWORD') ?: '';
if ($MAIL_PASS === '' && is_file(__DIR__ . '/mail-secret.php')) {
    $secret = include __DIR__ . '/mail-secret.php';
    if (is_string($secret)) {
        $MAIL_PASS = $secret;
    }
}
if ($MAIL_PASS === '') {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Mail is not configured yet.']);
    error_log('WSN contact form: no mailbox password configured (create mail-secret.php).');
    exit;
}
/* ------------------------------------------------------------ */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

// Honeypot — if a bot filled the hidden field, pretend success and drop it.
if (!empty($_POST['company_url'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// Strip CR/LF from single-line values to prevent header injection.
function oneLine($v) { return trim(str_replace(["\r", "\n"], ' ', (string) $v)); }

$name     = oneLine($_POST['name'] ?? '');
$business = oneLine($_POST['business'] ?? '');
$email    = oneLine($_POST['email'] ?? '');
$interest = oneLine($_POST['interest'] ?? '');
$notes    = trim((string) ($_POST['notes'] ?? '')); // multi-line, body only

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please add your name and a valid email address.']);
    exit;
}

$subject = 'New enquiry from ' . $name . ($business !== '' ? ' (' . $business . ')' : '');
$body = implode("\r\n", [
    'New enquiry from the WSN website',
    '--------------------------------',
    'Name:     ' . $name,
    'Business: ' . ($business !== '' ? $business : '—'),
    'Email:    ' . $email,
    'Interest: ' . ($interest !== '' ? $interest : '—'),
    '',
    'Message:',
    ($notes !== '' ? $notes : '—'),
]);

$sent = smtp_send(
    $MAIL_HOST, $MAIL_PORT, $MAIL_USER, $MAIL_PASS,
    $MAIL_FROM, $MAIL_FROM_NAME, $MAIL_TO,
    $email, $name, $subject, $body
);

if ($sent === true) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(502);
    error_log('WSN contact form SMTP error: ' . $sent);
    echo json_encode(['ok' => false,
        'error' => 'Sorry, we couldn’t send that. Please email contact@wsnstudio.co.uk directly.']);
}

/* ---- Minimal SMTP client (SSL + AUTH LOGIN) --------------- */
function smtp_send($host, $port, $user, $pass, $from, $fromName, $to, $replyTo, $replyName, $subject, $body) {
    $ctx  = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $conn = @stream_socket_client("ssl://$host:$port", $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $ctx);
    if (!$conn) return "connect failed: $errstr ($errno)";
    stream_set_timeout($conn, 20);

    $read = function () use ($conn) {
        $data = '';
        while (($line = fgets($conn, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') break; // final line of a reply
        }
        return $data;
    };
    $cmd = function ($c) use ($conn, $read) { fwrite($conn, $c . "\r\n"); return $read(); };
    $ok  = function ($resp, $code) { return substr($resp, 0, 3) === (string) $code; };

    if (!$ok($read(), 220))                       return 'no greeting';
    if (!$ok($cmd('EHLO wsnstudio.co.uk'), 250))  return 'EHLO failed';
    if (!$ok($cmd('AUTH LOGIN'), 334))            return 'AUTH LOGIN not accepted';
    if (!$ok($cmd(base64_encode($user)), 334))    return 'username rejected';
    $auth = $cmd(base64_encode($pass));
    if (!$ok($auth, 235))                         return 'authentication failed (check the mailbox password)';
    if (!$ok($cmd('MAIL FROM:<' . $from . '>'), 250)) return 'MAIL FROM failed';
    if (!$ok($cmd('RCPT TO:<' . $to . '>'), 250))     return 'RCPT TO failed';
    if (!$ok($cmd('DATA'), 354))                      return 'DATA not accepted';

    $headers  = 'From: ' . mb_encode_mimeheader($fromName) . ' <' . $from . ">\r\n";
    $headers .= 'Reply-To: ' . mb_encode_mimeheader($replyName) . ' <' . $replyTo . ">\r\n";
    $headers .= 'To: <' . $to . ">\r\n";
    $headers .= 'Subject: ' . mb_encode_mimeheader($subject) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";

    $safeBody = preg_replace('/^\./m', '..', $body); // dot-stuffing
    if (!$ok($cmd($headers . "\r\n" . $safeBody . "\r\n."), 250)) return 'message not accepted';

    $cmd('QUIT');
    fclose($conn);
    return true;
}
