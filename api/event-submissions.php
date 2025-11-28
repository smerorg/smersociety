<?php
/**
 * SMER Member Event Submission API
 * - Accepts event submissions with up to 3 images
 * - Stores uploads under api/uploads
 * - Sends notification email to SMER admin
 * - Allows admin approval/rejection and exposes approved events for the gallery
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(json_encode(['status' => 'ok']));
}

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/uploads';

if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        error_log("Failed to create upload directory: $uploadDir");
    }
}

// Ensure upload directory is writable
if (!is_writable($uploadDir)) {
    error_log("Upload directory is not writable: $uploadDir");
}

$dbConfig = [
    'host' => 'localhost',
    'user' => 'smeresor_smeresor',
    'password' => 'smer2025@',
    'name' => 'smeresor_smer'
];

try {
    $conn = new mysqli($dbConfig['host'], $dbConfig['user'], $dbConfig['password'], $dbConfig['name']);
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
} catch (Exception $e) {
    http_response_code(500);
    exit(json_encode(['error' => $e->getMessage()]));
}

switch ($method) {
    case 'POST':
        handle_event_submission($conn, $uploadDir);
        break;
    case 'GET':
        handle_event_fetch($conn);
        break;
    case 'PUT':
        handle_event_update($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();

function handle_event_submission(mysqli $conn, string $uploadDir): void
{
    // Check content type
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (strpos($contentType, 'multipart/form-data') === false) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Content-Type must be multipart/form-data',
            'received' => $contentType
        ]);
        return;
    }
    
    // Verify upload directory exists and is writable
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create upload directory. Please contact administrator.']);
            return;
        }
    }
    
    if (!is_writable($uploadDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'Upload directory is not writable. Please contact administrator.']);
        return;
    }

    $requiredFields = [
        'full_name', 'email', 'institution', 'country',
        'event_title', 'event_type', 'event_date',
        'event_location', 'event_description'
    ];

    $errors = [];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            $errors[] = "Field '{$field}' is required";
        }
    }

    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(['error' => 'Validation failed', 'details' => $errors]);
        return;
    }

    // Check if photos were uploaded
    if (empty($_FILES['photos'])) {
        http_response_code(422);
        echo json_encode([
            'error' => 'Please upload three event photos.',
            'debug' => 'No photos field found in upload'
        ]);
        return;
    }

    // Log received files for debugging
    error_log("Received FILES: " . print_r($_FILES, true));
    
    $photos = normalize_upload_array($_FILES['photos']);
    
    // Log normalized photos for debugging
    error_log("Normalized photos count: " . count($photos));
    foreach ($photos as $idx => $photo) {
        error_log("Photo " . ($idx + 1) . ": name=" . ($photo['name'] ?? 'empty') . 
                  ", error=" . ($photo['error'] ?? 'unknown') . 
                  ", size=" . ($photo['size'] ?? 0) . 
                  ", tmp_name=" . ($photo['tmp_name'] ?? 'none'));
    }
    
    if (count($photos) < 3) {
        http_response_code(422);
        echo json_encode([
            'error' => 'Exactly three photos are required.',
            'received' => count($photos),
            'details' => 'Please select exactly three images before submitting.'
        ]);
        return;
    }
    
    // Ensure we only process exactly 3 photos
    $photos = array_slice($photos, 0, 3);

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    $maxSize = 6 * 1024 * 1024; // 6MB
    $storedPhotos = [];

    foreach ($photos as $index => $photo) {
        $photoNum = $index + 1;
        
        // Check upload error
        if ($photo['error'] !== UPLOAD_ERR_OK) {
            $errorMsg = 'Error uploading photo #' . $photoNum;
            if ($photo['error'] === UPLOAD_ERR_INI_SIZE || $photo['error'] === UPLOAD_ERR_FORM_SIZE) {
                $errorMsg .= ': File size exceeds limit';
            } elseif ($photo['error'] === UPLOAD_ERR_PARTIAL) {
                $errorMsg .= ': File was only partially uploaded';
            } elseif ($photo['error'] === UPLOAD_ERR_NO_FILE) {
                $errorMsg .= ': No file was uploaded';
            } elseif ($photo['error'] === UPLOAD_ERR_NO_TMP_DIR) {
                $errorMsg .= ': Missing temporary folder';
            } elseif ($photo['error'] === UPLOAD_ERR_CANT_WRITE) {
                $errorMsg .= ': Failed to write file to disk';
            } else {
                $errorMsg .= ': Upload error code ' . $photo['error'];
            }
            cleanup_uploaded_files($storedPhotos);
            http_response_code(400);
            echo json_encode(['error' => $errorMsg]);
            return;
        }

        // Check file size
        if ($photo['size'] > $maxSize) {
            cleanup_uploaded_files($storedPhotos);
            http_response_code(413);
            echo json_encode(['error' => "Photo #{$photoNum} exceeds 6MB limit."]);
            return;
        }

        // Check if tmp file exists
        if (!file_exists($photo['tmp_name']) || !is_uploaded_file($photo['tmp_name'])) {
            cleanup_uploaded_files($storedPhotos);
            http_response_code(400);
            echo json_encode(['error' => "Photo #{$photoNum}: Invalid upload file."]);
            return;
        }

        // Check MIME type
        $mimeType = mime_content_type($photo['tmp_name']);
        if (!in_array($mimeType, $allowedTypes, true)) {
            cleanup_uploaded_files($storedPhotos);
            http_response_code(415);
            echo json_encode(['error' => "Photo #{$photoNum}: Invalid file type. Only JPG, PNG, or WEBP allowed."]);
            return;
        }

        // Get file extension
        $extension = strtolower(pathinfo($photo['name'], PATHINFO_EXTENSION));
        if (!$extension) {
            // Try to determine extension from MIME type
            if ($mimeType === 'image/jpeg') $extension = 'jpg';
            elseif ($mimeType === 'image/png') $extension = 'png';
            elseif ($mimeType === 'image/webp') $extension = 'webp';
            else $extension = 'jpg';
        }

        $fileName = uniqid('event_', true) . '.' . $extension;
        $targetPath = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $fileName;

        // Move uploaded file
        if (!move_uploaded_file($photo['tmp_name'], $targetPath)) {
            cleanup_uploaded_files($storedPhotos);
            $errorDetails = error_get_last();
            http_response_code(500);
            echo json_encode([
                'error' => "Failed to store photo #{$photoNum}.",
                'details' => $errorDetails ? $errorDetails['message'] : 'Unknown error'
            ]);
            return;
        }

        // Verify file was written
        if (!file_exists($targetPath)) {
            cleanup_uploaded_files($storedPhotos);
            http_response_code(500);
            echo json_encode(['error' => "Photo #{$photoNum} was not saved correctly."]);
            return;
        }

        $storedPhotos[] = 'uploads/' . $fileName;
        
        // Stop after 3 photos
        if (count($storedPhotos) >= 3) {
            break;
        }
    }

    if (count($storedPhotos) < 3) {
        cleanup_uploaded_files($storedPhotos);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to process uploaded photos.']);
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO event_submissions (
            full_name, email, phone_country_code, phone_number,
            institution, country, event_title, event_type, event_date,
            event_location, event_description, event_objectives, target_audience,
            photo_one, photo_two, photo_three, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    if (!$stmt) {
        cleanup_uploaded_files($storedPhotos);
        http_response_code(500);
        echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
        return;
    }

    $fullName = sanitize($_POST['full_name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        cleanup_uploaded_files($storedPhotos);
        http_response_code(422);
        echo json_encode(['error' => 'Invalid email address.']);
        return;
    }

    $phoneCode = sanitize($_POST['phone_country_code'] ?? '');
    $phoneNumber = sanitize($_POST['phone_number'] ?? '');
    $institution = sanitize($_POST['institution']);
    $country = sanitize($_POST['country']);
    $eventTitle = sanitize($_POST['event_title']);
    $eventType = sanitize($_POST['event_type']);
    $eventDate = sanitize($_POST['event_date']);
    $eventLocation = sanitize($_POST['event_location']);
    $eventDescription = sanitize($_POST['event_description']);
    $eventObjectives = sanitize($_POST['event_objectives'] ?? '');
    $targetAudience = sanitize($_POST['target_audience'] ?? '');

    $stmt->bind_param(
        'ssssssssssssssss',
        $fullName,
        $email,
        $phoneCode,
        $phoneNumber,
        $institution,
        $country,
        $eventTitle,
        $eventType,
        $eventDate,
        $eventLocation,
        $eventDescription,
        $eventObjectives,
        $targetAudience,
        $storedPhotos[0],
        $storedPhotos[1],
        $storedPhotos[2]
    );

    if (!$stmt->execute()) {
        cleanup_uploaded_files($storedPhotos);
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $stmt->error]);
        return;
    }

    $insertId = $stmt->insert_id;
    $stmt->close();

    // Send email notification to admin
    $emailSent = send_admin_notification(
        $fullName, 
        $email, 
        $institution,
        $phoneCode,
        $phoneNumber,
        $eventTitle, 
        $eventType, 
        $eventDate, 
        $eventLocation,
        $country,
        $eventDescription,
        $insertId
    );
    
    // Log email status (don't fail the submission if email fails)
    if (!$emailSent) {
        error_log("Failed to send admin notification email for event submission ID: $insertId");
    } else {
        error_log("Admin notification email sent successfully for event submission ID: $insertId");
    }

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Event submitted successfully. The admin team will review it shortly.',
        'id' => $insertId
    ]);
}

function handle_event_fetch(mysqli $conn): void
{
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM event_submissions WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $event = $result->fetch_assoc();
        $stmt->close();

        if (!$event) {
            http_response_code(404);
            echo json_encode(['error' => 'Event submission not found.']);
            return;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => normalize_event_record($event)
        ]);
        return;
    }

    $status = $_GET['status'] ?? 'approved';
    $allowedStatuses = ['pending', 'approved', 'rejected'];
    if (!in_array($status, $allowedStatuses, true)) {
        $status = 'approved';
    }

    $stmt = $conn->prepare("SELECT * FROM event_submissions WHERE status = ? ORDER BY created_at DESC");
    $stmt->bind_param('s', $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $events = [];

    while ($row = $result->fetch_assoc()) {
        $events[] = normalize_event_record($row);
    }

    $stmt->close();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'count' => count($events),
        'data' => $events
    ]);
}

function handle_event_update(mysqli $conn): void
{
    parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
    if (empty($query['id']) || empty($query['action'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Event id and action are required.']);
        return;
    }

    $id = (int) $query['id'];
    $action = $query['action'];
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];

    $stmt = $conn->prepare("SELECT * FROM event_submissions WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $event = $result->fetch_assoc();
    $stmt->close();

    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event submission not found.']);
        return;
    }

    if ($action === 'approve') {
        $approvedPhoto = $payload['approved_photo'] ?? '';
        $validPhotos = [$event['photo_one'], $event['photo_two'], $event['photo_three']];

        if (!in_array($approvedPhoto, $validPhotos, true)) {
            http_response_code(422);
            echo json_encode(['error' => 'Approved photo must match one of the uploaded files.']);
            return;
        }

        $stmt = $conn->prepare("
            UPDATE event_submissions
            SET status = 'approved', approved_photo = ?, admin_notes = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $adminNotes = $payload['admin_notes'] ?? null;
        $stmt->bind_param('ssi', $approvedPhoto, $adminNotes, $id);
        $stmt->execute();
        $stmt->close();

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Event approved successfully.']);
        return;
    }

    if ($action === 'reject') {
        $reason = $payload['reason'] ?? 'Event submission does not meet the requirements.';
        $stmt = $conn->prepare("
            UPDATE event_submissions
            SET status = 'rejected', admin_notes = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->bind_param('si', $reason, $id);
        $stmt->execute();
        $stmt->close();

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Event rejected successfully.']);
        return;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unsupported action.']);
}

function normalize_upload_array(array $files): array
{
    $normalized = [];
    
    // Check if files are sent as array (multiple files with same field name)
    if (is_array($files['name'])) {
        foreach ($files['name'] as $index => $name) {
            // Include all files, even if name is empty, to catch errors
            $normalized[] = [
                'name' => $name ?? '',
                'type' => $files['type'][$index] ?? null,
                'tmp_name' => $files['tmp_name'][$index] ?? null,
                'error' => $files['error'][$index] ?? UPLOAD_ERR_NO_FILE,
                'size' => $files['size'][$index] ?? 0,
            ];
        }
    } else {
        // Single file upload
        $normalized[] = [
            'name' => $files['name'] ?? '',
            'type' => $files['type'] ?? null,
            'tmp_name' => $files['tmp_name'] ?? null,
            'error' => $files['error'] ?? UPLOAD_ERR_NO_FILE,
            'size' => $files['size'] ?? 0,
        ];
    }
    
    return $normalized;
}

function cleanup_uploaded_files(array $relativePaths): void
{
    $uploadDir = __DIR__ . '/uploads';
    foreach ($relativePaths as $path) {
        // Handle both 'uploads/filename.jpg' and just 'filename.jpg'
        $filename = basename($path);
        $fullPath = $uploadDir . '/' . $filename;
        if (is_file($fullPath)) {
            @unlink($fullPath);
            error_log("Cleaned up file: $fullPath");
        }
    }
}

function sanitize(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function build_file_url(?string $path): ?string
{
    if (!$path) {
        return null;
    }

    // Use the specified base URL for uploads
    $baseUrl = 'https://sme-res.org/api/uploads';
    
    // Extract just the filename from the path if it includes 'uploads/'
    $filename = basename($path);
    
    return $baseUrl . '/' . $filename;
}

function normalize_event_record(array $row): array
{
    $photos = [
        ['path' => $row['photo_one'], 'url' => build_file_url($row['photo_one'])],
        ['path' => $row['photo_two'], 'url' => build_file_url($row['photo_two'])],
        ['path' => $row['photo_three'], 'url' => build_file_url($row['photo_three'])],
    ];

    return [
        'id' => (int) $row['id'],
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'phone_country_code' => $row['phone_country_code'],
        'phone_number' => $row['phone_number'],
        'institution' => $row['institution'],
        'country' => $row['country'],
        'event_title' => $row['event_title'],
        'event_type' => $row['event_type'],
        'event_date' => $row['event_date'],
        'event_location' => $row['event_location'],
        'event_description' => $row['event_description'],
        'event_objectives' => $row['event_objectives'],
        'target_audience' => $row['target_audience'],
        'status' => $row['status'],
        'admin_notes' => $row['admin_notes'],
        'photos' => $photos,
        'approved_photo_path' => $row['approved_photo'],
        'approved_photo_url' => build_file_url($row['approved_photo']),
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    ];
}

function send_admin_notification(
    string $name, 
    string $email, 
    string $institution,
    string $phoneCode,
    string $phoneNumber,
    string $eventTitle, 
    string $eventType, 
    string $eventDate, 
    string $eventLocation,
    string $country,
    string $eventDescription,
    int $submissionId
): bool
{
    $to = 'smer@sme-res.org';
    $subject = 'New SMER Event Submission - ' . $eventTitle;
    
    $body = "Dear Admin,\n\n";
    $body .= "A member has submitted a new event for review.\n\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $body .= "SUBMISSION DETAILS\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    
    $body .= "Submission ID: #{$submissionId}\n";
    $body .= "Submitted on: " . date('Y-m-d H:i:s') . "\n\n";
    
    $body .= "MEMBER INFORMATION:\n";
    $body .= "─────────────────────────────────────────────────────\n";
    $body .= "Full Name: {$name}\n";
    $body .= "Email: {$email}\n";
    $body .= "Institution/Organization: {$institution}\n";
    $body .= "Phone: " . ($phoneCode ? $phoneCode . ' ' : '') . $phoneNumber . "\n";
    $body .= "Country: {$country}\n\n";
    
    $body .= "EVENT INFORMATION:\n";
    $body .= "─────────────────────────────────────────────────────\n";
    $body .= "Event Title: {$eventTitle}\n";
    $body .= "Event Type: {$eventType}\n";
    $body .= "Event Date: {$eventDate}\n";
    $body .= "Event Location: {$eventLocation}\n";
    $body .= "Event Description:\n{$eventDescription}\n\n";
    
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    $body .= "ACTION REQUIRED:\n";
    $body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $body .= "Please log into the admin dashboard to:\n";
    $body .= "1. Review the event details\n";
    $body .= "2. View the uploaded photos (3 images)\n";
    $body .= "3. Select one photo to feature in the gallery\n";
    $body .= "4. Approve or reject the submission\n\n";
    
    $body .= "Admin Panel: https://www.sme-res.org/#admin\n\n";
    $body .= "Best regards,\n";
    $body .= "SMER Website System\n";
    $body .= "smer@sme-res.org\n";

    return send_email_via_smtp($to, $subject, $body);
}

function send_email_via_smtp(string $to, string $subject, string $message): bool
{
    $smtp_host = 'mail.sme-res.org';
    $smtp_port = 465;
    $smtp_username = 'smer@sme-res.org';
    $smtp_password = getenv('SMER_EMAIL_PASSWORD') ?: 'smer2025@';

    try {
        // Open SSL connection
        $socket = @fsockopen('ssl://' . $smtp_host, $smtp_port, $errno, $errstr, 30);
        if (!$socket) {
            error_log("SMTP Connection failed to {$smtp_host}:{$smtp_port} - $errstr ($errno)");
            return false;
        }

        // Read initial server response
        $response = fgets($socket, 1024);
        if (strpos($response, '220') === false) {
            error_log("SMTP Server initial response error: " . trim($response));
            fclose($socket);
            return false;
        }

        // Send EHLO
        fputs($socket, "EHLO mail.sme-res.org\r\n");
        $response = fgets($socket, 1024);
        // Read multi-line EHLO response if needed
        while (strpos($response, '250 ') === false && strpos($response, '250-') !== false) {
            $response = fgets($socket, 1024);
        }

        // Authenticate
        fputs($socket, "AUTH LOGIN\r\n");
        $response = fgets($socket, 1024);
        if (strpos($response, '334') === false) {
            error_log("SMTP AUTH LOGIN failed: " . trim($response));
            fclose($socket);
            return false;
        }

        // Send username
        fputs($socket, base64_encode($smtp_username) . "\r\n");
        $response = fgets($socket, 1024);
        if (strpos($response, '334') === false) {
            error_log("SMTP Username rejected: " . trim($response));
            fclose($socket);
            return false;
        }

        // Send password
        fputs($socket, base64_encode($smtp_password) . "\r\n");
        $authResponse = fgets($socket, 1024);

        if (strpos($authResponse, '235') === false) {
            error_log("SMTP Authentication failed: " . trim($authResponse));
            fclose($socket);
            return false;
        }

        // Set sender
        fputs($socket, "MAIL FROM: <{$smtp_username}>\r\n");
        $response = fgets($socket, 1024);
        if (strpos($response, '250') === false) {
            error_log("SMTP MAIL FROM failed: " . trim($response));
            fclose($socket);
            return false;
        }

        // Set recipient
        fputs($socket, "RCPT TO: <{$to}>\r\n");
        $response = fgets($socket, 1024);
        if (strpos($response, '250') === false) {
            error_log("SMTP RCPT TO failed: " . trim($response));
            fclose($socket);
            return false;
        }

        // Send email data
        fputs($socket, "DATA\r\n");
        $response = fgets($socket, 1024);
        if (strpos($response, '354') === false) {
            error_log("SMTP DATA command failed: " . trim($response));
            fclose($socket);
            return false;
        }

        // Build email headers and body
        $emailData = "From: SMER Website <{$smtp_username}>\r\n";
        $emailData .= "To: {$to}\r\n";
        $emailData .= "Reply-To: {$smtp_username}\r\n";
        $emailData .= "Subject: {$subject}\r\n";
        $emailData .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $emailData .= "X-Mailer: SMER Event Submission System\r\n";
        $emailData .= "\r\n";
        $emailData .= $message . "\r\n";
        $emailData .= ".\r\n";

        fputs($socket, $emailData);
        $sendResponse = fgets($socket, 1024);
        
        // Read multi-line response if needed
        while (strpos($sendResponse, '250 ') === false && strpos($sendResponse, '250-') !== false) {
            $sendResponse = fgets($socket, 1024);
        }

        // Quit
        fputs($socket, "QUIT\r\n");
        fclose($socket);

        $success = strpos($sendResponse, '250') !== false;
        if ($success) {
            error_log("Email sent successfully to: {$to}");
        } else {
            error_log("Email send failed. Response: " . trim($sendResponse));
        }

        return $success;
    } catch (Exception $e) {
        error_log("SMTP Exception: " . $e->getMessage());
        return false;
    }
}

