-- ──────────────────────────────────────────────────────────
-- UMEED EDUCATION SYSTEM - ATTENDANCE DATABASE SCHEMA
-- ──────────────────────────────────────────────────────────
-- Run these queries in Supabase SQL Editor

-- ══════════════════════════════════════════════════════════
-- 1. STAFF TABLE
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  dept TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  join_date TEXT,
  status TEXT DEFAULT 'active', -- active, inactive
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_dept ON staff(dept);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);

-- ══════════════════════════════════════════════════════════
-- 2. ATTENDANCE TABLE
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  in_time TEXT,
  out_time TEXT,
  status TEXT NOT NULL, -- present, absent, late, leave, halfday, off
  marked_by TEXT DEFAULT 'manual', -- manual, camera, device, system
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Composite index for date + staff queries
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_date_staff 
  ON attendance(staff_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_staff ON attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- ══════════════════════════════════════════════════════════
-- 3. LEAVES TABLE
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS leaves (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- Sick, Casual, Annual, Half Day, Duty, Unpaid
  from_date TEXT NOT NULL,
  to_date TEXT NOT NULL,
  num_days DECIMAL(4,1) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leaves_staff ON leaves(staff_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_leaves_date_range ON leaves(from_date, to_date);

-- ══════════════════════════════════════════════════════════
-- 4. ATTENDANCE SUMMARY (Monthly - for reports)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS attendance_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id TEXT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_days INTEGER,
  present_days INTEGER,
  absent_days INTEGER,
  late_days INTEGER,
  leave_days INTEGER,
  halfday_days INTEGER,
  attendance_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_summary_staff_month 
  ON attendance_summary(staff_id, year, month);

-- ══════════════════════════════════════════════════════════
-- 5. AUDIT LOG (Track changes)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- attendance_mark, leave_approve, staff_update, etc
  table_name TEXT,
  record_id TEXT,
  user_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);

-- ══════════════════════════════════════════════════════════
-- 6. USERS TABLE (For admin accounts)
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'viewer', -- admin, manager, teacher, viewer
  staff_id TEXT REFERENCES staff(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ══════════════════════════════════════════════════════════
-- 7. FUNCTIONS
-- ══════════════════════════════════════════════════════════

-- Get monthly attendance summary
CREATE OR REPLACE FUNCTION get_monthly_summary(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE (
  label TEXT,
  present INTEGER,
  absent INTEGER,
  late INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(TO_DATE(p_month::text, 'MM'), 'Mon')::TEXT as label,
    COUNT(*) FILTER (WHERE status = 'present')::INTEGER as present,
    COUNT(*) FILTER (WHERE status = 'absent')::INTEGER as absent,
    COUNT(*) FILTER (WHERE status = 'late')::INTEGER as late
  FROM attendance
  WHERE EXTRACT(YEAR FROM date::DATE) = p_year
    AND EXTRACT(MONTH FROM date::DATE) = p_month
  GROUP BY label;
END;
$$ LANGUAGE plpgsql;

-- Get attendance stats
CREATE OR REPLACE FUNCTION get_attendance_stats(
  p_from_date TEXT,
  p_to_date TEXT
)
RETURNS TABLE (
  total_staff INTEGER,
  total_present INTEGER,
  total_absent INTEGER,
  total_late INTEGER,
  total_leave INTEGER,
  avg_attendance_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT staff_id)::INTEGER as total_staff,
    COUNT(*) FILTER (WHERE status = 'present')::INTEGER as total_present,
    COUNT(*) FILTER (WHERE status = 'absent')::INTEGER as total_absent,
    COUNT(*) FILTER (WHERE status = 'late')::INTEGER as total_late,
    COUNT(*) FILTER (WHERE status = 'leave')::INTEGER as total_leave,
    ROUND(
      COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / 
      NULLIF(COUNT(*), 0) * 100, 
      2
    ) as avg_attendance_rate
  FROM attendance
  WHERE date::DATE >= p_from_date::DATE
    AND date::DATE <= p_to_date::DATE;
END;
$$ LANGUAGE plpgsql;

-- Get department-wise report
CREATE OR REPLACE FUNCTION get_dept_report(
  p_from_date TEXT,
  p_to_date TEXT
)
RETURNS TABLE (
  dept TEXT,
  total_staff INTEGER,
  total_present INTEGER,
  total_absent INTEGER,
  avg_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.dept,
    COUNT(DISTINCT s.id)::INTEGER as total_staff,
    COUNT(a.id) FILTER (WHERE a.status = 'present')::INTEGER as total_present,
    COUNT(a.id) FILTER (WHERE a.status = 'absent')::INTEGER as total_absent,
    ROUND(
      COUNT(a.id) FILTER (WHERE a.status = 'present')::DECIMAL / 
      NULLIF(COUNT(a.id), 0) * 100,
      2
    ) as avg_rate
  FROM staff s
  LEFT JOIN attendance a ON s.id = a.staff_id
    AND a.date::DATE >= p_from_date::DATE
    AND a.date::DATE <= p_to_date::DATE
  GROUP BY s.dept
  ORDER BY avg_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- ══════════════════════════════════════════════════════════
-- 8. TRIGGERS (Auto-update timestamps)
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER staff_update_timestamp
BEFORE UPDATE ON staff FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER attendance_update_timestamp
BEFORE UPDATE ON attendance FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER leaves_update_timestamp
BEFORE UPDATE ON leaves FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ══════════════════════════════════════════════════════════
-- 9. SAMPLE DATA (Optional - for testing)
-- ══════════════════════════════════════════════════════════

-- Clear existing data
TRUNCATE staff CASCADE;

-- Insert staff
INSERT INTO staff (id, name, role, dept, email, phone, join_date) VALUES
('UES-001', 'Hafiz Muhammad Tariq Mehmood', 'Principal', 'Administration', 'principal@umeededu.pk', '+92 300 1234001', '2010-01-15'),
('UES-002', 'Mrs. Ruqaiya Bibi', 'Vice Principal', 'Administration', 'vp@umeededu.pk', '+92 301 1234002', '2012-03-10'),
('UES-003', 'Mr. Muhammad Asif Khan', 'Admin Officer', 'Administration', 'admin@umeededu.pk', '+92 302 1234003', '2015-06-20'),
('UES-004', 'Mr. Muhammad Bilal Raza', 'Accountant', 'Finance', 'accounts@umeededu.pk', '+92 303 1234004', '2016-01-05'),
('UES-005', 'Mr. Sajid Hussain', 'Head of Science Dept.', 'Science', 'hod.sci@umeededu.pk', '+92 304 1234005', '2013-08-12'),
('UES-006', 'Mr. Kamran Akhtar', 'Physics Teacher', 'Science', 'physics@umeededu.pk', '+92 305 1234006', '2017-09-08'),
('UES-007', 'Mrs. Nadia Pervaiz', 'Chemistry Teacher', 'Science', 'chemistry@umeededu.pk', '+92 306 1234007', '2018-01-15'),
('UES-008', 'Mr. Fahad Malik', 'Biology Teacher', 'Science', 'biology@umeededu.pk', '+92 307 1234008', '2019-03-22'),
('UES-009', 'Mr. Usman Ali', 'Mathematics Teacher', 'Secondary Section', 'maths@umeededu.pk', '+92 308 1234009', '2016-07-10'),
('UES-010', 'Mrs. Sana Riaz', 'English Teacher', 'Secondary Section', 'english@umeededu.pk', '+92 309 1234010', '2017-11-05');

-- Insert today's attendance
INSERT INTO attendance (staff_id, date, in_time, status, marked_by) VALUES
('UES-001', CURRENT_DATE::TEXT, '07:48', 'present', 'camera'),
('UES-002', CURRENT_DATE::TEXT, '07:52', 'present', 'camera'),
('UES-003', CURRENT_DATE::TEXT, '07:55', 'present', 'camera'),
('UES-004', CURRENT_DATE::TEXT, '08:22', 'late', 'camera'),
('UES-005', CURRENT_DATE::TEXT, '07:58', 'present', 'camera'),
('UES-006', CURRENT_DATE::TEXT, '07:50', 'present', 'device'),
('UES-007', CURRENT_DATE::TEXT, '07:54', 'present', 'device'),
('UES-008', CURRENT_DATE::TEXT, NULL, 'absent', 'system'),
('UES-009', CURRENT_DATE::TEXT, '07:59', 'present', 'camera'),
('UES-010', CURRENT_DATE::TEXT, '08:01', 'present', 'device');

-- ══════════════════════════════════════════════════════════
-- 10. ROW LEVEL SECURITY (RLS) - OPTIONAL BUT RECOMMENDED
-- ══════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;

-- Staff table - allow authenticated users to read
CREATE POLICY "Staff visible to authenticated" ON staff
  FOR SELECT
  TO authenticated
  USING (true);

-- Attendance - authenticated users can read
CREATE POLICY "Attendance visible to authenticated" ON attendance
  FOR SELECT
  TO authenticated
  USING (true);

-- Attendance - only insert if authenticated
CREATE POLICY "Authenticated can mark attendance" ON attendance
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Leaves - visible to authenticated
CREATE POLICY "Leaves visible to authenticated" ON leaves
  FOR SELECT
  TO authenticated
  USING (true);

-- ══════════════════════════════════════════════════════════
-- 11. USEFUL QUERIES FOR TESTING
-- ══════════════════════════════════════════════════════════

-- Get today's attendance summary
-- SELECT status, COUNT(*) as count FROM attendance WHERE date = CURRENT_DATE::TEXT GROUP BY status;

-- Get staff with their today's attendance
-- SELECT s.name, s.role, a.in_time, a.status 
-- FROM staff s 
-- LEFT JOIN attendance a ON s.id = a.staff_id AND a.date = CURRENT_DATE::TEXT 
-- ORDER BY s.name;

-- Get monthly summary for April 2026
-- SELECT * FROM get_monthly_summary(2026, 4);

-- Get overall attendance stats for April
-- SELECT * FROM get_attendance_stats('2026-04-01', '2026-04-30');

-- ══════════════════════════════════════════════════════════
-- NOTES
-- ══════════════════════════════════════════════════════════
-- 1. All timestamps are UTC. Adjust as needed.
-- 2. staff.id should match your institution's staff ID format
-- 3. attendance.date stored as TEXT (YYYY-MM-DD) for easier filtering
-- 4. Enable RLS for production for data security
-- 5. Regularly backup your Supabase database
-- 6. Monitor attendance_summary table for large datasets
-- 7. Archive old attendance records after 1-2 years
