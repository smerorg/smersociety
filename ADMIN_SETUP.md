# Section Manager - Admin Setup Guide

This guide will help you set up the Section Manager feature that allows non-technical users to update website content through a web interface.

## Overview

The Section Manager consists of:
- **Backend API** (Node.js/Express) - Handles database operations
- **Admin Dashboard** (React) - User-friendly interface for managing sections
- **Database** (MySQL) - Stores section content

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server running with the provided credentials
- npm or yarn package manager

## Setup Instructions

### 1. Database Setup

First, create the sections table in your MySQL database:

```bash
# Connect to your MySQL database
mysql -h localhost -u smeresor_smer -p smeresor_smer

# Then run the SQL from database-schema.sql file
# You can copy-paste the contents or use:
mysql -h localhost -u smeresor_smer -p smeresor_smer < database-schema.sql
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (backend framework)
- MySQL2 (database driver)
- CORS (cross-origin requests)
- Dotenv (environment variables)
- Concurrently (run multiple processes)

### 3. Environment Configuration

The `.env` file is already configured with your database credentials:

```
DB_HOST=localhost
DB_USER=smeresor_smer
DB_PASSWORD=smer2025@
DB_NAME=smeresor_smer
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

If you need to change these values, edit the `.env` file accordingly.

### 4. Running the Application

#### Option A: Run Both Frontend and Backend Together

```bash
npm run dev:full
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173` (or next available port)

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Admin Dashboard

Once both services are running:

1. Open your browser and navigate to: `http://localhost:5173/admin`
2. You should see the Section Manager dashboard

## Features

### View All Sections
- See a list of all sections in your database
- View section titles, keys, and content previews
- Check when each section was last updated

### Create New Section
- Add new sections with unique keys
- Set title, description, and content
- Content supports HTML formatting

### Edit Sections
- Click "Edit" on any section to modify it
- Update title, description, or content
- Changes are saved immediately to the database

### Delete Sections
- Remove sections you no longer need
- Confirmation dialog prevents accidental deletion

## API Endpoints

The backend provides the following REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sections` | Get all sections |
| GET | `/api/sections/:id` | Get a specific section |
| POST | `/api/sections` | Create a new section |
| PUT | `/api/sections/:id` | Update a section |
| DELETE | `/api/sections/:id` | Delete a section |
| GET | `/api/health` | Check server status |

## Database Schema

The `sections` table has the following structure:

```sql
- id (INT, Primary Key, Auto Increment)
- section_key (VARCHAR, Unique) - Identifier like 'about', 'contact'
- title (VARCHAR) - Section title
- description (TEXT) - Brief description
- content (LONGTEXT) - Main content (HTML supported)
- created_at (TIMESTAMP) - Creation date
- updated_at (TIMESTAMP) - Last update date
```

## Troubleshooting

### Backend won't connect to database
- Verify MySQL is running
- Check database credentials in `.env` file
- Ensure the database `smeresor_smer` exists
- Run the database schema SQL to create the `sections` table

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env` file
- Verify CORS is enabled (it should be by default)
- Check browser console for error messages

### Port already in use
- Backend: Change `PORT` in `.env` file and update `VITE_API_URL`
- Frontend: Vite will automatically use the next available port

### Sections not loading
- Check browser console for errors
- Verify database table exists: `SHOW TABLES;`
- Check that sections table has data: `SELECT * FROM sections;`

## Production Deployment

For production deployment:

1. **Update environment variables** in `.env` with production database credentials
2. **Build frontend**: `npm run build`
3. **Deploy backend** to a server (e.g., using PM2, Docker, or cloud platforms)
4. **Update `VITE_API_URL`** to point to production backend URL
5. **Secure the admin page** with authentication (recommended)

## Security Recommendations

1. **Add Authentication**: Implement login/password protection for the admin panel
2. **Input Validation**: Sanitize HTML content to prevent XSS attacks
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **HTTPS**: Use HTTPS in production
5. **Database Backups**: Regular backups of the sections table

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console and server logs
3. Verify all prerequisites are installed and running
4. Check database connectivity with: `mysql -h localhost -u smeresor_smer -p`

---

**Last Updated**: November 2025
