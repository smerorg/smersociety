<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database configuration
$db_host = 'localhost';
$db_user = 'smeresor_smeresor';
$db_password = 'smer2025@';
$db_name = 'smeresor_smer';

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

// SMTP Configuration for smer@sme-res.org
// Server: mail.sme-res.org
// SMTP Port: 465 (SSL/TLS)
// Username: smer@sme-res.org
// Password: [Use the email account's password]

// Configure PHP mail function with SMTP settings
ini_set('SMTP', 'mail.sme-res.org');
ini_set('smtp_port', '465');

// For production, you should use PHPMailer or SwiftMailer for better SMTP handling
// This is a basic implementation using PHP's mail() function

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

// Prepare headers with proper formatting
$headers = "From: smer@sme-res.org\r\n";
$headers .= "Reply-To: " . $emailId . "\r\n";
$headers .= "Return-Path: smer@sme-res.org\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: SMER Membership System\r\n";

// Connect to database
try {
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // Insert membership application into database
    $stmt = $conn->prepare("
        INSERT INTO members (name, institution, email, mobile, scopus_link, orcid_link, google_scholar_link, country, status, submitted_at, user_ip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), ?)
    ");
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param(
        'sssssssss',
        $name,
        $institution,
        $emailId,
        $mobileNumber,
        $scopusLink,
        $orcidLink,
        $googleScholarLink,
        $country,
        $_SERVER['REMOTE_ADDR']
    );
    
    if ($stmt->execute()) {
        $member_id = $stmt->insert_id;
        
        // Send confirmation email
        $email_subject = 'SMER Membership Application Received - ' . $name;
        $email_body = "Dear " . $name . ",\n\n";
        $email_body .= "Thank you for applying for SMER membership. Your application has been received and is under review.\n";
        $email_body .= "Application ID: " . $member_id . "\n\n";
        $email_body .= "We will contact you soon with the approval status.\n\n";
        $email_body .= "Best regards,\nSMER Team";
        
        $email_headers = "From: smer@sme-res.org\r\n";
        $email_headers .= "Reply-To: smer@sme-res.org\r\n";
        $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Send confirmation email to applicant
        mail($emailId, $email_subject, $email_body, $email_headers);
        
        // Send notification to admin
        $admin_subject = 'New SMER Membership Application - ' . $name;
        $admin_body = "New membership application received:\n\n";
        $admin_body .= "Name: " . $name . "\n";
        $admin_body .= "Institution: " . $institution . "\n";
        $admin_body .= "Email: " . $emailId . "\n";
        $admin_body .= "Mobile: " . $mobileNumber . "\n";
        $admin_body .= "Country: " . $country . "\n";
        $admin_body .= "Application ID: " . $member_id . "\n\n";
        $admin_body .= "Please review and approve/reject this application in the admin panel.";
        
        mail($to, $admin_subject, $admin_body, $email_headers);
        
        $stmt->close();
        $conn->close();
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'message' => 'Membership application submitted successfully. We will review your application and contact you soon.',
            'application_id' => $member_id
        ]));
    } else {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to process application: ' . $e->getMessage()]));
}
?>
