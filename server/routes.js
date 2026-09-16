import express from 'express';
import db from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage for announcements
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'announcement-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- VIDEO STREAMING ENDPOINT ---
router.get('/video', (req, res) => {
  const videoPath = `D:\\WhatsApp Video 2026-09-15 at 2.27.26 PM.mp4`;

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video file not found at specified path');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// --- AUTHENTICATION ROUTES ---

// Student Registration
router.post('/auth/register', (req, res) => {
  const { name, email, department, year, phone_whatsapp, csn_esn, password, confirmPassword } = req.body;

  if (!name || !email || !department || !year || !phone_whatsapp || !csn_esn || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get("SELECT * FROM users WHERE email = ?", [normalizedEmail], (err, existingUser) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (existingUser) {
      return res.status(400).json({ error: 'Mail ID is already registered.' });
    }

    db.run(
      `INSERT INTO users (name, email, department, year, phone_whatsapp, csn_esn, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'student')`,
      [name, normalizedEmail, department, year, phone_whatsapp, csn_esn, password],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Registration failed.' });

        const newUser = {
          id: this.lastID,
          name,
          email: normalizedEmail,
          department,
          year,
          phone_whatsapp,
          csn_esn,
          role: 'student'
        };

        res.json({ message: 'Registration successful! Redirecting to login...', user: newUser });
      }
    );
  });
});

// Student & Admin Login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Mail ID/Username and password are required.' });
  }

  const inputKey = email.trim().toLowerCase();

  // Check for Admin credentials explicitly
  if (inputKey === 'admin' && password === 'admin@123') {
    return res.json({
      user: {
        id: 0,
        name: 'System Administrator',
        email: 'admin',
        role: 'admin'
      }
    });
  }

  // Student Login lookup
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [inputKey, password], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid Mail ID or Password.' });
    }

    // Return user without password
    const { password: _, ...userData } = user;
    res.json({ user: userData });
  });
});

// --- CLUBS & REGISTRATION ROUTES ---

// Get all 8 clubs and user's registrations
router.get('/clubs', (req, res) => {
  const { userId } = req.query;

  db.all("SELECT * FROM clubs ORDER BY id ASC", [], (err, clubs) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch clubs' });

    if (!userId) {
      return res.json({ clubs, registeredClubIds: [] });
    }

    db.all("SELECT club_id FROM registrations WHERE user_id = ?", [userId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: 'Failed to fetch registrations' });
      const registeredClubIds = rows.map(r => r.club_id);
      res.json({ clubs, registeredClubIds });
    });
  });
});

// Register for a club audition
router.post('/clubs/register', (req, res) => {
  const { userId, clubId } = req.body;

  if (!userId || !clubId) {
    return res.status(400).json({ error: 'User ID and Club ID are required.' });
  }

  // Check current registration count for this student
  db.all("SELECT club_id FROM registrations WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const registeredClubIds = rows.map(r => r.club_id);

    if (registeredClubIds.includes(clubId)) {
      return res.status(400).json({ error: 'You are already registered for this club audition.' });
    }

    if (registeredClubIds.length >= 2) {
      return res.status(400).json({ error: 'Maximum limit reached! Each student can register for at most 2 clubs.' });
    }

    db.run(
      "INSERT INTO registrations (user_id, club_id) VALUES (?, ?)",
      [userId, clubId],
      function (err2) {
        if (err2) return res.status(500).json({ error: 'Failed to register for club.' });
        registeredClubIds.push(clubId);
        res.json({
          message: 'Audition registration confirmed successfully!',
          registeredClubIds
        });
      }
    );
  });
});

// Get student's registered clubs
router.get('/user/registrations/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.*, r.created_at as registered_at
    FROM registrations r
    JOIN clubs c ON r.club_id = c.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch user registrations' });
    res.json({ registrations: rows });
  });
});

// --- ANNOUNCEMENTS ROUTES ---

// Get all announcements
router.get('/announcements', (req, res) => {
  db.all("SELECT * FROM announcements ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch announcements' });
    res.json({ announcements: rows });
  });
});

// Create announcement (Admin only)
router.post('/announcements', upload.single('image'), (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    "INSERT INTO announcements (title, description, image_url) VALUES (?, ?, ?)",
    [title, description, imageUrl],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to post announcement' });
      db.get("SELECT * FROM announcements WHERE id = ?", [this.lastID], (err2, newAnn) => {
        res.json({ message: 'Announcement published successfully!', announcement: newAnn });
      });
    }
  );
});

// --- ADMIN ROUTES ---

// Admin Stats
router.get('/admin/stats', (req, res) => {
  const stats = {};

  db.get("SELECT COUNT(*) as studentCount FROM users WHERE role = 'student'", [], (err, row1) => {
    stats.totalStudents = row1 ? row1.studentCount : 0;

    db.get("SELECT COUNT(*) as regCount FROM registrations", [], (err2, row2) => {
      stats.totalRegistrations = row2 ? row2.regCount : 0;

      db.all(`
        SELECT c.name, COUNT(r.id) as count
        FROM clubs c
        LEFT JOIN registrations r ON c.id = r.club_id
        GROUP BY c.id
      `, [], (err3, rows3) => {
        stats.clubBreakdown = rows3 || [];
        res.json(stats);
      });
    });
  });
});

// Admin Student Registrations Full List
router.get('/admin/students', (req, res) => {
  const query = `
    SELECT 
      u.id, u.name, u.email, u.department, u.year, u.phone_whatsapp, u.csn_esn, u.created_at,
      GROUP_CONCAT(c.name, ', ') as registered_clubs
    FROM users u
    LEFT JOIN registrations r ON u.id = r.user_id
    LEFT JOIN clubs c ON r.club_id = c.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch student data' });
    res.json({ students: rows });
  });
});

// Admin Export Database to Excel (.xlsx)
router.get('/admin/export-excel', (req, res) => {
  const query = `
    SELECT 
      u.id as "Student ID",
      u.name as "Full Name",
      u.email as "Mail ID",
      u.department as "Department",
      u.year as "Academic Year",
      u.phone_whatsapp as "Phone Number (WhatsApp)",
      u.csn_esn as "CSN / ESN",
      COALESCE(GROUP_CONCAT(c.name, '; '), 'None') as "Registered Clubs",
      u.created_at as "Account Created Date"
    FROM users u
    LEFT JOIN registrations r ON u.id = r.user_id
    LEFT JOIN clubs c ON r.club_id = c.id
    WHERE u.role = 'student'
    GROUP BY u.id
    ORDER BY u.created_at ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).send('Failed to generate Excel report');

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    const colWidths = [
      { wch: 12 }, // Student ID
      { wch: 25 }, // Full Name
      { wch: 30 }, // Mail ID
      { wch: 18 }, // Department
      { wch: 15 }, // Academic Year
      { wch: 25 }, // Phone Number (WhatsApp)
      { wch: 20 }, // CSN / ESN
      { wch: 35 }, // Registered Clubs
      { wch: 22 }  // Created Date
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Registered Students");

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `BCS_Registered_Students_${timestamp}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(excelBuffer);
  });
});

export default router;
