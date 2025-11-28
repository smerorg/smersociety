# Content Management System - Complete Guide

## Overview

All website content is now managed through a centralized database. Admins can edit any page content through the admin dashboard (`/admin`), and changes will automatically appear across the entire website.

## How It Works

### Architecture

```
Admin Dashboard (/admin)
        ↓
PHP API (/api/sections.php)
        ↓
MySQL Database (sections table)
        ↓
All Page Components (fetch & display)
```

### Content Flow

1. **Admin edits content** in `/admin` page
2. **Changes saved to database** via PHP API
3. **Page components fetch** content from database on load
4. **Content displays** automatically on all pages

## Managing Content

### Access Admin Dashboard

Visit: `https://your-domain.com/admin`

### Available Sections

| Section Key | Title | Used In | Editable |
|------------|-------|---------|----------|
| `hero-values` | Our Values & Commitment | Home Page | ✅ Yes |
| `about` | About SMER | About Page | ✅ Yes |
| `mission` | Mission & Vision | About Page | ✅ Yes |
| `contact` | Contact Us | Contact Page | ✅ Yes |
| `membership` | Membership | Membership Page | ✅ Yes |
| `journal` | Journal | Journal Page | ✅ Yes |
| `events` | Events | Events Page | ✅ Yes |

### Create New Section

1. Go to `/admin`
2. Click "Create New" tab
3. Fill in:
   - **Section Key**: Unique identifier (e.g., `about-us`)
   - **Title**: Display title
   - **Description**: Brief description
   - **Content**: Main content (supports HTML)
4. Click "Create Section"

### Edit Existing Section

1. Go to `/admin`
2. Click "All Sections" tab
3. Click "Edit" on any section
4. Modify the content
5. Click "Update Section"
6. Changes appear immediately on the website

### Delete Section

1. Go to `/admin`
2. Click "All Sections" tab
3. Click delete button on any section
4. Confirm deletion

## Database Schema

### Sections Table

```sql
CREATE TABLE sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL,  -- Unique identifier
  title VARCHAR(255) NOT NULL,               -- Display title
  description TEXT,                          -- Brief description
  content LONGTEXT NOT NULL,                 -- Main content (HTML supported)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Get All Sections
```
GET /api/sections.php
```

### Get Section by ID
```
GET /api/sections.php?id=1
```

### Get Section by Key
```
GET /api/sections.php?section_key=hero-values
```

### Create Section
```
POST /api/sections.php
Content-Type: application/json

{
  "section_key": "my-section",
  "title": "My Section",
  "description": "Description",
  "content": "<p>Content here</p>"
}
```

### Update Section
```
PUT /api/sections.php?id=1
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```

### Delete Section
```
DELETE /api/sections.php?id=1
```

## Using Content in Components

### Import Hook

```typescript
import { usePageContent } from '@/hooks/usePageContent';
```

### Fetch Content

```typescript
const { content, loading, error } = usePageContent('section-key');
```

### Display Content

```typescript
{content?.content ? (
  <div dangerouslySetInnerHTML={{ __html: content.content }} />
) : (
  <p>Default content</p>
)}
```

## HTML Support

Content supports full HTML formatting:

```html
<h2>Heading</h2>
<p>Paragraph text</p>
<strong>Bold text</strong>
<em>Italic text</em>
<ul>
  <li>List item</li>
</ul>
<a href="https://example.com">Link</a>
```

## Best Practices

### 1. Section Keys
- Use lowercase with hyphens: `my-section`
- Keep them descriptive: `hero-values`, `about-us`
- Never change after creation

### 2. Content
- Use semantic HTML
- Keep paragraphs short and readable
- Use headings for structure
- Test formatting in admin before saving

### 3. Backups
- Regularly backup your database
- Keep version history of important content
- Test changes before publishing

### 4. Security
- Only authorized admins should access `/admin`
- Consider adding authentication
- Sanitize user input
- Use HTTPS in production

## Troubleshooting

### Content Not Updating

1. Check that section_key is correct
2. Verify database connection
3. Clear browser cache
4. Check browser console for errors

### API Errors

1. Verify `/api/sections.php` exists
2. Check database credentials
3. Ensure `sections` table exists
4. Review server error logs

### Content Not Displaying

1. Check that section_key matches in component
2. Verify content is saved in database
3. Check for JavaScript errors in console
4. Ensure hook is imported correctly

## Examples

### Example 1: Edit Home Page Content

1. Go to `/admin`
2. Find "Our Values & Commitment" section
3. Click "Edit"
4. Update the content
5. Click "Update Section"
6. Home page updates automatically

### Example 2: Create New Section

1. Go to `/admin`
2. Click "Create New"
3. Fill in:
   - Section Key: `testimonials`
   - Title: `What Our Members Say`
   - Content: `<p>Member testimonials here...</p>`
4. Click "Create Section"
5. Use in component with `usePageContent('testimonials')`

## Next Steps

1. **Create sections** for all your pages
2. **Update components** to use `usePageContent` hook
3. **Test thoroughly** before going live
4. **Train team** on how to use admin panel
5. **Set up backups** for database

---

**Your website content is now fully manageable!** 🎉
