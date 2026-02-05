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

          {/* Sunlight glow */}
          <radialGradient id="sunGlow" cx="80%" cy="15%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.2" />
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

        {/* Window - positioned top right */}
        <g className="window" opacity="0.9">
          {/* Window recess shadow */}
          <rect x="1140" y="50" width="340" height="380" rx="12" fill="#E8DFD4" opacity="0.3" />

          {/* Window frame outer */}
          <rect x="1150" y="40" width="320" height="360" rx="10" fill="#E8DDD0" />

          {/* Sky view */}
          <rect x="1165" y="55" width="290" height="330" rx="6" fill="url(#skyGradient)" />

          {/* Window frame divisions */}
          <rect x="1305" y="55" width="8" height="330" fill="#DDD5C8" />
          <rect x="1165" y="215" width="290" height="8" fill="#DDD5C8" />

          {/* Window frame inner border */}
          <rect x="1165" y="55" width="290" height="330" rx="6" fill="none" stroke="#CFC5B8" strokeWidth="3" />

          {/* Clouds */}
          <g className="clouds">
            <g className="cloud cloud-1">
              <ellipse cx="1220" cy="100" rx="35" ry="18" fill="white" opacity="0.85" />
              <ellipse cx="1250" cy="95" rx="28" ry="15" fill="white" opacity="0.85" />
              <ellipse cx="1235" cy="108" rx="22" ry="12" fill="white" opacity="0.85" />
            </g>
            <g className="cloud cloud-2">
              <ellipse cx="1380" cy="140" rx="28" ry="14" fill="white" opacity="0.8" />
              <ellipse cx="1405" cy="135" rx="22" ry="12" fill="white" opacity="0.8" />
              <ellipse cx="1392" cy="145" rx="18" ry="10" fill="white" opacity="0.8" />
            </g>
            <g className="cloud cloud-3">
              <ellipse cx="1280" cy="280" rx="25" ry="12" fill="white" opacity="0.7" />
              <ellipse cx="1302" cy="276" rx="20" ry="10" fill="white" opacity="0.7" />
            </g>
          </g>

          {/* Window sill */}
          <rect x="1135" y="400" width="350" height="18" rx="3" fill="#DDD5C8" />
          <rect x="1140" y="395" width="340" height="8" fill="#E8E0D5" />

          {/* Small succulent on windowsill */}
          <g transform="translate(1280, 365)">
            <ellipse cx="20" cy="32" rx="12" ry="3" fill="#2C3E2A" opacity="0.08" />
            <path d="M12,22 L14,32 L26,32 L28,22 Q28,18 20,18 Q12,18 12,22 Z" fill="#D4896A" opacity="0.7" />
            <ellipse cx="20" cy="16" rx="6" ry="4" fill="#7CAA6D" opacity="0.8" />
            <ellipse cx="16" cy="14" rx="4" ry="3" fill="#8BB87A" opacity="0.8" />
            <ellipse cx="24" cy="14" rx="4" ry="3" fill="#8BB87A" opacity="0.8" />
          </g>
        </g>

        {/* Subtle hanging plant - left side */}
        <g className="hanging-plant" opacity="0.5">
          <line x1="180" y1="0" x2="180" y2="80" stroke="#A69080" strokeWidth="2" />
          <ellipse cx="180" cy="95" rx="25" ry="15" fill="#C4956B" opacity="0.6" />
          {/* Trailing vines */}
          <path d="M165,95 Q150,130 155,170 Q145,200 150,240" stroke="#7CAA6D" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M180,100 Q175,140 180,180 Q170,220 175,260" stroke="#7CAA6D" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M195,95 Q210,135 205,175 Q215,210 210,250" stroke="#8BB87A" strokeWidth="2" fill="none" opacity="0.7" />
          {/* Small leaves */}
          <circle cx="155" cy="170" r="4" fill="#7CAA6D" opacity="0.7" />
          <circle cx="150" cy="240" r="3" fill="#8BB87A" opacity="0.6" />
          <circle cx="180" cy="180" r="4" fill="#7CAA6D" opacity="0.6" />
          <circle cx="175" cy="260" r="3" fill="#8BB87A" opacity="0.5" />
          <circle cx="205" cy="175" r="4" fill="#7CAA6D" opacity="0.7" />
          <circle cx="210" cy="250" r="3" fill="#8BB87A" opacity="0.6" />
        </g>

        {/* Floating dust particles in sunlight */}
        <g className="particles">
          <circle className="particle p1" cx="1200" cy="150" r="1.5" fill="#FFE8B8" opacity="0.6" />
          <circle className="particle p2" cx="1280" cy="200" r="1" fill="#FFE8B8" opacity="0.5" />
          <circle className="particle p3" cx="1350" cy="120" r="1.2" fill="#FFE8B8" opacity="0.4" />
          <circle className="particle p4" cx="1180" cy="250" r="1" fill="#FFE8B8" opacity="0.5" />
          <circle className="particle p5" cx="1320" cy="180" r="1.3" fill="#FFE8B8" opacity="0.6" />
          <circle className="particle p6" cx="1250" cy="300" r="1" fill="#FFE8B8" opacity="0.4" />
        </g>

        {/* Floor/baseboard hint */}
        <rect x="0" y="850" width="1600" height="50" fill="url(#floorShadow)" />
        <rect x="0" y="860" width="1600" height="40" fill="#F5EDE3" opacity="0.5" />
      </svg>
    </div>
  );
}
