// ── SUPABASE CONFIG ──────────────────────────────────────
// Initialize Supabase client with real-time capabilities

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || window.SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || window.SUPABASE_KEY;

// Initialize Supabase client (loaded via CDN in HTML)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── STAFF OPERATIONS ─────────────────────────────────────
const staffOps = {
  // Fetch all staff
  async getAll() {
    const { data, error } = await supabaseClient
      .from('staff')
      .select('*')
      .order('id', { ascending: true });
    if (error) console.error('Error fetching staff:', error);
    return data || [];
  },

  // Fetch single staff
  async getById(id) {
    const { data, error } = await supabaseClient
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();
    if (error) console.error('Error fetching staff:', error);
    return data;
  },

  // Create staff
  async create(staffData) {
    const { data, error } = await supabaseClient
      .from('staff')
      .insert([staffData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Update staff
  async update(id, staffData) {
    const { data, error } = await supabaseClient
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Delete staff
  async delete(id) {
    const { error } = await supabaseClient
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  // Get staff by department
  async getByDept(dept) {
    const { data, error } = await supabaseClient
      .from('staff')
      .select('*')
      .eq('dept', dept);
    if (error) console.error('Error fetching staff by dept:', error);
    return data || [];
  },
};

// ── ATTENDANCE OPERATIONS ────────────────────────────────
const attendanceOps = {
  // Get today's records
  async getToday() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabaseClient
      .from('attendance')
      .select('*')
      .eq('date', today)
      .order('in_time', { ascending: false });
    if (error) console.error('Error fetching today attendance:', error);
    return data || [];
  },

  // Get records for date range
  async getRange(fromDate, toDate) {
    const { data, error } = await supabaseClient
      .from('attendance')
      .select('*')
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('date', { ascending: false });
    if (error) console.error('Error fetching attendance range:', error);
    return data || [];
  },

  // Get monthly summary
  async getMonthlySummary(year, month) {
    const { data, error } = await supabaseClient
      .rpc('get_monthly_summary', {
        p_year: year,
        p_month: month,
      });
    if (error) console.error('Error fetching monthly summary:', error);
    return data || [];
  },

  // Mark attendance
  async markAttendance(staffId, status = 'present', inTime = null) {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = inTime || new Date().toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Check if staff already marked today
    const { data: existing } = await supabaseClient
      .from('attendance')
      .select('*')
      .eq('staff_id', staffId)
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing record
      return attendanceOps.updateAttendance(existing.id, {
        out_time: currentTime,
        status,
      });
    }

    // Create new record
    const { data, error } = await supabaseClient
      .from('attendance')
      .insert([{
        staff_id: staffId,
        date: today,
        in_time: currentTime,
        status,
        marked_by: 'camera', // or 'manual'
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update attendance record
  async updateAttendance(id, updates) {
    const { data, error } = await supabaseClient
      .from('attendance')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Get staff attendance history
  async getStaffHistory(staffId, days = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const dateStr = fromDate.toISOString().split('T')[0];

    const { data, error } = await supabaseClient
      .from('attendance')
      .select('*')
      .eq('staff_id', staffId)
      .gte('date', dateStr)
      .order('date', { ascending: false });

    if (error) console.error('Error fetching history:', error);
    return data || [];
  },
};

// ── LEAVE OPERATIONS ─────────────────────────────────────
const leaveOps = {
  // Get all leave requests
  async getAll() {
    const { data, error } = await supabaseClient
      .from('leaves')
      .select('*, staff:staff_id(name, dept)')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching leaves:', error);
    return data || [];
  },

  // Get pending leaves
  async getPending() {
    const { data, error } = await supabaseClient
      .from('leaves')
      .select('*, staff:staff_id(name, dept)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching pending leaves:', error);
    return data || [];
  },

  // Create leave request
  async create(leaveData) {
    const { data, error } = await supabaseClient
      .from('leaves')
      .insert([leaveData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // Approve leave
  async approve(id) {
    const { data, error } = await supabaseClient
      .from('leaves')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Reject leave
  async reject(id) {
    const { data, error } = await supabaseClient
      .from('leaves')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Get staff leaves
  async getByStaff(staffId) {
    const { data, error } = await supabaseClient
      .from('leaves')
      .select('*')
      .eq('staff_id', staffId)
      .order('from_date', { ascending: false });
    if (error) console.error('Error fetching staff leaves:', error);
    return data || [];
  },
};

// ── REPORTS OPERATIONS ───────────────────────────────────
const reportsOps = {
  // Get attendance stats
  async getStats(fromDate, toDate) {
    const { data, error } = await supabaseClient
      .rpc('get_attendance_stats', {
        p_from_date: fromDate,
        p_to_date: toDate,
      });
    if (error) console.error('Error getting stats:', error);
    return data || {};
  },

  // Get department-wise report
  async getDeptReport(fromDate, toDate) {
    const { data, error } = await supabaseClient
      .rpc('get_dept_report', {
        p_from_date: fromDate,
        p_to_date: toDate,
      });
    if (error) console.error('Error getting dept report:', error);
    return data || [];
  },

  // Export attendance data (CSV-friendly format)
  async exportAttendance(fromDate, toDate) {
    const { data, error } = await supabaseClient
      .from('attendance')
      .select('*, staff:staff_id(name, role, dept)')
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('date', { ascending: false });
    if (error) console.error('Error exporting data:', error);
    return data || [];
  },
};

// ── AUTHENTICATION ───────────────────────────────────────
const authOps = {
  // Sign up
  async signUp(email, password, displayName) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data.user;
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.session;
  },

  // Sign out
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user;
  },

  // Get current session
  async getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
  },

  // Listen to auth changes
  onAuthChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
  },
};

// Export all operations
Object.assign(window, { 
  supabaseClient, 
  staffOps, 
  attendanceOps, 
  leaveOps, 
  reportsOps, 
  authOps 
});
