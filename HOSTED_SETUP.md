# Quick Setup for Hosted Websites

## What You Need

✅ Your existing MySQL database (already have it)
✅ Web hosting with PHP support (most hosts have this)
✅ FTP/SFTP access to upload files

## 3-Step Setup

### Step 1: Build the Frontend

```bash
npm install
npm run build
```

This creates a `dist/` folder with your website files.

### Step 2: Upload to Your Hosting

**Using FTP/SFTP:**

1. Upload everything from `dist/` folder to your web root (`public_html/`)
2. Create a new folder called `api` in your web root
3. Upload `api/sections.php` to the `api/` folder

**Result:**
```
your-website.com/
├── index.html
├── assets/
├── api/
│   └── sections.php
└── [other files]
```

### Step 3: Create Database Table

In your hosting's phpMyAdmin or MySQL client, run:

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

INSERT INTO sections (section_key, title, description, content) VALUES
('about', 'About SMER', 'Overview', '<h2>About SMER</h2><p>Content here...</p>'),
('mission', 'Mission', 'Our mission', '<h2>Mission</h2><p>Content here...</p>');
```

## Done! 🎉

Visit: `https://your-website.com/admin`

You can now:
- ✏️ Edit section text
- ➕ Create new sections
- 🗑️ Delete sections
- 💾 Save changes to database

## Need Help?

**Database credentials not matching?**
- Edit `api/sections.php` and update these lines:
  ```php
  $db_host = 'localhost';
  $db_user = 'your_username';
  $db_password = 'your_password';
  $db_name = 'your_database';
  ```

**Can't access `/admin`?**
- Make sure `index.html` is in your web root
- Check that all files from `dist/` were uploaded

**Getting errors?**
- Check your hosting's error logs
- Verify PHP version is 7.4 or higher
- Confirm MySQLi extension is enabled

---

See `DEPLOYMENT_GUIDE.md` for detailed information.
