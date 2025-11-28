# Deployment Checklist

## Pre-Deployment (Local)

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` to create production files
- [ ] Verify `dist/` folder is created
- [ ] Check that `api/sections.php` exists in project root

## Database Setup

- [ ] Connect to your hosting's MySQL database
- [ ] Run the SQL from `database-schema.sql` to create the `sections` table
- [ ] Verify table was created: `SHOW TABLES;`
- [ ] Verify sample data: `SELECT * FROM sections;`
- [ ] Confirm database credentials in `api/sections.php` are correct

## File Upload (FTP/SFTP)

### Frontend Files
- [ ] Upload all files from `dist/` folder to web root (`public_html/`)
- [ ] Verify `index.html` is in web root
- [ ] Verify `assets/` folder is uploaded
- [ ] Check that all JavaScript files are present

### API Files
- [ ] Create `api/` folder in web root
- [ ] Upload `api/sections.php` to the `api/` folder
- [ ] Verify file permissions are correct (readable)

## Post-Deployment Verification

### Access Admin Page
- [ ] Visit `https://yourdomain.com/admin`
- [ ] Verify page loads without errors
- [ ] Check browser console for any errors

### Test Functionality
- [ ] View all sections (should show at least 2 sample sections)
- [ ] Create a new section
  - [ ] Fill in all fields
  - [ ] Click "Create Section"
  - [ ] Verify success message appears
  - [ ] Verify new section appears in list
  
- [ ] Edit a section
  - [ ] Click "Edit" on any section
  - [ ] Modify the content
  - [ ] Click "Update Section"
  - [ ] Verify changes appear in the list
  
- [ ] Delete a section
  - [ ] Click delete button
  - [ ] Confirm deletion
  - [ ] Verify section is removed from list

### Database Verification
- [ ] Check database for new/updated sections
- [ ] Verify timestamps are correct
- [ ] Confirm all data is saved properly

## Troubleshooting

If something doesn't work:

### Admin page won't load
- [ ] Check that `index.html` is in web root
- [ ] Verify all `dist/` files were uploaded
- [ ] Check browser console for errors
- [ ] Try clearing browser cache

### API returns errors
- [ ] Verify `api/sections.php` is in `/api/` folder
- [ ] Check database credentials in `api/sections.php`
- [ ] Verify MySQL is running
- [ ] Check that `sections` table exists
- [ ] Review hosting error logs

### Can't connect to database
- [ ] Verify database host (usually `localhost`)
- [ ] Check username and password
- [ ] Confirm database name is correct
- [ ] Verify MySQLi extension is enabled on hosting
- [ ] Contact hosting support if needed

### CORS or connection errors
- [ ] Verify API endpoint is correct (`/api/sections.php`)
- [ ] Check that PHP is enabled on hosting
- [ ] Review browser console for specific error messages
- [ ] Try accessing API directly: `https://yourdomain.com/api/sections.php`

## Security Checklist

- [ ] Database credentials are not exposed in frontend code
- [ ] API credentials are only in `api/sections.php`
- [ ] Consider adding authentication to `/admin` page
- [ ] Enable HTTPS on your domain
- [ ] Review file permissions on server
- [ ] Consider adding API key validation

## Final Steps

- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Verify changes persist after page refresh
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Document any custom configurations
- [ ] Set up regular database backups

## Go Live

- [ ] All tests passed
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Database is backed up
- [ ] Team trained on how to use admin panel

---

**Deployment Status:** ✅ Ready to Go Live!
