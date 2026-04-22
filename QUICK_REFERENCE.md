# 🚀 QUICK REFERENCE CARD

## Setup in 3 Steps

### 1. Clone & Install
```bash
git clone <repo-url>
cd umeed-attendance-system
npm install
```

### 2. Configure Supabase
```bash
# Copy .env.local.example → .env.local
# Add your Supabase URL and Key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key
```

### 3. Run
```bash
npm run dev
```

---

## Supabase Setup

### Get Keys
1. https://app.supabase.com → Your Project
2. Settings → API
3. Copy: Project URL, anon public key

### Create Tables
1. SQL Editor → New Query
2. Paste: `docs/SUPABASE_SCHEMA.sql`
3. Run ▶️
4. Done! ✅

---

## Deployment to Netlify

```bash
# Push to GitHub
git add .
git commit -m "Ready"
git push

# Netlify Setup
# 1. https://netlify.com → New site from Git
# 2. Select your repo
# 3. Build: npm run build
# 4. Publish: dist
# 5. Add environment variables
# 6. Deploy!
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.js` | Database functions |
| `src/store/useStore.js` | Global state |
| `docs/SUPABASE_SCHEMA.sql` | Database schema |
| `docs/API_REFERENCE.md` | Complete API |
| `.env.local.example` | Environment template |
| `SETUP_GUIDE.md` | Full setup guide |

---

## Common Commands

```bash
# Development
npm run dev          # Start local server

# Build
npm run build        # Create production build
npm run preview      # Test production build

# Database
# Run docs/SUPABASE_SCHEMA.sql in Supabase SQL Editor
```

---

## API Functions

```javascript
// Auth
import { signIn, signOut, getCurrentUser } from '@/lib/supabase';

// Staff
import { getStaffList, createStaff, updateStaff } from '@/lib/supabase';

// Attendance
import { recordAttendance, getAttendanceToday } from '@/lib/supabase';

// Leaves
import { createLeaveRequest, approveLeaveRequest } from '@/lib/supabase';

// Real-time
import { subscribeToAttendance } from '@/lib/supabase';
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Get from: Supabase → Project Settings → API

---

## Database Tables

```sql
staff
  ├─ id (String, PK)
  ├─ name, role, department
  ├─ email, phone
  └─ status, attendance_rate

attendance
  ├─ id (UUID, PK)
  ├─ staff_id (FK → staff)
  ├─ date, time_in, time_out
  ├─ status: present|absent|late|leave|halfday
  └─ hours_worked

leave_requests
  ├─ id (UUID, PK)
  ├─ staff_id (FK → staff)
  ├─ leave_type: sick|casual|annual|duty|halfday
  ├─ from_date, to_date, num_days
  ├─ reason
  └─ status: pending|approved|rejected

activity_log
  ├─ id (UUID, PK)
  ├─ staff_id (FK → staff)
  ├─ action, details
  └─ created_at
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Can't connect to Supabase" | Check `.env.local` has correct values |
| "Tables not found" | Run SUPABASE_SCHEMA.sql in SQL Editor |
| "Auth not working" | Enable Email provider in Supabase Auth |
| "Build fails on Netlify" | Set Node 18 in netlify.toml |
| "Real-time not syncing" | Enable Replication in Supabase Database Settings |

---

## Project Structure

```
src/
├── lib/supabase.js          ← All DB functions
├── store/useStore.js        ← Global state
├── components/
│   ├── shared/              ← Reusable components
│   ├── screens/             ← Dashboard, Staff, Leaves
│   └── auth/                ← Login, Register
├── styles/global.css        ← Design tokens
└── App.jsx                  ← Main component
```

---

## Tech Stack

- **Frontend:** React 18, Vite
- **Backend:** Supabase (PostgreSQL)
- **State:** Zustand
- **Hosting:** Netlify
- **Auth:** Supabase Auth
- **Real-time:** WebSocket (built-in)

---

## Useful Links

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Netlify Docs:** https://docs.netlify.com

---

## Support

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Check `docs/API_REFERENCE.md` for all functions
3. Check browser console (F12) for errors
4. Check Netlify build logs for deployment issues
5. Check Supabase Dashboard → Logs for database errors

---

## Next Steps

1. ✅ Setup local environment
2. ✅ Create Supabase project & database
3. ✅ Run locally with `npm run dev`
4. ✅ Push to GitHub
5. ✅ Deploy to Netlify
6. ✅ Add your school's staff data
7. ✅ Share with your team!

---

**Everything ready? Run: `npm run dev` 🚀**

---

**Questions? Check the docs!**
- Full Setup: `SETUP_GUIDE.md`
- All Functions: `docs/API_REFERENCE.md`
- Deployment: `DEPLOYMENT_CHECKLIST.md`
- Overview: `README.md`

---

**Made with ❤️ for Umeed Education System**
