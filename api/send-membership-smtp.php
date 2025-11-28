<?php
/**
 * SMER Membership Application - Email Submission Handler
 * Uses SMTP with proper authentication for mail.sme-res.org
 * 
 * SMTP Configuration:
 * Server: mail.sme-res.org
 * Port: 465 (SSL/TLS)
 * Username: smer@sme-res.org
 * Password: [Configure in environment or .env file]
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers - CORS and content type
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 3600');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

// Accept both POST and GET requests for testing
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'GET') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed. Use POST or GET.']));
}

// Get input data from POST or GET
$input = null;

if ($method === 'POST') {
    // Try to get JSON from request body
    $raw_input = file_get_contents('php://input');
    $input = json_decode($raw_input, true);
    
    // If JSON parsing fails, try $_POST
    if ($input === null && !empty($_POST)) {
        $input = $_POST;
    }
} else if ($method === 'GET') {
    $input = $_GET;
}

// Validate input was received
if ($input === null || empty($input)) {
    http_response_code(400);
    exit(json_encode(['error' => 'No data received. Please send form data.']));
}

// Validate required fields
$required_fields = ['name', 'institution', 'emailId', 'mobileNumber', 'country'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $errors[] = "Field '$field' is required";
    }
}

if (!empty($errors)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Validation failed', 'details' => $errors]));
}

// Sanitize inputs
$name = htmlspecialchars(trim($input['name']));
$institution = htmlspecialchars(trim($input['institution']));
$emailId = filter_var(trim($input['emailId']), FILTER_SANITIZE_EMAIL);
$mobileNumber = htmlspecialchars(trim($input['mobileNumber']));
$scopusLink = htmlspecialchars(trim($input['scopusLink'] ?? ''));
$orcidLink = htmlspecialchars(trim($input['orcidLink'] ?? ''));
$googleScholarLink = htmlspecialchars(trim($input['googleScholarLink'] ?? ''));
$country = htmlspecialchars(trim($input['country']));

// Validate email
if (!filter_var($emailId, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid email address']));
}

// SMTP Configuration
$smtp_host = 'mail.sme-res.org';
$smtp_port = 465; // SSL/TLS
$smtp_username = 'smer@sme-res.org';
$smtp_password = getenv('SMER_EMAIL_PASSWORD') ?: 'smer2025@'; // Get from environment variable or use default

// Note: Use the email account's password configured in the mail server
// Incoming: IMAP Port 993, POP3 Port 995
// Outgoing: SMTP Port 465 (SSL/TLS)

// If password not set, use basic mail() function as fallback
$use_smtp = !empty($smtp_password);

// Prepare email content
$to = 'smer@sme-res.org';
$subject = 'SMER Membership Application - ' . $name;

$message = "SMER Membership Application\n\n";
$message .= "Name: " . $name . "\n";
$message .= "Institution: " . $institution . "\n";
$message .= "Email ID: " . $emailId . "\n";
$message .= "Mobile/Telephone Number: " . $mobileNumber . "\n";
$message .= "Scopus Link: " . (!empty($scopusLink) ? $scopusLink : 'Not provided') . "\n";
$message .= "ORCID Link: " . (!empty($orcidLink) ? $orcidLink : 'Not provided') . "\n";
$message .= "Google Scholar Link: " . (!empty($googleScholarLink) ? $googleScholarLink : 'Not provided') . "\n";
$message .= "Country: " . $country . "\n";
$message .= "\n---\n";
$message .= "Submitted on: " . date('Y-m-d H:i:s') . "\n";
$message .= "User IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Prepare headers
$headers = "From: smer@sme-res.org\r\n";
$headers .= "Reply-To: " . $emailId . "\r\n";
$headers .= "Return-Path: smer@sme-res.org\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: SMER Membership System\r\n";

$email_sent = false;

if ($use_smtp) {
    // Use SMTP with authentication via socket connection
    $email_sent = send_email_via_smtp(
        $smtp_host,
        $smtp_port,
        $smtp_username,
        $smtp_password,
        $to,
        $emailId,
        $subject,
        $message
    );
} else {
    // Fallback to PHP mail() function
    $email_sent = mail($to, $subject, $message, $headers);
}

// Log the submission
$log_file = __DIR__ . '/membership_submissions.log';
$log_entry = date('Y-m-d H:i:s') . " | " . $name . " | " . $emailId . " | " . $country . " | " . ($email_sent ? 'SUCCESS' : 'FAILED') . "\n";
file_put_contents($log_file, $log_entry, FILE_APPEND);

if ($email_sent) {
    http_response_code(200);
    exit(json_encode([
        'success' => true,
        'message' => 'Membership application submitted successfully. We will review your application and contact you soon.'
    ]));
} else {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to send email. Please try again later.']));
}

/**
 * Send email via SMTP with authentication
 */
function send_email_via_smtp($host, $port, $username, $password, $to, $from, $subject, $message) {
    try {
        // Create socket connection
        $socket = fsockopen('ssl://' . $host, $port, $errno, $errstr, 30);
        
        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }
        
        // Read server response
        $response = fgets($socket, 1024);
        if (strpos($response, '220') === false) {
            fclose($socket);
            return false;
        }
        
        // Send EHLO
        fputs($socket, "EHLO mail.sme-res.org\r\n");
        $response = fgets($socket, 1024);
        
        // Send AUTH LOGIN
        fputs($socket, "AUTH LOGIN\r\n");
        $response = fgets($socket, 1024);
        
        // Send username (base64 encoded)
        fputs($socket, base64_encode($username) . "\r\n");
        $response = fgets($socket, 1024);
        
        // Send password (base64 encoded)
        fputs($socket, base64_encode($password) . "\r\n");
        $response = fgets($socket, 1024);
        
        if (strpos($response, '235') === false) {
            error_log("SMTP Authentication failed");
            fclose($socket);
            return false;
        }
        
        // Send MAIL FROM
        fputs($socket, "MAIL FROM: <" . $username . ">\r\n");
        $response = fgets($socket, 1024);
        
        // Send RCPT TO
        fputs($socket, "RCPT TO: <" . $to . ">\r\n");
        $response = fgets($socket, 1024);
        
        // Send DATA
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 1024);
        
        // Send email headers and body
        $email_data = "From: " . $username . "\r\n";
        $email_data .= "To: " . $to . "\r\n";
        $email_data .= "Reply-To: " . $from . "\r\n";
        $email_data .= "Subject: " . $subject . "\r\n";
        $email_data .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $email_data .= "X-Mailer: SMER Membership System\r\n";
        $email_data .= "\r\n";
        $email_data .= $message . "\r\n";
        $email_data .= ".\r\n";
        
        fputs($socket, $email_data);
        $response = fgets($socket, 1024);
        
        // Send QUIT
        fputs($socket, "QUIT\r\n");
        fclose($socket);
        
        return strpos($response, '250') !== false;
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}
?>
