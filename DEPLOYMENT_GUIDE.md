# Deployment Guide - Section Manager for Hosted Sites

This guide explains how to deploy the Section Manager to your hosted website.

## 📋 Overview

The Section Manager now uses a **PHP API** that can be deployed directly to your web hosting without needing a separate Node.js server.

**Architecture:**
- Frontend: React app (built files deployed to web root)
- Backend: PHP API (deployed to `/api/` folder)
- Database: MySQL (your existing database)

## 🚀 Deployment Steps

### Step 1: Build the Frontend

```bash
npm install
npm run build
```

This creates a `dist/` folder with all the compiled frontend files.

### Step 2: Upload Files to Your Hosting

Using FTP, SFTP, or your hosting control panel:

1. **Upload frontend files:**
   - Upload all files from `dist/` folder to your web root (usually `public_html/` or `www/`)

2. **Upload PHP API:**
   - Create an `api/` folder in your web root
   - Upload `api/sections.php` to this folder

**Final structure on your server:**
```
public_html/
├── index.html
├── assets/
├── api/
│   └── sections.php
└── [other frontend files]
```

### Step 3: Set Up Database

Run this SQL on your hosting's MySQL database:

```sql
CREATE TABLE IF NOT EXISTS sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section_key (section_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add sample sections
INSERT INTO sections (section_key, title, description, content) VALUES
('about', 'About SMER', 'Overview', '<h2>About SMER</h2><p>Content here...</p>'),
('mission', 'Mission', 'Our mission', '<h2>Mission</h2><p>Content here...</p>');
```

### Step 4: Update Database Credentials (if needed)

Edit `api/sections.php` and update these lines if your hosting uses different credentials:

```php
$db_host = 'localhost';
$db_user = 'smeresor_smer';
$db_password = 'smer2025@';
$db_name = 'smeresor_smer';
```

### Step 5: Verify Installation

1. Visit your website: `https://yourdomain.com`
2. Navigate to admin page: `https://yourdomain.com/admin`
3. You should see the Section Manager dashboard

## 🔧 Configuration

### For Local Development

The app automatically uses `/api` as the API endpoint. No configuration needed.

### For Different API Path

If your API is at a different location, update `.env`:

```
VITE_API_URL=https://yourdomain.com/api
```

Then rebuild:
```bash
npm run build
```

## 📝 How It Works

1. **User accesses `/admin`** → React admin dashboard loads
2. **User clicks "Save"** → Frontend sends request to `/api/sections.php`
3. **PHP API processes request** → Connects to MySQL database
4. **Database updated** → Response sent back to frontend
5. **User sees confirmation** → Toast notification appears

## ✅ Checklist Before Going Live

- [ ] Database table created with correct schema
- [ ] `api/sections.php` uploaded to `/api/` folder
- [ ] Frontend files uploaded to web root
- [ ] Database credentials correct in `api/sections.php`
- [ ] Tested admin page at `/admin`
- [ ] Can create/edit/delete sections
- [ ] Changes appear in database

## 🔐 Security Recommendations

### For Production

1. **Add Authentication:**
   - Protect `/admin` page with login
   - Add API key validation in `api/sections.php`

2. **Input Validation:**
   - Sanitize HTML content to prevent XSS
   - Validate section_key format

3. **Rate Limiting:**
   - Limit API requests per IP
   - Prevent abuse

4. **HTTPS:**
   - Always use HTTPS in production
   - Ensure API calls use HTTPS

### Example: Add API Key Protection

Edit `api/sections.php` and add at the top:

```php
// Check API key
$api_key = $_GET['key'] ?? $_POST['key'] ?? $_SERVER['HTTP_X_API_KEY'] ?? null;
if ($api_key !== 'your-secret-key-here') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}
```

Then update Admin.tsx to include the key:

```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api?key=your-secret-key-here';
```

## 🐛 Troubleshooting

### "Cannot POST /api/sections"
- Check that `api/sections.php` is uploaded to the correct location
- Verify file permissions (should be readable)

### "Database connection failed"
- Verify database credentials in `api/sections.php`
- Check that MySQL is running on your hosting
- Confirm database name exists

### "CORS error"
- The PHP API has CORS headers enabled
- If still having issues, check your hosting's CORS settings

### "Sections not loading"
- Check browser console for error messages
- Verify database table exists: `SHOW TABLES;`
- Check that sections table has data: `SELECT * FROM sections;`

## 📞 Support

For hosting-specific issues:
1. Contact your hosting provider's support
2. Verify PHP version (7.4+ required)
3. Check that MySQLi extension is enabled
4. Review error logs in your hosting control panel

---

**Deployment Complete!** Your Section Manager is now live. 🎉
