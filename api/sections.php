<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$db_host = 'localhost';
$db_user = 'smeresor_smeresor';
$db_password = 'smer2025@';
$db_name = 'smeresor_smer';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// Extract ID from URL query string or path
$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);
} elseif (count($path_parts) > 2 && is_numeric($path_parts[2])) {
    $id = intval($path_parts[2]);
}

// Route handling
switch ($method) {
    case 'GET':
        if ($id) {
            getSectionById($conn, $id);
        } elseif (isset($_GET['section_key'])) {
            getSectionByKey($conn, $_GET['section_key']);
        } else {
            getAllSections($conn);
        }
        break;
    
    case 'POST':
        createSection($conn);
        break;
    
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required for update']);
            exit();
        }
        updateSection($conn, $id);
        break;
    
    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID is required for delete']);
            exit();
        }
        deleteSection($conn, $id);
        break;
    
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

$conn->close();

// Functions
function getAllSections($conn) {
    $sql = "SELECT * FROM sections ORDER BY id";
    $result = $conn->query($sql);
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(['error' => 'Query failed: ' . $conn->error]);
        return;
    }
    
    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = $row;
    }
    
    echo json_encode($sections);
}

function getSectionById($conn, $id) {
    $sql = "SELECT * FROM sections WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Section not found']);
        $stmt->close();
        return;
    }
    
    $section = $result->fetch_assoc();
    echo json_encode($section);
    $stmt->close();
}

function getSectionByKey($conn, $section_key) {
    $sql = "SELECT * FROM sections WHERE section_key = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param("s", $section_key);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Section not found']);
        $stmt->close();
        return;
    }
    
    $section = $result->fetch_assoc();
    echo json_encode($section);
    $stmt->close();
}

function createSection($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['title']) || !isset($data['content'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and content are required']);
        return;
    }
    
    $section_key = $data['section_key'] ?? '';
    $title = $data['title'];
    $description = $data['description'] ?? '';
    $content = $data['content'];
    
    $sql = "INSERT INTO sections (section_key, title, description, content, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param("ssss", $section_key, $title, $description, $content);
    
    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['id' => $conn->insert_id, 'message' => 'Section created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function updateSection($conn, $id) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }
    
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $content = $data['content'] ?? null;
    
    $updates = [];
    $params = [];
    $types = "";
    
    if ($title !== null) {
        $updates[] = "title = ?";
        $params[] = $title;
        $types .= "s";
    }
    
    if ($description !== null) {
        $updates[] = "description = ?";
        $params[] = $description;
        $types .= "s";
    }
    
    if ($content !== null) {
        $updates[] = "content = ?";
        $params[] = $content;
        $types .= "s";
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        return;
    }
    
    $updates[] = "updated_at = NOW()";
    $params[] = $id;
    $types .= "i";
    
    $sql = "UPDATE sections SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Section updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    
    $stmt->close();
}

function deleteSection($conn, $id) {
    $sql = "DELETE FROM sections WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        return;
    }
    
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['message' => 'Section deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    
    $stmt->close();
}
?>
