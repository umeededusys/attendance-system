// ── UES SCHOOL DATA + SCREENS ────────────────────────────
// Real Umeed Education System school staff data
// Camera Attendance | ZKTeco BM40 | Dashboard | Reports | Staff | Leaves

const { useState: uState, useEffect: uEffect, useRef: uRef } = React;

// ── SCHOOL STAFF DATA ─────────────────────────────────────
const STAFF = [
  {id:'UES-001', name:'Hafiz Muhammad Tariq Mehmood', role:'Principal',                dept:'Administration',    email:'principal@umeededu.pk',  phone:'+92 300 1234001', join:'Jan 2010', status:'present',  rate:99, type:'admin'},
  {id:'UES-002', name:'Mrs. Ruqaiya Bibi',             role:'Vice Principal',           dept:'Administration',    email:'vp@umeededu.pk',         phone:'+92 301 1234002', join:'Mar 2012', status:'present',  rate:97, type:'admin'},
  {id:'UES-003', name:'Mr. Muhammad Asif Khan',        role:'Admin Officer',            dept:'Administration',    email:'admin@umeededu.pk',      phone:'+92 302 1234003', join:'Jun 2015', status:'present',  rate:94, type:'admin'},
  {id:'UES-004', name:'Mr. Muhammad Bilal Raza',       role:'Accountant',               dept:'Finance',           email:'accounts@umeededu.pk',   phone:'+92 303 1234004', join:'Jan 2016', status:'late',     rate:89, type:'admin'},
  {id:'UES-005', name:'Mr. Sajid Hussain',             role:'Head of Science Dept.',    dept:'Science',           email:'hod.sci@umeededu.pk',    phone:'+92 304 1234005', join:'Aug 2013', status:'present',  rate:96, type:'teacher'},
  {id:'UES-006', name:'Mr. Kamran Akhtar',             role:'Physics Teacher',          dept:'Science',           email:'physics@umeededu.pk',    phone:'+92 305 1234006', join:'Sep 2017', status:'present',  rate:92, type:'teacher'},
  {id:'UES-007', name:'Mrs. Nadia Pervaiz',            role:'Chemistry Teacher',        dept:'Science',           email:'chemistry@umeededu.pk',  phone:'+92 306 1234007', join:'Jan 2018', status:'present',  rate:91, type:'teacher'},
  {id:'UES-008', name:'Mr. Fahad Malik',               role:'Biology Teacher',          dept:'Science',           email:'biology@umeededu.pk',    phone:'+92 307 1234008', join:'Mar 2019', status:'absent',   rate:82, type:'teacher'},
  {id:'UES-009', name:'Mr. Usman Ali',                 role:'Mathematics Teacher',      dept:'Secondary Section', email:'maths@umeededu.pk',      phone:'+92 308 1234009', join:'Jul 2016', status:'present',  rate:95, type:'teacher'},
  {id:'UES-010', name:'Mrs. Sana Riaz',                role:'English Teacher',          dept:'Secondary Section', email:'english@umeededu.pk',    phone:'+92 309 1234010', join:'Nov 2017', status:'present',  rate:93, type:'teacher'},
  {id:'UES-011', name:'Mr. Abdul Rehman',              role:'Urdu Teacher',             dept:'Secondary Section', email:'urdu@umeededu.pk',       phone:'+92 310 1234011', join:'Feb 2015', status:'present',  rate:90, type:'teacher'},
  {id:'UES-012', name:'Mrs. Hina Shabbir',             role:'Pakistan Studies Teacher', dept:'Secondary Section', email:'pakstudies@umeededu.pk', phone:'+92 311 1234012', join:'Apr 2018', status:'halfday',  rate:87, type:'teacher'},
  {id:'UES-013', name:'Hafiz Muhammad Umar',           role:'Islamiyat Teacher',        dept:'Secondary Section', email:'islamiyat@umeededu.pk',  phone:'+92 312 1234013', join:'Jan 2014', status:'present',  rate:98, type:'teacher'},
  {id:'UES-014', name:'Mr. Zain ul Abideen',           role:'Computer Science Teacher', dept:'Secondary Section', email:'cs@umeededu.pk',         phone:'+92 313 1234014', join:'Aug 2020', status:'present',  rate:94, type:'teacher'},
  {id:'UES-015', name:'Mrs. Ayesha Tariq',             role:'Class Teacher (I–III)',     dept:'Primary Section',   email:'primary1@umeededu.pk',   phone:'+92 314 1234015', join:'Jun 2016', status:'present',  rate:96, type:'teacher'},
  {id:'UES-016', name:'Mrs. Fatima Noor',              role:'Class Teacher (IV–V)',      dept:'Primary Section',   email:'primary2@umeededu.pk',   phone:'+92 315 1234016', join:'Sep 2019', status:'leave',    rate:88, type:'teacher'},
  {id:'UES-017', name:'Mr. Arif Hussain',              role:'Librarian',                 dept:'Support',           email:'library@umeededu.pk',    phone:'+92 316 1234017', join:'Mar 2013', status:'present',  rate:91, type:'support'},
  {id:'UES-018', name:'Mr. Faisal Iqbal',              role:'Science Lab Assistant',     dept:'Support',           email:'lab@umeededu.pk',        phone:'+92 317 1234018', join:'Jan 2021', status:'present',  rate:85, type:'support'},
  {id:'UES-019', name:'Mr. Muhammad Naveed',           role:'Office Assistant',          dept:'Administration',    email:'office@umeededu.pk',     phone:'+92 318 1234019', join:'Nov 2018', status:'present',  rate:88, type:'support'},
  {id:'UES-020', name:'Muhammad Rafiq',                role:'Support Staff',             dept:'Support',           email:'support@umeededu.pk',    phone:'+92 319 1234020', join:'Apr 2017', status:'present',  rate:83, type:'support'},
];

const TODAY_RECORDS = [
  {id:'UES-001',in:'07:48',out:'—',   hours:'—',    status:'present'},
  {id:'UES-002',in:'07:52',out:'—',   hours:'—',    status:'present'},
  {id:'UES-003',in:'07:55',out:'—',   hours:'—',    status:'present'},
  {id:'UES-004',in:'08:22',out:'—',   hours:'—',    status:'late'},
  {id:'UES-005',in:'07:58',out:'—',   hours:'—',    status:'present'},
  {id:'UES-006',in:'07:50',out:'—',   hours:'—',    status:'present'},
  {id:'UES-007',in:'07:54',out:'—',   hours:'—',    status:'present'},
  {id:'UES-008',in:'—',   out:'—',   hours:'—',    status:'absent'},
  {id:'UES-009',in:'07:59',out:'—',   hours:'—',    status:'present'},
  {id:'UES-010',in:'08:01',out:'—',   hours:'—',    status:'present'},
  {id:'UES-011',in:'07:57',out:'—',   hours:'—',    status:'present'},
  {id:'UES-012',in:'08:00',out:'13:00',hours:'5h',  status:'halfday'},
  {id:'UES-013',in:'07:45',out:'—',   hours:'—',    status:'present'},
  {id:'UES-014',in:'07:53',out:'—',   hours:'—',    status:'present'},
  {id:'UES-015',in:'07:56',out:'—',   hours:'—',    status:'present'},
  {id:'UES-016',in:'—',   out:'—',   hours:'—',    status:'leave'},
  {id:'UES-017',in:'08:05',out:'—',   hours:'—',    status:'present'},
  {id:'UES-018',in:'08:02',out:'—',   hours:'—',    status:'present'},
  {id:'UES-019',in:'07:58',out:'—',   hours:'—',    status:'present'},
  {id:'UES-020',in:'08:10',out:'—',   hours:'—',    status:'present'},
];

const LEAVE_REQUESTS = [
  {id:'LR-0041',name:'Mrs. Fatima Noor',    dept:'Primary Section',   type:'Sick Leave',    from:'22 Apr',to:'24 Apr',days:3,  status:'approved', reason:'Medical treatment — hospital admitted'},
  {id:'LR-0042',name:'Mr. Fahad Malik',     dept:'Science',           type:'Casual Leave',  from:'22 Apr',to:'22 Apr',days:1,  status:'approved', reason:'Personal work — urgent'},
  {id:'LR-0043',name:'Mr. Muhammad Bilal',  dept:'Finance',           type:'Casual Leave',  from:'25 Apr',to:'25 Apr',days:1,  status:'pending',  reason:'Bank work'},
  {id:'LR-0044',name:'Mrs. Hina Shabbir',   dept:'Secondary Section', type:'Half Day',      from:'22 Apr',to:'22 Apr',days:0.5,status:'approved', reason:'Child school event'},
  {id:'LR-0045',name:'Mr. Arif Hussain',    dept:'Support',           type:'Annual Leave',  from:'28 Apr',to:'30 Apr',days:3,  status:'pending',  reason:'Travel — family occasion'},
  {id:'LR-0046',name:'Mrs. Sana Riaz',      dept:'Secondary Section', type:'Duty Leave',    from:'29 Apr',to:'29 Apr',days:1,  status:'approved', reason:'Board exam duty — BISE Lahore'},
  {id:'LR-0047',name:'Mr. Abdul Rehman',    dept:'Secondary Section', type:'Sick Leave',    from:'30 Apr',to:'1 May', days:2,  status:'pending',  reason:'Doctor advised rest'},
];

const MONTHLY_DATA = [
  {label:'Jan',present:18,absent:2,late:1},{label:'Feb',present:19,absent:1,late:2},{label:'Mar',present:17,absent:3,late:2},
  {label:'Apr',present:18,absent:2,late:1},{label:'May',present:19,absent:1,late:1},{label:'Jun',present:16,absent:4,late:2},
  {label:'Jul',present:18,absent:2,late:2},{label:'Aug',present:19,absent:1,late:1},{label:'Sep',present:18,absent:2,late:2},
  {label:'Oct',present:19,absent:1,late:1},{label:'Nov',present:17,absent:3,late:2},{label:'Dec',present:16,absent:4,late:3},
];

const WEEKLY_DATA = [
  {label:'Mon',present:18,absent:2},{label:'Tue',present:19,absent:1},{label:'Wed',present:17,absent:3},
  {label:'Thu',present:19,absent:1},{label:'Fri',present:18,absent:2},{label:'Sat',present:20,absent:0},
];

const ACTIVITY = [
  {color:'#4ade80',name:'Hafiz Muhammad Tariq',  action:'checked in — 07:48 AM',          time:'2 min ago'},
  {color:'#4ade80',name:'Mrs. Ruqaiya Bibi',      action:'checked in — 07:52 AM',          time:'5 min ago'},
  {color:'#fbbf24',name:'Mr. Muhammad Bilal',     action:'late arrival — 08:22 AM',        time:'38 min ago'},
  {color:'#f87171',name:'Mr. Fahad Malik',         action:'marked absent — leave approved', time:'1h ago'},
  {color:'#38bdf8',name:'Mrs. Hina Shabbir',       action:'half day — checked in 08:00',   time:'1h 15m ago'},
  {color:'#a78bfa',name:'Mrs. Fatima Noor',        action:'sick leave — 3 days approved',  time:'2h ago'},
];

// ── CAMERA ATTENDANCE MODAL ───────────────────────────────
function CameraAttendanceModal({ open, onClose }) {
  const videoRef = uRef(null);
  const canvasRef = uRef(null);
  const [stream, setStream]       = uState(null);
  const [captured, setCaptured]   = uState(null);
  const [step, setStep]           = uState('select'); // select | camera | confirm | done
  const [selectedStaff, setSelectedStaff] = uState('');
  const [camError, setCamError]   = uState('');
  const [marking, setMarking]     = uState(false);

  uEffect(() => {
    if (!open) { stopCamera(); setCaptured(null); setStep('select'); setSelectedStaff(''); setCamError(''); }
  }, [open]);

  async function startCamera() {
    setCamError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'user', width:640, height:480 } });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; }
      setStep('camera');
    } catch(e) {
      setCamError('Camera access denied or not available. Please allow camera permission.');
    }
  }

  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t=>t.stop()); setStream(null); }
  }

  function capture() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL('image/jpeg', 0.85));
    stopCamera();
    setStep('confirm');
  }

  function retake() { setCaptured(null); setStep('select'); }

  function confirm() {
    setMarking(true);
    setTimeout(() => { setMarking(false); setStep('done'); }, 1400);
  }

  const staff = STAFF.find(s => s.id === selectedStaff);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{maxWidth:520,width:'100%'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:600,color:'var(--text-primary)'}}>
              {step==='done' ? '✓ Attendance Marked' : 'Camera Attendance'}
            </div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>
              {step==='select'&&'Select staff member then capture photo'}
              {step==='camera'&&'Position face clearly in frame'}
              {step==='confirm'&&'Confirm photo and mark attendance'}
              {step==='done'&&'Record saved successfully'}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><Icon.X/></button>
        </div>

        {step === 'select' && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="input-wrap">
              <label className="input-label">Staff Member</label>
              <select className="input-field" value={selectedStaff} onChange={e=>setSelectedStaff(e.target.value)}>
                <option value="">— Select staff member —</option>
                {STAFF.map(s=><option key={s.id} value={s.id}>{s.name} · {s.role}</option>)}
              </select>
            </div>
            <div className="input-wrap">
              <label className="input-label">Date & Time</label>
              <input className="input-field" value={`Wednesday, 22 April 2026 — ${new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`} readOnly/>
            </div>
            {camError && <div style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',borderRadius:8,padding:'10px 14px',fontSize:12.5,color:'#dc2626'}}>{camError}</div>}
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" style={{flex:2,justifyContent:'center'}} onClick={startCamera} disabled={!selectedStaff}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}>
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Open Camera
              </button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div style={{display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>
            {staff && (
              <div style={{display:'flex',alignItems:'center',gap:10,alignSelf:'stretch',background:'var(--input-bg)',borderRadius:'var(--radius-sm)',padding:'10px 14px',border:'1px solid var(--border)'}}>
                <div className="avatar" style={{width:32,height:32,fontSize:13}}>{staff.name[0]}</div>
                <div><div style={{fontSize:13.5,fontWeight:500,color:'var(--text-primary)'}}>{staff.name}</div>
                <div style={{fontSize:11.5,color:'var(--text-muted)'}}>{staff.role}</div></div>
              </div>
            )}
            <div style={{position:'relative',width:'100%',borderRadius:var_radius_md,overflow:'hidden',border:'2px solid var(--border-maroon)',background:'#000',aspectRatio:'4/3'}}>
              <video ref={videoRef} autoPlay playsInline muted style={{width:'100%',height:'100%',objectFit:'cover',transform:'scaleX(-1)'}}/>
              {/* Face guide overlay */}
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <div style={{width:180,height:220,border:'2px solid rgba(212,175,55,0.6)',borderRadius:'50% 50% 45% 45%',boxShadow:'0 0 0 9999px rgba(0,0,0,0.35)'}}/>
              </div>
              <div style={{position:'absolute',bottom:12,left:0,right:0,textAlign:'center',fontSize:11.5,color:'rgba(255,255,255,0.7)'}}>Centre your face in the oval</div>
            </div>
            <canvas ref={canvasRef} style={{display:'none'}}/>
            <div style={{display:'flex',gap:10,width:'100%'}}>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={()=>{stopCamera();setStep('select');}}>Back</button>
              <button className="btn btn-primary" style={{flex:2,justifyContent:'center',fontSize:14}} onClick={capture}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                Capture Photo
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div style={{display:'flex',flexDirection:'column',gap:16,alignItems:'center'}}>
            <div style={{width:'100%',borderRadius:'var(--radius-md)',overflow:'hidden',border:'2px solid var(--border-gold)',position:'relative',aspectRatio:'4/3'}}>
              <img src={captured} alt="Captured" style={{width:'100%',height:'100%',objectFit:'cover',transform:'scaleX(-1)'}}/>
              <div style={{position:'absolute',top:10,right:10,background:'rgba(0,0,0,.6)',borderRadius:6,padding:'4px 10px',fontSize:11.5,color:'#fff'}}>
                {new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
              </div>
            </div>
            {staff && (
              <div style={{alignSelf:'stretch',background:'rgba(212,175,55,0.08)',border:'1px solid var(--border-gold)',borderRadius:'var(--radius-sm)',padding:'12px 16px'}}>
                <div style={{fontSize:13.5,fontWeight:600,color:'var(--text-primary)'}}>{staff.name}</div>
                <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{staff.role} · {staff.dept} · {staff.id}</div>
              </div>
            )}
            <div style={{display:'flex',gap:10,width:'100%'}}>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:'center'}} onClick={retake}>Retake</button>
              <button className="btn btn-gold" style={{flex:2,justifyContent:'center'}} onClick={confirm} disabled={marking}>
                {marking
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:15,height:15,animation:'spin .8s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                  : <Icon.Check/>
                }
                {marking ? 'Saving…' : 'Confirm & Mark Present'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div style={{textAlign:'center',padding:'20px 0 8px'}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(34,197,94,.12)',border:'2px solid rgba(34,197,94,.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',color:'#4ade80'}}>
              <Icon.Check/>
            </div>
            {staff && <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,color:'var(--text-primary)',marginBottom:4}}>{staff.name}</div>}
            <div style={{fontSize:13.5,color:'var(--text-muted)',marginBottom:20}}>
              Marked <strong style={{color:'#4ade80'}}>Present</strong> at {new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} — {new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
            </div>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper for CSS var (workaround for template literal in JSX)
const var_radius_md = 'var(--radius-md)';

// ── ZKTECO BM40 DEVICE CARD ───────────────────────────────
function ZKTecoCard() {
  const [syncing, setSyncing] = uState(false);
  const [lastSync, setLastSync] = uState('Today, 07:30 AM');
  const [status] = uState('online'); // online | offline

  const recentLogs = [
    {id:'UES-001',name:'Hafiz Muhammad Tariq', time:'07:48',event:'Check In',  method:'Fingerprint'},
    {id:'UES-005',name:'Mr. Sajid Hussain',     time:'07:58',event:'Check In',  method:'Fingerprint'},
    {id:'UES-013',name:'Hafiz Muhammad Umar',   time:'07:45',event:'Check In',  method:'Card'},
    {id:'UES-006',name:'Mr. Kamran Akhtar',      time:'07:50',event:'Check In',  method:'Fingerprint'},
    {id:'UES-002',name:'Mrs. Ruqaiya Bibi',      time:'07:52',event:'Check In',  method:'Fingerprint'},
  ];

  function handleSync() {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setLastSync('Just now'); }, 2200);
  }

  return (
    <div className="glass fade-up fade-up-2" style={{borderRadius:'var(--radius-lg)',padding:22,border:'1px solid var(--border-gold)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:42,height:42,borderRadius:10,background:'linear-gradient(135deg,rgba(212,175,55,.2),rgba(212,175,55,.05))',border:'1px solid var(--border-gold)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.6" style={{width:20,height:20}}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/><path d="M7 7h.01M12 7h.01M17 7h.01M7 11h.01M12 11h.01M17 11h.01"/>
            </svg>
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:600,color:'var(--text-primary)'}}>ZKTeco BM40</div>
            <div style={{fontSize:11.5,color:'var(--text-muted)'}}>Biometric Device · 192.168.1.201</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:status==='online'?'#4ade80':'#f87171'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'currentColor',animation:status==='online'?'pulse 2s infinite':'none'}}/>
            {status==='online'?'Connected':'Offline'}
          </div>
          <button className="btn btn-ghost" style={{padding:'6px 14px',fontSize:12}} onClick={handleSync} disabled={syncing}>
            {syncing
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,animation:'spin .8s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:13,height:13}}><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
            }
            {syncing ? 'Syncing…' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Device stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:16}}>
        {[
          {label:'Records Today', val:'19', color:'var(--gold)'},
          {label:'Total Staff',   val:'20', color:'#4ade80'},
          {label:'Last Sync',     val:lastSync, color:'var(--text-secondary)', small:true},
        ].map(s=>(
          <div key={s.label} style={{background:'var(--input-bg)',borderRadius:'var(--radius-sm)',padding:'10px 12px',border:'1px solid var(--border)',textAlign:'center'}}>
            <div style={{fontFamily:s.small?'var(--font-body)':'var(--font-display)',fontSize:s.small?11.5:20,fontWeight:s.small?400:700,color:s.color,lineHeight:1.2}}>{s.val}</div>
            <div style={{fontSize:10.5,color:'var(--text-muted)',marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent logs */}
      <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:8}}>Recent Device Logs</div>
      <div style={{display:'flex',flexDirection:'column',gap:0}}>
        {recentLogs.map((log,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<recentLogs.length-1?'1px solid var(--border)':'none'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12.5,color:'var(--text-primary)',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{log.name}</div>
              <div style={{fontSize:11,color:'var(--text-muted)'}}>{log.id} · {log.method}</div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontSize:12.5,fontVariantNumeric:'tabular-nums',color:'var(--text-secondary)'}}>{log.time} AM</div>
              <div style={{fontSize:10.5,color:'#4ade80'}}>{log.event}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12,padding:'10px 14px',background:'rgba(212,175,55,.06)',border:'1px solid var(--border-gold)',borderRadius:'var(--radius-sm)',fontSize:11.5,color:'var(--text-muted)'}}>
        <span style={{color:'var(--gold)',fontWeight:500}}>Note:</span> ZKTeco BM40 integration is active. Live fingerprint/card data syncs automatically every 15 minutes. Manual sync available above.
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────
function DashboardScreen({ tweaks }) {
  const [cameraOpen, setCameraOpen] = uState(false);
  const [tab, setTab] = uState('Week');
  const barData = tab==='Week' ? WEEKLY_DATA : MONTHLY_DATA;
  const presentCount = TODAY_RECORDS.filter(r=>r.status==='present').length;
  const absentCount  = TODAY_RECORDS.filter(r=>r.status==='absent').length;
  const leaveCount   = TODAY_RECORDS.filter(r=>r.status==='leave').length;
  const lateCount    = TODAY_RECORDS.filter(r=>r.status==='late').length;
  const total = STAFF.length;

  return (
    <>
      {/* Summary strip */}
      <div className="glass-maroon fade-up" style={{padding:tweaks.compactMode?'14px 20px':'20px 24px',marginBottom:20,borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:tweaks.compactMode?14:17,color:'var(--text-muted)'}}>
            Good morning, <span style={{color:'var(--gold)',fontWeight:600}}>Admin</span>
          </div>
          <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>Wednesday, 22 April 2026 · School Day · Assembly at 07:45</div>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
          {[{val:total,lbl:'Total Staff'},{val:presentCount,lbl:'Present'},{val:absentCount,lbl:'Absent'},{val:lateCount,lbl:'Late'},{val:leaveCount,lbl:'On Leave'}].map(s=>(
            <div key={s.lbl} style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:tweaks.compactMode?18:22,fontWeight:700,color:'var(--gold)',lineHeight:1}}>{s.val}</div>
              <div style={{fontSize:10.5,color:'rgba(255,255,255,.45)',marginTop:2}}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-gold" style={{padding:tweaks.compactMode?'8px 14px':'10px 18px',fontSize:12.5}} onClick={()=>setCameraOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Camera Attendance
          </button>
          <button className="btn btn-primary" style={{padding:tweaks.compactMode?'8px 14px':'10px 18px',fontSize:12.5}}>
            <Icon.Plus/>Manual Entry
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{marginBottom:20}}>
        <StatCard value={`${Math.round((presentCount/total)*100)}%`} label="Present Rate Today" icon={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} color="#D4AF37" glowColor="rgba(212,175,55,.3)" trend="+2.1% vs last week" trendUp delay={0}/>
        <StatCard value={presentCount} label="Present Today"    icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} color="#4ade80" glowColor="rgba(34,197,94,.2)" trend="+1 vs yesterday" trendUp delay={.05}/>
        <StatCard value={absentCount}  label="Absent Today"     icon={<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/></>} color="#f87171" glowColor="rgba(239,68,68,.2)" trend="Same as yesterday" delay={.1}/>
        <StatCard value={lateCount}    label="Late Arrivals"    icon={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} color="#fbbf24" glowColor="rgba(251,191,36,.2)" trend="-1 vs yesterday" trendUp delay={.15}/>
      </div>

      {/* ZKTeco + Activity */}
      <div style={{display:'grid',gridTemplateColumns:tweaks.showActivity?'1fr 1fr':'1fr',gap:16,marginBottom:20}}>
        <ZKTecoCard/>
        {tweaks.showActivity && (
          <div className="glass fade-up fade-up-3" style={{borderRadius:'var(--radius-lg)',padding:20}}>
            <SectionHeader title="Live Activity">
              <div style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',animation:'pulse 2s infinite'}}/>
            </SectionHeader>
            {ACTIVITY.map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'9px 0',borderBottom:i<ACTIVITY.length-1?'1px solid var(--border)':'none'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:item.color,flexShrink:0,marginTop:5}}/>
                <div>
                  <div style={{fontSize:12.5,color:'var(--text-secondary)',lineHeight:1.5}}><strong style={{color:'var(--text-primary)',fontWeight:500}}>{item.name}</strong> {item.action}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:1}}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="glass fade-up fade-up-3" style={{borderRadius:'var(--radius-lg)',padding:22,marginBottom:20}}>
        <SectionHeader title="Attendance Overview" sub="Staff present vs. absent this period">
          <Tabs options={['Week','Month']} value={tab} onChange={setTab}/>
          <button className="btn btn-ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>window.print()}><Icon.Print/>Export</button>
        </SectionHeader>
        <div style={{display:'flex',gap:14,marginBottom:14,flexWrap:'wrap'}}>
          {[{color:'var(--maroon-bright)',label:'Present'},{color:'#f87171',label:'Absent'},{color:'#fbbf24',label:'Late'}].map(l=>(
            <div key={l.label} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'var(--text-secondary)'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:l.color}}/>{l.label}
            </div>
          ))}
        </div>
        <BarChart data={barData} height={150} maxVal={22}/>
      </div>

      {/* Today's attendance table */}
      <div className="table-wrap glass fade-up fade-up-4">
        <div style={{padding:'18px 20px 0'}}>
          <SectionHeader title="Today's Staff Attendance" sub={`${total} staff · Wed 22 Apr 2026 · School hours: 07:45 – 14:30`}>
            <button className="btn btn-ghost" style={{padding:'6px 12px',fontSize:12}}><Icon.Filter/>Filter</button>
          </SectionHeader>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th>Staff Member</th><th className="hide-mobile">Department</th><th>Check In</th><th className="hide-mobile">Check Out</th><th>Status</th></tr></thead>
            <tbody>
              {STAFF.map((s,i)=>{
                const rec = TODAY_RECORDS.find(r=>r.id===s.id)||{in:'—',out:'—',status:'absent'};
                return (
                  <tr key={i}>
                    <td><div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="avatar" style={{width:28,height:28,fontSize:11}}>{s.name[0]}</div>
                      <div><div className="td-primary" style={{whiteSpace:'nowrap'}}>{s.name}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)'}}>{s.id} · {s.role}</div></div>
                    </div></td>
                    <td className="hide-mobile">{s.dept}</td>
                    <td style={{color:'var(--text-primary)',fontVariantNumeric:'tabular-nums'}}>{rec.in}</td>
                    <td className="hide-mobile" style={{fontVariantNumeric:'tabular-nums'}}>{rec.out}</td>
                    <td><Badge status={rec.status}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <div style={{fontSize:12,color:'var(--text-muted)'}}>Showing all {total} staff members</div>
          <div style={{fontSize:12,color:'var(--text-muted)'}}>
            <span style={{color:'#4ade80',fontWeight:600}}>{presentCount} Present</span> · <span style={{color:'#f87171',fontWeight:600}}>{absentCount} Absent</span> · <span style={{color:'#fbbf24',fontWeight:600}}>{lateCount} Late</span> · <span style={{color:'#a78bfa',fontWeight:600}}>{leaveCount} Leave</span>
          </div>
        </div>
      </div>

      <CameraAttendanceModal open={cameraOpen} onClose={()=>setCameraOpen(false)}/>
    </>
  );
}

// ── REPORTS SCREEN ────────────────────────────────────────
function ReportsScreen() {
  const [period, setPeriod] = uState('Monthly');
  const trendSeries = [
    {color:'var(--maroon-bright)',label:'Present',values:MONTHLY_DATA.map(d=>d.present)},
    {color:'#f87171',             label:'Absent', values:MONTHLY_DATA.map(d=>d.absent)},
    {color:'#fbbf24',             label:'Late',   values:MONTHLY_DATA.map(d=>d.late)},
  ];
  const deptDonut = [
    {label:'Administration',  value:4,  color:'var(--maroon-bright)'},
    {label:'Secondary Section',value:7, color:'#D4AF37'},
    {label:'Primary Section', value:2,  color:'#4ade80'},
    {label:'Science Dept.',   value:4,  color:'#a78bfa'},
    {label:'Finance',         value:1,  color:'#38bdf8'},
    {label:'Support Staff',   value:3,  color:'#fb923c'},
  ];
  const statusDonut = [
    {label:'Present',  value:16, color:'#4ade80'},
    {label:'Absent',   value:1,  color:'#f87171'},
    {label:'Late',     value:1,  color:'#fbbf24'},
    {label:'On Leave', value:1,  color:'#a78bfa'},
    {label:'Half Day', value:1,  color:'#38bdf8'},
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div className="fade-up" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:700,color:'var(--text-primary)'}}>Attendance Reports</div>
          <div style={{fontSize:13,color:'var(--text-muted)',marginTop:3}}>Umeed Education System · Academic Year 2025–26</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <Tabs options={['Monthly','Quarterly','Yearly']} value={period} onChange={setPeriod}/>
          <button className="btn btn-primary" style={{padding:'8px 16px',fontSize:12}} onClick={()=>window.print()}><Icon.Print/>Export PDF</button>
        </div>
      </div>

      <div className="stat-grid fade-up fade-up-1">
        <StatCard value="90%" label="Avg Attendance" icon={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} color="#D4AF37" trend="+2.1% vs last month" trendUp delay={0}/>
        <StatCard value="216" label="Total Man-Days"  icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} color="#4ade80" trend="+12 vs last month" trendUp delay={.05}/>
        <StatCard value="24"  label="Total Absences"  icon={<><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/></>} color="#f87171" trend="-4 vs last month" trendUp delay={.1}/>
        <StatCard value="18"  label="Late Arrivals"   icon={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} color="#fbbf24" trend="-3 vs last month" trendUp delay={.15}/>
      </div>

      <div className="glass fade-up fade-up-2" style={{borderRadius:'var(--radius-lg)',padding:24}}>
        <SectionHeader title="12-Month Attendance Trend" sub="Jan 2026 – Dec 2026">
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            {trendSeries.map(s=><div key={s.label} style={{display:'flex',alignItems:'center',gap:6,fontSize:11.5,color:'var(--text-secondary)'}}><div style={{width:8,height:8,borderRadius:2,background:s.color}}/>{s.label}</div>)}
          </div>
        </SectionHeader>
        <MultiLineChart series={trendSeries} labels={MONTHLY_DATA.map(d=>d.label)} height={180}/>
      </div>

      <div className="grid-2 fade-up fade-up-3">
        <div className="glass" style={{borderRadius:'var(--radius-lg)',padding:22}}>
          <SectionHeader title="By Department" sub="Staff headcount"/>
          <DonutChart data={deptDonut} size={170} thickness={26} title="20" subtitle="Total Staff"/>
        </div>
        <div className="glass" style={{borderRadius:'var(--radius-lg)',padding:22}}>
          <SectionHeader title="Today's Status" sub="22 Apr 2026"/>
          <DonutChart data={statusDonut} size={170} thickness={26} title="90%" subtitle="Present Rate"/>
        </div>
      </div>

      <div className="table-wrap glass fade-up fade-up-4">
        <div style={{padding:'18px 20px 0'}}><SectionHeader title="Monthly Breakdown" sub="Academic Year 2025–26"/></div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th>Month</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th><th>Trend</th></tr></thead>
            <tbody>
              {MONTHLY_DATA.map((d,i)=>{
                const rate = Math.round((d.present/(d.present+d.absent))*100);
                const prev = i>0?Math.round((MONTHLY_DATA[i-1].present/(MONTHLY_DATA[i-1].present+MONTHLY_DATA[i-1].absent))*100):rate;
                const diff = rate-prev;
                return (
                  <tr key={i}>
                    <td className="td-primary">{d.label} 2026</td>
                    <td style={{color:'#4ade80'}}>{d.present}</td>
                    <td style={{color:'#f87171'}}>{d.absent}</td>
                    <td style={{color:'#fbbf24'}}>{d.late}</td>
                    <td><div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:60,height:4,borderRadius:2,background:'var(--border)'}}><div style={{height:'100%',borderRadius:2,width:`${rate}%`,background:'var(--maroon-bright)'}}/></div>
                      <span className="td-primary">{rate}%</span>
                    </div></td>
                    <td style={{color:diff>=0?'#4ade80':'#f87171',fontSize:12}}>{i===0?'—':`${diff>=0?'↑':'↓'} ${Math.abs(diff)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── STAFF SCREEN ──────────────────────────────────────────
function StaffScreen() {
  const [selected, setSelected] = uState(null);
  const [search, setSearch]     = uState('');
  const [typeFilter, setTypeFilter] = uState('All');

  const filtered = STAFF.filter(s=>
    (typeFilter==='All'||s.type===typeFilter.toLowerCase()||s.dept===typeFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase())||s.id.includes(search)||s.role.toLowerCase().includes(search.toLowerCase()))
  );
  const emp = STAFF.find(e=>e.id===selected);

  return (
    <div style={{display:'flex',gap:20,alignItems:'flex-start',flexWrap:'wrap'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:14,minWidth:280}}>
        <div className="fade-up" style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <div className="search-bar" style={{flex:1,minWidth:180}}>
            <Icon.Search/><input placeholder="Search staff…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <Tabs options={['All','Teacher','Admin','Support']} value={typeFilter} onChange={setTypeFilter}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:12}}>
          {filtered.map((s,i)=>(
            <div key={s.id} className="glass fade-up"
              style={{borderRadius:'var(--radius-md)',padding:16,cursor:'pointer',animationDelay:`${i*.04}s`,transition:'all .22s cubic-bezier(.22,1,.36,1)',border:selected===s.id?'1px solid var(--maroon-bright)':'1px solid var(--border)',transform:selected===s.id?'translateY(-2px)':'none'}}
              onClick={()=>setSelected(selected===s.id?null:s.id)}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                <div className="avatar" style={{width:40,height:40,fontSize:15,borderRadius:11}}>{s.name.split(' ').find(w=>w.match(/^[A-Z]/))?.charAt(0)||s.name[0]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.name}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.role}</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontSize:11.5,color:'var(--text-muted)'}}>{s.dept}</div>
                <Badge status={s.status}/>
              </div>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)',marginBottom:3}}>
                  <span>Attendance</span><span style={{color:'var(--text-primary)',fontWeight:600}}>{s.rate}%</span>
                </div>
                <div style={{height:3,borderRadius:99,background:'var(--border)'}}>
                  <div style={{height:'100%',borderRadius:99,width:`${s.rate}%`,background:s.rate>92?'#4ade80':s.rate>85?'var(--gold)':'#f87171',transition:'width .6s ease'}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {emp && (
        <div className="glass fade-up" style={{width:290,flexShrink:0,borderRadius:'var(--radius-lg)',padding:22,border:'1px solid var(--border-maroon)',position:'sticky',top:80}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:600,color:'var(--text-primary)'}}>Profile</div>
            <button className="btn-icon" style={{width:26,height:26}} onClick={()=>setSelected(null)}><Icon.X/></button>
          </div>
          <div style={{textAlign:'center',marginBottom:16}}>
            <div className="avatar" style={{width:58,height:58,fontSize:22,borderRadius:16,margin:'0 auto 12px',border:'3px solid var(--border-gold)'}}>{emp.name.split(' ').find(w=>w.match(/^[A-Z]/))?.charAt(0)||emp.name[0]}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:700,color:'var(--text-primary)',lineHeight:1.2}}>{emp.name}</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{emp.role}</div>
            <div style={{marginTop:8}}><Badge status={emp.status}/></div>
          </div>
          <hr className="divider"/>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[{label:'ID',val:emp.id},{label:'Department',val:emp.dept},{label:'Email',val:emp.email},{label:'Phone',val:emp.phone},{label:'Joined',val:emp.join}].map(r=>(
              <div key={r.label}>
                <div style={{fontSize:10.5,color:'var(--text-muted)',letterSpacing:'.06em',textTransform:'uppercase'}}>{r.label}</div>
                <div style={{fontSize:12.5,color:'var(--text-primary)',marginTop:2,wordBreak:'break-all'}}>{r.val}</div>
              </div>
            ))}
          </div>
          <hr className="divider"/>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--text-muted)',marginBottom:6}}><span>Attendance Rate</span><span style={{color:'var(--text-primary)',fontWeight:600}}>{emp.rate}%</span></div>
            <div style={{height:5,borderRadius:99,background:'var(--border)'}}><div style={{height:'100%',borderRadius:99,width:`${emp.rate}%`,background:emp.rate>92?'#4ade80':emp.rate>85?'var(--gold)':'#f87171'}}/></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LEAVE MANAGEMENT ──────────────────────────────────────
function LeavesScreen() {
  const [requests, setRequests] = uState(LEAVE_REQUESTS);
  const [modal, setModal]       = uState(null);
  const [filter, setFilter]     = uState('All');

  const filtered = filter==='All'?requests:requests.filter(r=>r.status===filter.toLowerCase());

  function updateStatus(id, status) {
    setRequests(rs=>rs.map(r=>r.id===id?{...r,status}:r));
    setModal(null);
  }

  const counts = {all:requests.length,pending:requests.filter(r=>r.status==='pending').length,approved:requests.filter(r=>r.status==='approved').length,rejected:requests.filter(r=>r.status==='rejected').length};

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div className="fade-up" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:700,color:'var(--text-primary)'}}>Leave Management</div>
          <div style={{fontSize:13,color:'var(--text-muted)',marginTop:3}}>Staff leave requests · Umeed Education System</div>
        </div>
        <button className="btn btn-primary"><Icon.Plus/>New Request</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}} className="fade-up fade-up-1">
        {[{label:'Total',val:counts.all,color:'var(--text-primary)'},{label:'Pending',val:counts.pending,color:'#fbbf24'},{label:'Approved',val:counts.approved,color:'#4ade80'},{label:'Rejected',val:counts.rejected,color:'#f87171'}].map(c=>(
          <div key={c.label} className="glass" style={{borderRadius:'var(--radius-md)',padding:'16px 18px',cursor:'pointer',transition:'all .22s'}} onClick={()=>setFilter(c.label==='Total'?'All':c.label)}>
            <div style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:700,color:c.color}}>{c.val}</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap glass fade-up fade-up-2">
        <div style={{padding:'18px 20px 0'}}>
          <SectionHeader title="Leave Requests" sub={`${filtered.length} records`}>
            <Tabs options={['All','Pending','Approved','Rejected']} value={filter} onChange={setFilter}/>
          </SectionHeader>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="data-table">
            <thead><tr><th>ID</th><th>Staff Member</th><th className="hide-mobile">Type</th><th className="hide-mobile">Duration</th><th className="hide-mobile">Days</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((r,i)=>(
                <tr key={i}>
                  <td style={{fontFamily:'monospace',fontSize:12,color:'var(--text-muted)'}}>{r.id}</td>
                  <td><div className="td-primary">{r.name}</div><div style={{fontSize:11,color:'var(--text-muted)'}}>{r.dept}</div></td>
                  <td className="hide-mobile">{r.type}</td>
                  <td className="hide-mobile" style={{fontSize:12,fontVariantNumeric:'tabular-nums'}}>{r.from} → {r.to}</td>
                  <td className="hide-mobile">{r.days}d</td>
                  <td><Badge status={r.status}/></td>
                  <td><div style={{display:'flex',gap:5}}>
                    <button className="btn-icon" style={{width:28,height:28}} onClick={()=>setModal(r)}><Icon.Eye/></button>
                    {r.status==='pending'&&<>
                      <button className="btn-icon" style={{width:28,height:28,color:'#4ade80',borderColor:'rgba(74,222,128,.3)'}} onClick={()=>updateStatus(r.id,'approved')}><Icon.Check/></button>
                      <button className="btn-icon" style={{width:28,height:28,color:'#f87171',borderColor:'rgba(248,113,113,.3)'}} onClick={()=>updateStatus(r.id,'rejected')}><Icon.X/></button>
                    </>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal open={!!modal} onClose={()=>setModal(null)} title={`Leave Request · ${modal.id}`}
          footer={<>
            <button className="btn btn-ghost" onClick={()=>setModal(null)}>Close</button>
            {modal.status==='pending'&&<>
              <button className="btn btn-ghost" style={{color:'#f87171',borderColor:'rgba(248,113,113,.3)'}} onClick={()=>updateStatus(modal.id,'rejected')}>Reject</button>
              <button className="btn btn-primary" onClick={()=>updateStatus(modal.id,'approved')}>Approve</button>
            </>}
          </>}>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {[['Employee',modal.name],['Department',modal.dept],['Leave Type',modal.type],['From',modal.from],['To',modal.to],['Days',`${modal.days} day(s)`],['Reason',modal.reason]].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:12,color:'var(--text-muted)'}}>{k}</span>
                <span style={{fontSize:13.5,color:'var(--text-primary)',fontWeight:500,textAlign:'right',maxWidth:'60%'}}>{v}</span>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0'}}>
              <span style={{fontSize:12,color:'var(--text-muted)'}}>Status</span>
              <Badge status={modal.status}/>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PlaceholderScreen({ title }) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',color:'var(--text-muted)',textAlign:'center'}}>
      <div style={{width:72,height:72,borderRadius:'var(--radius-lg)',background:'rgba(255,255,255,.03)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,color:'var(--text-muted)'}}><Icon.Grid/></div>
      <div style={{fontFamily:'var(--font-display)',fontSize:26,color:'var(--text-secondary)',marginBottom:8}}>{title}</div>
      <div style={{fontSize:13}}>Under construction — coming soon.</div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, ReportsScreen, StaffScreen, LeavesScreen, PlaceholderScreen, CameraAttendanceModal, ZKTecoCard });
