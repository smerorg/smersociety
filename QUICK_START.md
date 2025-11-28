# Quick Start - Section Manager

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Database

Run this SQL in your MySQL client:

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

-- Add sample data
INSERT INTO sections (section_key, title, description, content) VALUES
('about', 'About SMER', 'Overview', '<h2>About SMER</h2><p>Content here...</p>'),
('mission', 'Mission', 'Our mission', '<h2>Mission</h2><p>Content here...</p>');
```

### Step 2: Install & Run

```bash
# Install dependencies
npm install

# Start both backend and frontend
npm run dev:full
```

### Step 3: Access Admin Dashboard

Open your browser and go to:
```
http://localhost:5173/admin
```

## 📋 What You Can Do

✅ **View** all sections in a clean list
✅ **Create** new sections with custom content
✅ **Edit** existing sections instantly
✅ **Delete** sections with confirmation
✅ **Preview** content before saving

## 🔧 Configuration

Database credentials are in `.env`:
```
DB_HOST=localhost
DB_USER=smeresor_smer
DB_PASSWORD=smer2025@
DB_NAME=smeresor_smer
```

## 📚 Full Documentation

See `ADMIN_SETUP.md` for detailed setup and troubleshooting.

---

**That's it!** Your section manager is ready to use. 🎉
