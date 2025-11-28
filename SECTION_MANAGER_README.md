# Section Manager - Complete Guide

## 🎯 What Is This?

A content management system that allows non-technical users to update website section text through a web interface without touching code.

**Perfect for:** Clients who need to update "About Us", "Mission", "Contact" and other section content easily.

## 🚀 Quick Start

### For Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173/admin
```

### For Production (Hosted Website)

```bash
# Build for production
npm run build

# Upload files to your hosting:
# 1. Upload dist/ folder to web root
# 2. Upload api/sections.php to /api/ folder
# 3. Create database table (see below)
```

## 📋 What's Included

### Frontend
- **Admin Dashboard** (`src/pages/Admin.tsx`)
  - Beautiful, user-friendly interface
  - Create, read, update, delete sections
  - Real-time updates
  - Responsive design

### Backend
- **PHP API** (`api/sections.php`)
  - No Node.js server required
  - Deploys directly to any PHP hosting
  - Handles all database operations
  - CORS enabled for frontend communication

### Database
- **MySQL Table** (`database-schema.sql`)
  - Stores section content
  - Tracks creation and update timestamps
  - Supports HTML content

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `HOSTED_SETUP.md` | **START HERE** - 3-step setup for hosted sites |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment instructions |
| `DEPLOYMENT_CHECKLIST.md` | Step-by-step verification checklist |
| `database-schema.sql` | SQL to create database table |
| `SETUP_SUMMARY.md` | Overview of what was created |

## 🔧 How It Works

1. **User visits `/admin`** → React dashboard loads
2. **User clicks "Create Section"** → Form appears
3. **User fills in content** → Can use HTML formatting
4. **User clicks "Save"** → Data sent to PHP API
5. **PHP API processes** → Saves to MySQL database
6. **User sees confirmation** → Toast notification
7. **Changes are live** → Immediately available

## 📁 File Structure

```
your-project/
├── src/
│   ├── pages/
│   │   ├── Admin.tsx          ← Admin dashboard
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── components/
│   └── ...
├── api/
│   └── sections.php           ← PHP API backend
├── dist/                       ← Built frontend (after npm run build)
├── database-schema.sql         ← Database table structure
├── HOSTED_SETUP.md            ← Setup instructions
├── DEPLOYMENT_GUIDE.md        ← Deployment details
├── package.json
└── ...
```

## 🎨 Admin Dashboard Features

### View Sections
- List all sections with metadata
- See creation and update dates
- Preview content

### Create Sections
- Add new sections with unique keys
- Set title, description, and content
- Support for HTML formatting

### Edit Sections
- Modify any section instantly
- Changes saved to database immediately
- Update timestamps automatically

### Delete Sections
- Remove sections with confirmation
- Prevents accidental deletion

## 🗄️ Database Schema

```sql
CREATE TABLE sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL,  -- e.g., 'about', 'mission'
  title VARCHAR(255) NOT NULL,               -- Section title
  description TEXT,                          -- Brief description
  content LONGTEXT NOT NULL,                 -- Main content (HTML supported)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Security

### Current Implementation
- CORS headers configured
- Prepared statements (SQL injection prevention)
- Input validation

### Recommended for Production
- Add authentication to `/admin` page
- Implement API key validation
- Sanitize HTML content
- Use HTTPS
- Regular database backups

## 🐛 Troubleshooting

### Admin page won't load
```
✓ Check that index.html is in web root
✓ Verify all dist/ files were uploaded
✓ Clear browser cache
✓ Check browser console for errors
```

### API returns 404
```
✓ Verify api/sections.php is in /api/ folder
✓ Check file permissions
✓ Verify PHP is enabled on hosting
```

### Database connection fails
```
✓ Check credentials in api/sections.php
✓ Verify MySQL is running
✓ Confirm database exists
✓ Check MySQLi extension is enabled
```

### Sections not saving
```
✓ Verify database table exists
✓ Check database user has INSERT permission
✓ Review server error logs
✓ Test API directly: /api/sections.php
```

## 📞 Support Resources

1. **Quick Setup:** Read `HOSTED_SETUP.md`
2. **Detailed Guide:** Read `DEPLOYMENT_GUIDE.md`
3. **Verification:** Use `DEPLOYMENT_CHECKLIST.md`
4. **Database:** See `database-schema.sql`

## 🎯 Next Steps

1. **Read** `HOSTED_SETUP.md` for your specific hosting
2. **Build** the frontend: `npm run build`
3. **Upload** files to your hosting
4. **Create** database table
5. **Test** the admin dashboard
6. **Train** your team on how to use it

## 💡 Tips for Users

- **HTML Support:** Users can use HTML tags like `<h2>`, `<p>`, `<strong>`, etc.
- **Section Keys:** Use lowercase with hyphens (e.g., `about-us`, `contact-info`)
- **Backups:** Regularly backup your database
- **Preview:** Always preview changes before saving

## 🚀 Deployment Summary

| Step | Action | Time |
|------|--------|------|
| 1 | Build frontend | 1 min |
| 2 | Upload files | 5 min |
| 3 | Create database table | 1 min |
| 4 | Test admin page | 5 min |
| 5 | Train users | 10 min |
| **Total** | **Ready to go live** | **~20 min** |

## 📊 API Endpoints

All endpoints are at `/api/sections.php`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/sections.php` | Get all sections |
| GET | `/api/sections.php?id=1` | Get single section |
| POST | `/api/sections.php` | Create section |
| PUT | `/api/sections.php?id=1` | Update section |
| DELETE | `/api/sections.php?id=1` | Delete section |

## ✅ Verification Checklist

After deployment, verify:
- [ ] Admin page loads at `/admin`
- [ ] Can view all sections
- [ ] Can create new section
- [ ] Can edit existing section
- [ ] Can delete section
- [ ] Changes appear in database
- [ ] No errors in browser console
- [ ] No errors in server logs

## 🎉 You're All Set!

Your Section Manager is ready to use. Users can now update content without touching code!

---

**Questions?** Check the documentation files or your hosting provider's support.

**Last Updated:** November 2025
