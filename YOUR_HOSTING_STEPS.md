# Your Hosting Setup - Step by Step

Since you mentioned your site is already hosted, follow these exact steps.

## Step 1: Build the Frontend (On Your Computer)

Open terminal/command prompt in your project folder:

```bash
npm install
npm run build
```

This creates a `dist/` folder with all your website files.

## Step 2: Upload to Your Hosting

### Using FTP/SFTP (FileZilla, WinSCP, etc.)

1. **Connect to your hosting** using FTP credentials
2. **Navigate to web root** (usually `public_html/` or `www/`)
3. **Upload `dist/` contents:**
   - Upload all files from `dist/` folder to web root
   - This includes: `index.html`, `assets/`, and other files

4. **Create `api/` folder:**
   - Right-click in web root → Create Folder → Name it `api`

5. **Upload PHP API:**
   - Upload `api/sections.php` to the `api/` folder you just created

### Using Hosting Control Panel (cPanel, Plesk, etc.)

1. Go to File Manager
2. Navigate to web root
3. Upload `dist/` contents to web root
4. Create `api/` folder
5. Upload `api/sections.php` to `api/` folder

## Step 3: Create Database Table

### Using phpMyAdmin (Most Common)

1. Log into your hosting control panel
2. Find **phpMyAdmin**
3. Select your database: `smeresor_smer`
4. Click **SQL** tab
5. Copy and paste this SQL:

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
('about', 'About SMER', 'Overview of SMER', '<h2>About SMER</h2><p>The Society for Modern English Research...</p>'),
('mission', 'Mission & Vision', 'Our mission and vision', '<h2>Our Mission</h2><p>To advance the scientific study of the English language...</p>'),
('contact', 'Contact Us', 'Contact information', '<h2>Get in Touch</h2><p>Contact us at...</p>');
```

6. Click **Go** to execute

## Step 4: Verify Database Credentials

Check if your database credentials match in `api/sections.php`:

```php
$db_host = 'localhost';
$db_user = 'smeresor_smer';
$db_password = 'smer2025@';
$db_name = 'smeresor_smer';
```

**If different:**
- Edit `api/sections.php` on your server
- Update the credentials to match your hosting

## Step 5: Test Everything

### Test 1: Visit Your Website
```
https://your-domain.com
```
Should load your website normally.

### Test 2: Visit Admin Page
```
https://your-domain.com/admin
```
Should show the Section Manager dashboard.

### Test 3: Create a Section
1. Click "Create New" tab
2. Fill in:
   - Section Key: `test-section`
   - Title: `Test Section`
   - Content: `<p>This is a test</p>`
3. Click "Create Section"
4. Should see success message

### Test 4: Verify in Database
1. Go back to phpMyAdmin
2. Select `sections` table
3. Click **Browse**
4. Should see your test section

### Test 5: Edit Section
1. Go back to `/admin`
2. Click "All Sections"
3. Click "Edit" on any section
4. Change the content
5. Click "Update Section"
6. Verify changes appear

## 🎉 Done!

Your Section Manager is now live!

## 📝 What Your Users Can Do

Users can now visit `/admin` to:
- ✏️ Edit section text
- ➕ Create new sections
- 🗑️ Delete sections
- 💾 Save changes to database

## ⚠️ If Something Goes Wrong

### Admin page shows blank/error
```
→ Check that all dist/ files were uploaded
→ Clear browser cache
→ Check browser console (F12) for errors
```

### Can't save sections
```
→ Verify api/sections.php is in /api/ folder
→ Check database credentials in api/sections.php
→ Verify database table was created
→ Check server error logs
```

### Database connection error
```
→ Verify database name: smeresor_smer
→ Verify username: smeresor_smer
→ Verify password: smer2025@
→ Contact hosting support if still failing
```

## 📞 Need Help?

1. **Check:** `HOSTED_SETUP.md` for more details
2. **Verify:** Use `DEPLOYMENT_CHECKLIST.md`
3. **Read:** `DEPLOYMENT_GUIDE.md` for troubleshooting
4. **Contact:** Your hosting provider's support

---

**That's it!** Your Section Manager is ready to use. 🚀
