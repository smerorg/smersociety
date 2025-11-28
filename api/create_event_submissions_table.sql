-- Create table for SMER member event submissions
CREATE TABLE IF NOT EXISTS event_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_country_code VARCHAR(10),
    phone_number VARCHAR(50),
    institution VARCHAR(255) NOT NULL,
    country VARCHAR(120) NOT NULL,
    event_title VARCHAR(255) NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    event_description TEXT NOT NULL,
    event_objectives TEXT,
    target_audience TEXT,
    photo_one VARCHAR(255) NOT NULL,
    photo_two VARCHAR(255) NOT NULL,
    photo_three VARCHAR(255) NOT NULL,
    approved_photo VARCHAR(255) DEFAULT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_event_date (event_date),
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

