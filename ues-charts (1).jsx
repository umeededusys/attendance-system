// ── UES CHART COMPONENTS ─────────────────────────────────
// DonutChart, LineChart, BarChart

// ── DONUT CHART ───────────────────────────────────────────
function DonutChart({ data, size=200, thickness=32, title, subtitle }) {
  const R = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * R;
  const total = data.reduce((s,d)=>s+d.value,0);

  let offset = 0;
  const segments = data.map(d => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap  = circumference - dash;
    const seg  = { ...d, dash, gap, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
      <div style={{position:'relative',flexShrink:0}}>
        <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
          {segments.map((s,i)=>(
            <circle key={i} cx={cx} cy={cy} r={R}
              fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-s.offset}
              style={{transition:'stroke-dasharray 0.6s ease',opacity:0.92}}
            />
          ))}
        </svg>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,color:'var(--text-primary)',lineHeight:1}}>{title}</div>
          {subtitle && <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>{subtitle}</div>}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10,flex:1,minWidth:120}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
            <div style={{flex:1,fontSize:12.5,color:'var(--text-secondary)'}}>{d.label}</div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',fontVariantNumeric:'tabular-nums'}}>{d.value}</div>
            <div style={{fontSize:11,color:'var(--text-muted)',width:36,textAlign:'right'}}>
              {Math.round((d.value/data.reduce((s,x)=>s+x.value,0))*100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LINE CHART ────────────────────────────────────────────
function LineChart({ data, height=160, color='var(--maroon-bright)', gradientId, showDots=true }) {
  if (!data || data.length < 2) return null;
  const W = 100, H = height;
  const vals = data.map(d=>d.value);
  const min = Math.min(...vals) * 0.9;
  const max = Math.max(...vals) * 1.05;
  const gId = gradientId || 'lg1';

  const toX = i => (i / (data.length-1)) * W;
  const toY = v => H - ((v-min)/(max-min)) * (H * 0.82) - H*0.05;

  const points = data.map((d,i) => `${toX(i)},${toY(d.value)}`).join(' ');
  const areaPoints = [
    `0,${H}`,
    ...data.map((d,i)=>`${toX(i)},${toY(d.value)}`),
    `${W},${H}`
  ].join(' ');

  return (
    <div style={{width:'100%',position:'relative'}}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{width:'100%',height:H,overflow:'visible'}}>
        <defs>
          <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gId})`}/>
        <polyline points={points} fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        {showDots && data.map((d,i)=>(
          <circle key={i} cx={toX(i)} cy={toY(d.value)} r="1.2" fill={color}/>
        ))}
      </svg>
      {/* X labels */}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
        {data.map((d,i)=>(
          (i===0 || i===data.length-1 || i%Math.ceil(data.length/6)===0) &&
          <div key={i} style={{fontSize:9.5,color:'var(--text-muted)'}}>{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// ── MULTI LINE CHART ──────────────────────────────────────
function MultiLineChart({ series, labels, height=160 }) {
  if (!series || !series.length) return null;
  const allVals = series.flatMap(s=>s.values);
  const min = Math.min(...allVals) * 0.9;
  const max = Math.max(...allVals) * 1.08;
  const W = 100, H = height;
  const n = labels.length;

  const toX = i => (i/(n-1))*W;
  const toY = v => H - ((v-min)/(max-min))*(H*0.82) - H*0.05;

  return (
    <div style={{width:'100%'}}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{width:'100%',height:H,overflow:'visible'}}>
        <defs>
          {series.map((s,si)=>(
            <linearGradient key={si} id={`mlg${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
            </linearGradient>
          ))}
        </defs>
        {/* Grid lines */}
        {[0.25,0.5,0.75].map(t=>(
          <line key={t} x1="0" y1={H*t} x2={W} y2={H*t} stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5"/>
        ))}
        {series.map((s,si)=>{
          const pts = s.values.map((v,i)=>`${toX(i)},${toY(v)}`).join(' ');
          const area = [`0,${H}`,...s.values.map((v,i)=>`${toX(i)},${toY(v)}`),...[`${W},${H}`]].join(' ');
          return (
            <g key={si}>
              <polygon points={area} fill={`url(#mlg${si})`}/>
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
              {s.values.map((v,i)=>(
                <circle key={i} cx={toX(i)} cy={toY(v)} r="1.1" fill={s.color}/>
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
        {labels.map((l,i)=>(
          (i===0||i===labels.length-1||i%Math.ceil(labels.length/5)===0) &&
          <div key={i} style={{fontSize:9.5,color:'var(--text-muted)'}}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ── BAR CHART ─────────────────────────────────────────────
function BarChart({ data, height=150, maxVal }) {
  const max = maxVal || Math.max(...data.map(d=>d.present||d.value||0)) * 1.1;
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:6,height,overflowX:'auto',paddingBottom:4}}>
      {data.map((d,i)=>(
        <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flexShrink:0,minWidth:36}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:3,height:height-20}}>
            <div style={{
              width:28,borderRadius:'4px 4px 0 0',transformOrigin:'bottom',
              height:`${((d.present||d.value||0)/max)*(height-20)}px`,
              background:'linear-gradient(180deg,var(--maroon-bright) 0%,var(--maroon-deep) 100%)',
              animation:'barGrow 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              animationDelay:`${i*0.05}s`,
            }}/>
            {d.absent!==undefined && <div style={{
              width:14,borderRadius:'4px 4px 0 0',transformOrigin:'bottom',
              height:`${(d.absent/max)*(height-20)}px`,
              background:'linear-gradient(180deg,#f87171 0%,#b91c1c 100%)',
              animation:'barGrow 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              animationDelay:`${i*0.05+0.02}s`,
            }}/>}
          </div>
          <div style={{fontSize:10,color:'var(--text-muted)',textAlign:'center'}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { DonutChart, LineChart, MultiLineChart, BarChart });
