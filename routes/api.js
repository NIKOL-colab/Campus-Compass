const express = require('express');
const router = express.Router();
const path = require('path');

// Load data
const faculty = require(path.join(__dirname, '..', 'data', 'faculty.json'));
const students = require(path.join(__dirname, '..', 'data', 'students.json'));
const departments = require(path.join(__dirname, '..', 'data', 'departments.json'));

// In-memory session (demo only — replace with ERP session validation)
let currentSession = {
  role: 'student',
  name: 'Alex Johnson',
  id: 'STU2024001'
};

// ─── Session ────────────────────────────────────────────────────────
// GET /api/session — returns mock user session
router.get('/session', (req, res) => {
  res.json(currentSession);
});

// ALL /api/session/toggle — toggle role between student and teacher
router.all('/session/toggle', (req, res) => {
  currentSession = {
    ...currentSession,
    role: currentSession.role === 'student' ? 'teacher' : 'student',
    name: currentSession.role === 'student' ? 'Dr. Demo Faculty' : 'Alex Johnson',
    id: currentSession.role === 'student' ? 'FAC2024001' : 'STU2024001'
  };
  res.json(currentSession);
});

// ─── Departments ────────────────────────────────────────────────────
router.get('/departments', (req, res) => {
  res.json(departments);
});

// ─── Subjects ───────────────────────────────────────────────────────
// GET /api/subjects?q=&dept=
router.get('/subjects', (req, res) => {
  const { q, dept } = req.query;
  let allSubjects = [];

  faculty.forEach(f => {
    if (dept && f.department.toLowerCase() !== dept.toLowerCase()) return;
    f.subjects.forEach(s => {
      if (!allSubjects.includes(s)) allSubjects.push(s);
    });
  });

  if (q) {
    const query = q.toLowerCase();
    allSubjects = allSubjects.filter(s => s.toLowerCase().includes(query));
  }

  // Return subjects with their associated faculty
  const results = allSubjects.map(subject => {
    const teachers = faculty.filter(f => f.subjects.includes(subject));
    return {
      subject,
      faculty: teachers.map(t => ({
        id: t.id,
        name: t.name,
        department: t.department,
        photo: t.photo,
        status: t.status
      }))
    };
  });

  res.json(results);
});

// ─── Faculty ────────────────────────────────────────────────────────
// GET /api/faculty?q=&dept=&subject=
router.get('/faculty', (req, res) => {
  const { q, dept, subject } = req.query;
  let results = [...faculty];

  if (dept) {
    results = results.filter(f =>
      f.department.toLowerCase().includes(dept.toLowerCase())
    );
  }

  if (subject) {
    results = results.filter(f =>
      f.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))
    );
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.department.toLowerCase().includes(query) ||
      f.subjects.some(s => s.toLowerCase().includes(query))
    );
  }

  // Return lightweight results (no full timetable)
  const lightweight = results.map(f => ({
    id: f.id,
    name: f.name,
    department: f.department,
    subjects: f.subjects,
    cabin: f.cabin,
    status: f.status,
    photo: f.photo
  }));

  res.json(lightweight);
});

// GET /api/faculty/:id — full profile with timetable
router.get('/faculty/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const member = faculty.find(f => f.id === id);

  if (!member) {
    return res.status(404).json({ error: 'Faculty not found' });
  }

  res.json(member);
});

// ─── Class Representatives ─────────────────────────────────────────
// GET /api/class-reps?year=&branch=
router.get('/class-reps', (req, res) => {
  const { year, branch } = req.query;
  let results = [...students];

  if (year) {
    results = results.filter(s => s.year === year);
  }

  if (branch) {
    results = results.filter(s =>
      s.branch.toLowerCase() === branch.toLowerCase()
    );
  }

  res.json(results);
});

module.exports = router;
