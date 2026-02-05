import './CozyBackground.css';

export function CozyBackground() {
  return (
    <div className="cozy-background">
      <svg
        className="background-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Warm wall gradient */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9F3" />
            <stop offset="100%" stopColor="#FDF5EC" />
          </linearGradient>

          {/* Sky gradient for window */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C5E4F3" />
            <stop offset="60%" stopColor="#E8F4F8" />
            <stop offset="100%" stopColor="#FFF9F3" />
          </linearGradient>

          {/* Sunlight glow - from right edge */}
          <radialGradient id="sunGlow" cx="95%" cy="20%" r="45%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FFF8E7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFF8E7" stopOpacity="0" />
          </radialGradient>

          {/* Soft shadow for depth */}
          <linearGradient id="floorShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8DFD4" stopOpacity="0" />
            <stop offset="100%" stopColor="#E8DFD4" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Base wall */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#wallGradient)" />

        {/* Sunlight overlay */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#sunGlow)" />

        {/* Window - positioned far right edge */}
        <g className="window" opacity="0.95">
          {/* Window recess shadow */}
          <rect x="1340" y="80" width="280" height="320" rx="12" fill="#E8DFD4" opacity="0.3" />

          {/* Window frame outer */}
          <rect x="1350" y="70" width="260" height="300" rx="10" fill="#E8DDD0" />

          {/* Sky view */}
          <rect x="1362" y="82" width="236" height="276" rx="6" fill="url(#skyGradient)" />

          {/* Window frame divisions */}
          <rect x="1476" y="82" width="6" height="276" fill="#DDD5C8" />
          <rect x="1362" y="216" width="236" height="6" fill="#DDD5C8" />

          {/* Window frame inner border */}
          <rect x="1362" y="82" width="236" height="276" rx="6" fill="none" stroke="#CFC5B8" strokeWidth="3" />

          {/* Clouds */}
          <g className="clouds">
            <g className="cloud cloud-1">
              <ellipse cx="1410" cy="120" rx="30" ry="15" fill="white" opacity="0.85" />
              <ellipse cx="1435" cy="115" rx="24" ry="12" fill="white" opacity="0.85" />
              <ellipse cx="1420" cy="128" rx="18" ry="10" fill="white" opacity="0.85" />
            </g>
            <g className="cloud cloud-2">
              <ellipse cx="1530" cy="150" rx="24" ry="12" fill="white" opacity="0.8" />
              <ellipse cx="1550" cy="145" rx="18" ry="10" fill="white" opacity="0.8" />
              <ellipse cx="1540" cy="155" rx="15" ry="8" fill="white" opacity="0.8" />
            </g>
            <g className="cloud cloud-3">
              <ellipse cx="1450" cy="280" rx="20" ry="10" fill="white" opacity="0.7" />
              <ellipse cx="1468" cy="276" rx="16" ry="8" fill="white" opacity="0.7" />
            </g>
          </g>

          {/* Window sill */}
          <rect x="1335" y="370" width="290" height="16" rx="3" fill="#DDD5C8" />
          <rect x="1340" y="365" width="280" height="7" fill="#E8E0D5" />

          {/* Small succulent on windowsill */}
          <g transform="translate(1450, 340)">
            <ellipse cx="16" cy="28" rx="10" ry="3" fill="#2C3E2A" opacity="0.08" />
            <path d="M9,19 L11,28 L21,28 L23,19 Q23,15 16,15 Q9,15 9,19 Z" fill="#D4896A" opacity="0.7" />
            <ellipse cx="16" cy="13" rx="5" ry="3" fill="#7CAA6D" opacity="0.8" />
            <ellipse cx="12" cy="11" rx="3" ry="2.5" fill="#8BB87A" opacity="0.8" />
            <ellipse cx="20" cy="11" rx="3" ry="2.5" fill="#8BB87A" opacity="0.8" />
          </g>
        </g>

        {/* Subtle hanging plant - far left edge */}
        <g className="hanging-plant" opacity="0.6">
          <line x1="60" y1="0" x2="60" y2="100" stroke="#A69080" strokeWidth="2" />
          <ellipse cx="60" cy="115" rx="28" ry="16" fill="#C4956B" opacity="0.6" />
          {/* Trailing vines */}
          <path d="M42,115 Q25,160 30,210 Q20,260 25,320" stroke="#7CAA6D" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M60,120 Q55,170 60,230 Q50,290 55,360" stroke="#7CAA6D" strokeWidth="2.5" fill="none" opacity="0.6" />
          <path d="M78,115 Q95,165 90,220 Q100,280 95,350" stroke="#8BB87A" strokeWidth="2.5" fill="none" opacity="0.7" />
          {/* Small leaves */}
          <circle cx="30" cy="210" r="5" fill="#7CAA6D" opacity="0.7" />
          <circle cx="25" cy="320" r="4" fill="#8BB87A" opacity="0.6" />
          <circle cx="60" cy="230" r="5" fill="#7CAA6D" opacity="0.6" />
          <circle cx="55" cy="360" r="4" fill="#8BB87A" opacity="0.5" />
          <circle cx="90" cy="220" r="5" fill="#7CAA6D" opacity="0.7" />
          <circle cx="95" cy="350" r="4" fill="#8BB87A" opacity="0.6" />
        </g>

        {/* Floating dust particles in sunlight - right side where window is */}
        <g className="particles">
          <circle className="particle p1" cx="1420" cy="180" r="2" fill="#FFE8B8" opacity="0.7" />
          <circle className="particle p2" cx="1500" cy="250" r="1.5" fill="#FFE8B8" opacity="0.6" />
          <circle className="particle p3" cx="1550" cy="150" r="1.8" fill="#FFE8B8" opacity="0.5" />
          <circle className="particle p4" cx="1380" cy="320" r="1.5" fill="#FFE8B8" opacity="0.6" />
          <circle className="particle p5" cx="1480" cy="220" r="1.8" fill="#FFE8B8" opacity="0.7" />
          <circle className="particle p6" cx="1450" cy="380" r="1.5" fill="#FFE8B8" opacity="0.5" />
          <circle className="particle p7" cx="1520" cy="300" r="1.2" fill="#FFE8B8" opacity="0.6" />
          <circle className="particle p8" cx="1400" cy="450" r="1.8" fill="#FFE8B8" opacity="0.5" />
        </g>

        {/* Floor/baseboard hint */}
        <rect x="0" y="850" width="1600" height="50" fill="url(#floorShadow)" />
        <rect x="0" y="860" width="1600" height="40" fill="#F5EDE3" opacity="0.5" />
      </svg>
    </div>
  );
}
