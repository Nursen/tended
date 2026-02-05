import './CozyBackground.css';

export function CozyBackground() {
  return (
    <div className="cozy-background">
      <svg
        className="background-svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Wall */}
        <rect x="0" y="0" width="1200" height="800" fill="#FFF8F0" />

        {/* Subtle wall texture */}
        <pattern id="wallTexture" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill="#FFF8F0" />
          <circle cx="20" cy="20" r="1" fill="#F5EDE0" opacity="0.5" />
        </pattern>
        <rect x="0" y="0" width="1200" height="800" fill="url(#wallTexture)" />

        {/* Window */}
        <g className="window">
          {/* Window frame */}
          <rect x="800" y="80" width="300" height="350" rx="8" fill="#FEF6E9" stroke="#C4956B" strokeWidth="12" />
          {/* Window panes */}
          <line x1="950" y1="80" x2="950" y2="430" stroke="#C4956B" strokeWidth="6" />
          <line x1="800" y1="255" x2="1100" y2="255" stroke="#C4956B" strokeWidth="6" />

          {/* Sky gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8D5E2" />
              <stop offset="100%" stopColor="#D4E8EE" />
            </linearGradient>
          </defs>
          <rect x="812" y="92" width="126" height="151" fill="url(#skyGradient)" />
          <rect x="962" y="92" width="126" height="151" fill="url(#skyGradient)" />
          <rect x="812" y="267" width="126" height="151" fill="url(#skyGradient)" />
          <rect x="962" y="267" width="126" height="151" fill="url(#skyGradient)" />

          {/* Clouds */}
          <g className="clouds">
            <g className="cloud cloud-1">
              <ellipse cx="860" cy="140" rx="30" ry="18" fill="white" opacity="0.9" />
              <ellipse cx="885" cy="135" rx="25" ry="15" fill="white" opacity="0.9" />
              <ellipse cx="875" cy="148" rx="20" ry="12" fill="white" opacity="0.9" />
            </g>
            <g className="cloud cloud-2">
              <ellipse cx="1020" cy="180" rx="25" ry="15" fill="white" opacity="0.85" />
              <ellipse cx="1040" cy="175" rx="20" ry="12" fill="white" opacity="0.85" />
              <ellipse cx="1030" cy="185" rx="18" ry="10" fill="white" opacity="0.85" />
            </g>
            <g className="cloud cloud-3">
              <ellipse cx="900" cy="320" rx="22" ry="13" fill="white" opacity="0.8" />
              <ellipse cx="920" cy="315" rx="18" ry="11" fill="white" opacity="0.8" />
            </g>
          </g>

          {/* Sun rays */}
          <circle cx="1050" cy="120" r="25" fill="#FFE17B" opacity="0.3" />
          <circle cx="1050" cy="120" r="15" fill="#FFE17B" opacity="0.5" />

          {/* Window sill */}
          <rect x="785" y="430" width="330" height="20" rx="4" fill="#C4956B" />
          <rect x="790" y="425" width="320" height="8" fill="#D4A574" />

          {/* Small plant on windowsill */}
          <g transform="translate(920, 380)">
            <ellipse cx="30" cy="48" rx="18" ry="4" fill="#2C3E2A" opacity="0.1" />
            <path d="M20,30 L22,48 L38,48 L40,30 Q40,25 30,25 Q20,25 20,30 Z" fill="#D4896A" stroke="#2C3E2A" strokeWidth="1" />
            <path d="M30,25 Q25,15 22,5 Q28,8 30,5 Q32,8 38,5 Q35,15 30,25" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="0.8" />
          </g>
        </g>

        {/* Wooden shelves */}
        <g className="shelves">
          {/* Top shelf */}
          <rect x="80" y="200" width="600" height="14" rx="2" fill="#C4956B" />
          <rect x="80" y="196" width="600" height="6" fill="#D4A574" />
          {/* Shelf shadow */}
          <rect x="80" y="214" width="600" height="8" fill="#2C3E2A" opacity="0.05" />

          {/* Shelf brackets */}
          <path d="M100,214 L100,250 L120,250" stroke="#A67B52" strokeWidth="4" fill="none" />
          <path d="M660,214 L660,250 L640,250" stroke="#A67B52" strokeWidth="4" fill="none" />
          <path d="M380,214 L380,250 L400,250" stroke="#A67B52" strokeWidth="4" fill="none" />

          {/* Middle shelf */}
          <rect x="120" y="400" width="550" height="14" rx="2" fill="#C4956B" />
          <rect x="120" y="396" width="550" height="6" fill="#D4A574" />
          <rect x="120" y="414" width="550" height="8" fill="#2C3E2A" opacity="0.05" />

          <path d="M140,414 L140,450 L160,450" stroke="#A67B52" strokeWidth="4" fill="none" />
          <path d="M650,414 L650,450 L630,450" stroke="#A67B52" strokeWidth="4" fill="none" />

          {/* Bottom shelf (table/counter level) */}
          <rect x="60" y="600" width="700" height="18" rx="3" fill="#C4956B" />
          <rect x="60" y="594" width="700" height="8" fill="#D4A574" />
          <rect x="60" y="618" width="700" height="12" fill="#2C3E2A" opacity="0.06" />
        </g>

        {/* Decorative elements */}
        <g className="decor">
          {/* Hanging plant hook on ceiling */}
          <path d="M250,0 L250,30 Q250,45 235,50" stroke="#8B7355" strokeWidth="3" fill="none" />

          {/* Picture frame on wall */}
          <rect x="500" y="280" width="80" height="100" rx="4" fill="none" stroke="#C4956B" strokeWidth="6" />
          <rect x="510" y="290" width="60" height="80" fill="#FEF6E9" />
          <path d="M520,340 Q540,320 560,340 L560,360 L520,360 Z" fill="#7CAA6D" opacity="0.3" />
          <circle cx="550" cy="310" r="8" fill="#FFE17B" opacity="0.4" />

          {/* Small wall hook */}
          <circle cx="150" y="320" r="6" fill="#A67B52" />
        </g>

        {/* Floor hint at bottom */}
        <rect x="0" y="750" width="1200" height="50" fill="#E8DDD0" />
        <line x1="0" y1="750" x2="1200" y2="750" stroke="#D4C4B0" strokeWidth="2" />
      </svg>
    </div>
  );
}
