<?php
/**
 * SMER Admin Members API
 * Handles member approval/rejection and listing
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database configuration
$db_host = 'localhost';
$db_user = 'smeresor_smeresor';
$db_password = 'smer2025@';
$db_name = 'smeresor_smer';

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 3600');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = explode('/', trim($request_uri, '/'));

try {
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // GET /api/admin-members?status=pending - Get all applications by status
    if ($method === 'GET' && isset($_GET['status'])) {
        $status = $_GET['status'];
        
        $stmt = $conn->prepare("
            SELECT id, name, institution, email, mobile, country, status, submitted_at 
            FROM members 
            WHERE status = ? 
            ORDER BY submitted_at DESC
        ");
        
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('s', $status);
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $members = $result->fetch_all(MYSQLI_ASSOC);
        
        $stmt->close();
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'data' => $members,
            'count' => count($members)
        ]));
    }
    
    // GET /api/admin-members.php?id=123 - Get member details by query parameter
    if ($method === 'GET' && isset($_GET['id'])) {
        $member_id = intval($_GET['id']);
        
        $stmt = $conn->prepare("
            SELECT * FROM members WHERE id = ?
        ");
        
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('i', $member_id);
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $member = $result->fetch_assoc();
        
        $stmt->close();
        
        if (!$member) {
            http_response_code(404);
            exit(json_encode(['error' => 'Member not found']));
        }
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'data' => $member
        ]));
    }
    
    // PUT /api/admin-members.php?id=123&action=approve - Approve member
    if ($method === 'PUT' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'approve') {
        $input = json_decode(file_get_contents('php://input'), true);
        $member_id = intval($_GET['id']);
        $approved_by = $input['approved_by'] ?? 'admin';
        
        $stmt = $conn->prepare("
            UPDATE members 
            SET status = 'approved', approved_at = NOW(), approved_by = ?
            WHERE id = ?
        ");
        
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('si', $approved_by, $member_id);
        
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        // Get member email to send approval notification
        $select_stmt = $conn->prepare("SELECT email, name FROM members WHERE id = ?");
        if (!$select_stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $select_stmt->bind_param('i', $member_id);
        $select_stmt->execute();
        $result = $select_stmt->get_result();
        $member = $result->fetch_assoc();
        $select_stmt->close();
        
        // Send approval email
        if ($member) {
            send_approval_email($member['email'], $member['name']);
        }
        
        $stmt->close();
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'message' => 'Member approved successfully'
        ]));
    }
    
    // PUT /api/admin-members.php?id=123&action=reject - Reject member
    if ($method === 'PUT' && isset($_GET['id']) && isset($_GET['action']) && $_GET['action'] === 'reject') {
        $input = json_decode(file_get_contents('php://input'), true);
        $member_id = intval($_GET['id']);
        $reason = $input['reason'] ?? 'Application does not meet requirements';
        
        $stmt = $conn->prepare("
            UPDATE members 
            SET status = 'rejected', rejection_reason = ?
            WHERE id = ?
        ");
        
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('si', $reason, $member_id);
        
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        // Get member email to send rejection notification
        $select_stmt = $conn->prepare("SELECT email, name FROM members WHERE id = ?");
        if (!$select_stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $select_stmt->bind_param('i', $member_id);
        $select_stmt->execute();
        $result = $select_stmt->get_result();
        $member = $result->fetch_assoc();
        $select_stmt->close();
        
        // Send rejection email
        if ($member) {
            send_rejection_email($member['email'], $member['name'], $reason);
        }
        
        $stmt->close();
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'message' => 'Member rejected successfully'
        ]));
    }
    
    // GET /api/admin-members/stats - Get statistics
    if ($method === 'GET' && strpos($request_uri, 'stats') !== false) {
        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
            FROM members
        ");
        
        $stmt->execute();
        $result = $stmt->get_result();
        $stats = $result->fetch_assoc();
        
        $stmt->close();
        $conn->close();
        
        http_response_code(200);
        exit(json_encode([
            'success' => true,
            'data' => $stats
        ]));
    }
    
    http_response_code(404);
    exit(json_encode(['error' => 'Endpoint not found']));
    
} catch (Exception $e) {
    http_response_code(500);
    exit(json_encode(['error' => 'Server error: ' . $e->getMessage()]));
}

/**
 * Send approval email to member via SMTP
 */
function send_approval_email($email, $name) {
    $subject = 'SMER Membership Approved - ' . $name;
    $body = "Dear " . $name . ",\n\n";
    $body .= "Congratulations! Your SMER membership application has been approved.\n\n";
    $body .= "You can now access all member benefits and resources.\n\n";
    $body .= "Best regards,\nSMER Team";
    
    return send_email_via_smtp($email, $subject, $body);
}

/**
 * Send rejection email to member via SMTP
 */
function send_rejection_email($email, $name, $reason) {
    $subject = 'SMER Membership Application - Decision';
    $body = "Dear " . $name . ",\n\n";
    $body .= "Thank you for applying for SMER membership. Unfortunately, your application has not been approved at this time.\n\n";
    $body .= "Reason: " . $reason . "\n\n";
    $body .= "You may reapply in the future. For more information, please contact us.\n\n";
    $body .= "Best regards,\nSMER Team";
    
    return send_email_via_smtp($email, $subject, $body);
}

/**
 * Send email via SMTP with SSL/TLS authentication
 * Uses mail.sme-res.org on port 465
 */
function send_email_via_smtp($to, $subject, $message) {
    $smtp_host = 'mail.sme-res.org';
    $smtp_port = 465;
    $smtp_username = 'smer@sme-res.org';
    $smtp_password = getenv('SMER_EMAIL_PASSWORD') ?: 'smer2025@';
    
    try {
        // Create SSL socket connection
        $socket = fsockopen('ssl://' . $smtp_host, $smtp_port, $errno, $errstr, 30);
        
        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }
        
        // Read server response
        $response = fgets($socket, 1024);
        if (strpos($response, '220') === false) {
            fclose($socket);
            error_log("SMTP Server error: " . $response);
            return false;
        }
        
        // Send EHLO
        fputs($socket, "EHLO mail.sme-res.org\r\n");
        $response = fgets($socket, 1024);
        
        // Send AUTH LOGIN
        fputs($socket, "AUTH LOGIN\r\n");
        $response = fgets($socket, 1024);
        
        // Send username (base64 encoded)
        fputs($socket, base64_encode($smtp_username) . "\r\n");
        $response = fgets($socket, 1024);
        
        // Send password (base64 encoded)
        fputs($socket, base64_encode($smtp_password) . "\r\n");
        $response = fgets($socket, 1024);
        
        if (strpos($response, '235') === false) {
            error_log("SMTP Authentication failed: " . $response);
            fclose($socket);
            return false;
        }
        
        // Send MAIL FROM
        fputs($socket, "MAIL FROM: <" . $smtp_username . ">\r\n");
        $response = fgets($socket, 1024);
        
        // Send RCPT TO
        fputs($socket, "RCPT TO: <" . $to . ">\r\n");
        $response = fgets($socket, 1024);
        
        // Send DATA
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 1024);
        
        // Send email headers and body
        $email_data = "From: smer@sme-res.org\r\n";
        $email_data .= "To: " . $to . "\r\n";
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
        
        $success = strpos($response, '250') !== false;
        if ($success) {
            error_log("Email sent successfully to: " . $to);
        } else {
            error_log("SMTP send failed: " . $response);
        }
        
        return $success;
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        return false;
    }
}
?>
