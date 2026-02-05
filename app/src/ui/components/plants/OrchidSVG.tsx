import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function OrchidSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="55" ry="7" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - elegant tall pot */}
      <g className="pot-body">
        <path
          d="M70,165 L72,240 Q74,248 85,250 L115,250 Q126,248 128,240 L130,165 Q130,158 120,155 L80,155 Q70,158 70,165 Z"
          fill="#B8A8D9"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <ellipse cx="100" cy="155" rx="30" ry="8" fill="#B8A8D9" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M78,170 Q76,165 82,162" stroke="white" strokeWidth="3" fill="none" opacity="0.2" strokeLinecap="round" />
      </g>

      {/* Face */}
      <g className="face">
        {/* Eyes */}
        <g className="eye-left">
          <circle className="eye-open" cx="88" cy="200" r="4" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M82,200 Q88,194 94,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="112" cy="200" r="4" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M106,200 Q112,194 118,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        {/* Mouths */}
        <g className="mouth">
          <path d="M93,215 Q100,223 107,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M95,217 L105,217" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M93,220 Q100,214 107,220" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M96,217 Q100,220 104,217 Q100,214 96,217" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        {/* Blush */}
        <ellipse cx="80" cy="208" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />
        <ellipse cx="120" cy="208" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />

        {/* Extras */}
        <text x="125" y="185" fontSize="12" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="135,170 137,165 139,170 144,172 139,174 137,179 135,174 130,172" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Orchid stem and flowers */}
      <g className="foliage">
        {/* Main arching stem */}
        <path d="M100,155 Q95,130 90,110 Q85,90 95,70 Q105,50 120,45" stroke="#4A8C5C" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Support stake */}
        <line x1="102" y1="155" x2="110" y2="60" stroke="#8B7355" strokeWidth="2" />

        {/* Orchid flowers - elegant petals */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '120px 45px' }}>
          <ellipse cx="120" cy="40" rx="12" ry="8" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="120" cy="50" rx="12" ry="8" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="110" cy="45" rx="8" ry="12" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="130" cy="45" rx="8" ry="12" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="120" cy="45" rx="6" ry="4" fill="#D4896A" />
          <circle cx="120" cy="45" r="2" fill="#FFE17B" />
        </g>

        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '95px 70px' }}>
          <ellipse cx="88" cy="65" rx="10" ry="7" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="88" cy="75" rx="10" ry="7" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="80" cy="70" rx="7" ry="10" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="96" cy="70" rx="7" ry="10" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="88" cy="70" rx="5" ry="3" fill="#D4896A" />
          <circle cx="88" cy="70" r="1.5" fill="#FFE17B" />
        </g>

        {/* Bud */}
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '108px 55px' }}>
          <ellipse cx="108" cy="55" rx="5" ry="7" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" opacity="0.8" />
        </g>

        {/* Leaves at base */}
        <path d="M85,155 Q70,145 65,130 Q68,128 75,135 Q72,125 80,128 Q83,140 85,150" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1.5" />
        <path d="M115,155 Q130,145 135,130 Q132,128 125,135 Q128,125 120,128 Q117,140 115,150" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
