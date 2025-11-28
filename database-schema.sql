-- Create sections table for managing website content
CREATE TABLE IF NOT EXISTS sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL COMMENT 'Unique identifier for the section (e.g., about, services)',
  title VARCHAR(255) NOT NULL COMMENT 'Section title',
  description TEXT COMMENT 'Brief description of the section',
  content LONGTEXT NOT NULL COMMENT 'Main content (supports HTML)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section_key (section_key),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample sections
INSERT INTO sections (section_key, title, description, content) VALUES
('hero-values', 'Our Values & Commitment', 'SMER values and commitment to accessibility', '<p>Recognizing global disparities in research resources, SMER provides <strong>full or partial fee exemptions</strong> for researchers and research communities from underdeveloped countries who are unable to bear the associated costs of membership or publication.</p><div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(99, 102, 241, 0.3);"><p style="font-size: 0.875rem; font-weight: 500; color: rgb(67, 56, 202);">This policy reflects our commitment to inclusivity, equity, and the promotion of scholarly exchange without financial barriers.</p></div>'),
('about', 'About SMER', 'Overview of SMER', '<h2>About SMER</h2><p>The Society for Modern English Research (SMER) is a distinguished non-profit academic society...</p>'),
('mission', 'Mission & Vision', 'Our mission and vision statement', '<h2>Our Mission</h2><p>To advance the scientific study of the English language through rigorous research...</p>'),
('contact', 'Contact Us', 'Contact information', '<h2>Get in Touch</h2><p>We would love to hear from you. Contact us at...</p>');
