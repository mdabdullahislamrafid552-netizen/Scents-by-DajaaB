'use client';
import { useId } from 'react';
import { BottleShape, CapColor } from '@/data/products';

interface BottleProps {
  shape?: BottleShape;
  liquid?: string;
  cap?: CapColor;
  label?: string;
  brand?: string;
  ink?: boolean;
  silk?: boolean;
  cropY?: number;
}

export default function Bottle({
  shape = 'flacon', liquid = '#8B5E2A', cap = 'gold',
  label = 'S', brand = '', ink = false, silk = true, cropY = 0,
}: BottleProps) {
  const rawId = useId().replace(/:/g, '');
  const id = rawId;
  const capFill = cap === 'black' ? '#1a1814' : cap === 'silver' ? '#b8b3a4' : '#C9A961';
  const capDark  = cap === 'black' ? '#000'    : cap === 'silver' ? '#7a7568' : '#8A6F2C';

  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid meet"
         style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id={`bg-${id}`} cx="70%" cy="30%" r="80%">
          {ink ? (<>
            <stop offset="0%" stopColor="#3a3528" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#1c1a14"/>
            <stop offset="100%" stopColor="#0c0b08"/>
          </>) : (<>
            <stop offset="0%" stopColor="#FBF4DD"/>
            <stop offset="55%" stopColor="#F2E8CE"/>
            <stop offset="100%" stopColor="#E0D2A8"/>
          </>)}
        </radialGradient>
        <linearGradient id={`light-${id}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor="#fff1c2" stopOpacity={ink ? 0.55 : 0.6}/>
          <stop offset="45%" stopColor="#dcb86a" stopOpacity={ink ? 0.25 : 0.25}/>
          <stop offset="100%" stopColor="#7a5a20" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id={`liq-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"  stopColor={liquid} stopOpacity="0.55"/>
          <stop offset="40%" stopColor={liquid} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={liquid} stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="#fff" stopOpacity="0.35"/>
          <stop offset="30%" stopColor="#fff" stopOpacity="0"/>
          <stop offset="70%" stopColor="#fff" stopOpacity="0"/>
          <stop offset="100%" stopColor="#fff" stopOpacity="0.55"/>
        </linearGradient>
        <linearGradient id={`cap-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"  stopColor="#f3dca4"/>
          <stop offset="50%" stopColor={capFill}/>
          <stop offset="100%" stopColor={capDark}/>
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity={ink ? 0.7 : 0.25}/>
          <stop offset="100%" stopColor="#000" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="400" height="520" fill={`url(#bg-${id})`}/>
      {silk && (<>
        <g opacity={ink ? 0.18 : 0.22}>
          <path d="M0,400 Q120,360 200,420 T400,400 L400,520 L0,520 Z" fill={ink ? '#2a2418' : '#dcc99b'}/>
          <path d="M0,440 Q140,410 240,460 T400,440 L400,520 L0,520 Z" fill={ink ? '#1c1810' : '#c8b079'} opacity="0.7"/>
        </g>
        <path d="M280,30 Q360,80 380,180 Q360,260 320,340 Q280,420 360,500"
              stroke={ink ? '#dcb86a' : '#e9d29a'} strokeOpacity="0.18" strokeWidth="60"
              fill="none" strokeLinecap="round"/>
      </>)}

      <ellipse cx="200" cy="455" rx="120" ry="14" fill={`url(#shadow-${id})`}/>

      <g transform={`translate(0, ${cropY})`}>
        {renderShape(shape, id, capFill, liquid, label)}
      </g>

      <rect width="400" height="520" fill={`url(#light-${id})`} pointerEvents="none"/>

      {brand && (
        <text x="200" y="495" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9"
              letterSpacing="3" fill={ink ? '#a89770' : '#897547'} opacity="0.8"
              style={{ textTransform: 'uppercase' }}>{brand}</text>
      )}
    </svg>
  );
}

function renderShape(shape: BottleShape, id: string, capFill: string, liquid: string, label: string) {
  const capStroke = '#8A6F2C';
  switch (shape) {
    case 'rounded':
      return (
        <g>
          <rect x="110" y="160" width="180" height="240" rx="14" fill="#1a1814" fillOpacity="0.08" stroke="#3a3528" strokeOpacity="0.35"/>
          <rect x="118" y="200" width="164" height="194" rx="10" fill={`url(#liq-${id})`}/>
          <rect x="110" y="160" width="180" height="240" rx="14" fill={`url(#glass-${id})`}/>
          <rect x="150" y="260" width="100" height="60" fill="#f6efdb" fillOpacity="0.92"/>
          <text x="200" y="290" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="22" fill="#1a1814" fontWeight="500">{label}</text>
          <line x1="170" y1="302" x2="230" y2="302" stroke="#C9A961" strokeWidth="0.6"/>
          <rect x="148" y="118" width="104" height="44" rx="3" fill={`url(#cap-${id})`} stroke={capStroke} strokeWidth="0.5"/>
          <rect x="148" y="118" width="104" height="6" fill="#fff" fillOpacity="0.3"/>
          <rect x="170" y="156" width="60" height="10" fill="#2a261c"/>
        </g>
      );
    case 'column':
      return (
        <g>
          <rect x="155" y="140" width="90" height="280" fill="#1a1814" fillOpacity="0.06" stroke="#3a3528" strokeOpacity="0.3"/>
          <rect x="160" y="180" width="80" height="236" fill={`url(#liq-${id})`}/>
          <rect x="155" y="140" width="90" height="280" fill={`url(#glass-${id})`}/>
          <rect x="167" y="240" width="66" height="80" fill="#f6efdb" fillOpacity="0.94"/>
          <text x="200" y="278" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#1a1814" fontWeight="500">{label}</text>
          <line x1="178" y1="290" x2="222" y2="290" stroke="#C9A961" strokeWidth="0.6"/>
          <text x="200" y="306" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.4" fill="#1a1814" opacity="0.6">EAU DE PARFUM</text>
          <rect x="185" y="125" width="30" height="18" fill="#2a261c"/>
          <rect x="172" y="92" width="56" height="38" rx="2" fill={`url(#cap-${id})`} stroke={capStroke} strokeWidth="0.5"/>
          <rect x="172" y="92" width="56" height="5" fill="#fff" fillOpacity="0.3"/>
        </g>
      );
    case 'orb':
      return (
        <g>
          <ellipse cx="200" cy="290" rx="100" ry="115" fill="#1a1814" fillOpacity="0.05" stroke="#3a3528" strokeOpacity="0.3"/>
          <defs>
            <clipPath id={`orbclip-${id}`}>
              <ellipse cx="200" cy="290" rx="98" ry="113"/>
            </clipPath>
          </defs>
          <rect x="100" y="220" width="200" height="190" clipPath={`url(#orbclip-${id})`} fill={`url(#liq-${id})`}/>
          <ellipse cx="200" cy="290" rx="100" ry="115" fill={`url(#glass-${id})`}/>
          <rect x="156" y="275" width="88" height="44" fill="#f6efdb" fillOpacity="0.94" stroke="#C9A961" strokeWidth="0.4"/>
          <text x="200" y="298" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="18" fill="#1a1814" fontWeight="500">{label}</text>
          <line x1="170" y1="306" x2="230" y2="306" stroke="#C9A961" strokeWidth="0.5"/>
          <rect x="185" y="170" width="30" height="16" fill="#2a261c"/>
          <path d="M170,135 L230,135 L226,172 L174,172 Z" fill={`url(#cap-${id})`} stroke={capStroke} strokeWidth="0.5"/>
          <path d="M170,135 L230,135 L228,142 L172,142 Z" fill="#fff" fillOpacity="0.3"/>
        </g>
      );
    case 'flacon':
    default:
      return (
        <g>
          <path d="M130,170 L130,400 Q130,420 150,420 L250,420 Q270,420 270,400 L270,170 Q270,160 260,160 L140,160 Q130,160 130,170 Z" fill="#1a1814" fillOpacity="0.05" stroke="#3a3528" strokeOpacity="0.3"/>
          <path d="M134,200 L134,398 Q134,416 150,416 L250,416 Q266,416 266,398 L266,200 Z" fill={`url(#liq-${id})`}/>
          <path d="M130,170 L130,400 Q130,420 150,420 L250,420 Q270,420 270,400 L270,170 Q270,160 260,160 L140,160 Q130,160 130,170 Z" fill={`url(#glass-${id})`}/>
          <rect x="148" y="248" width="104" height="100" fill="#f6efdb" fillOpacity="0.95"/>
          <line x1="166" y1="270" x2="234" y2="270" stroke="#C9A961" strokeWidth="0.5"/>
          <text x="200" y="304" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="24" fill="#1a1814" fontWeight="500">{label}</text>
          <line x1="166" y1="320" x2="234" y2="320" stroke="#C9A961" strokeWidth="0.5"/>
          <text x="200" y="338" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.6" fill="#1a1814" opacity="0.6">PARFUM · MEMPHIS</text>
          <rect x="180" y="146" width="40" height="18" fill="#2a261c"/>
          <rect x="160" y="100" width="80" height="50" rx="2" fill={`url(#cap-${id})`} stroke={capStroke} strokeWidth="0.5"/>
          <rect x="160" y="100" width="80" height="6" fill="#fff" fillOpacity="0.35"/>
        </g>
      );
  }
}
