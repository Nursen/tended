import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function SucculentSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="45" ry="5" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - small round pot */}
      <g className="pot-body">
        <path
          d="M65,175 Q60,180 62,195 L68,240 Q72,252 88,255 L112,255 Q128,252 132,240 L138,195 Q140,180 135,175 Z"
          fill="#F7A8B8"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <ellipse cx="100" cy="175" rx="37" ry="10" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M72,185 Q68,180 76,175" stroke="white" strokeWidth="3" fill="none" opacity="0.2" strokeLinecap="round" />
      </g>

      {/* Face */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="85" cy="210" r="4" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M79,210 Q85,204 91,210" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="115" cy="210" r="4" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M109,210 Q115,204 121,210" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M93,225 Q100,233 107,225" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M95,227 L105,227" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M93,230 Q100,224 107,230" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M96,227 Q100,230 104,227 Q100,224 96,227" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="77" cy="218" rx="6" ry="4" fill="#F7A8B8" opacity="0.5" />
        <ellipse cx="123" cy="218" rx="6" ry="4" fill="#F7A8B8" opacity="0.5" />

        <text x="128" y="195" fontSize="12" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="140,188 142,183 144,188 149,190 144,192 142,197 140,192 135,190" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Succulent rosette */}
      <g className="foliage">
        {/* Outer petals */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '100px 140px' }}>
          <ellipse cx="60" cy="145" rx="25" ry="12" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(-30 60 145)" />
        </g>
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '100px 140px' }}>
          <ellipse cx="140" cy="145" rx="25" ry="12" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(30 140 145)" />
        </g>
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '100px 140px' }}>
          <ellipse cx="55" cy="125" rx="22" ry="11" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(-50 55 125)" />
        </g>
        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '100px 140px' }}>
          <ellipse cx="145" cy="125" rx="22" ry="11" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(50 145 125)" />
        </g>

        {/* Middle layer */}
        <ellipse cx="70" cy="115" rx="20" ry="10" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(-15 70 115)" />
        <ellipse cx="130" cy="115" rx="20" ry="10" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(15 130 115)" />
        <ellipse cx="100" cy="155" rx="22" ry="10" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1.5" />

        {/* Inner layer */}
        <ellipse cx="80" cy="105" rx="16" ry="8" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(-25 80 105)" />
        <ellipse cx="120" cy="105" rx="16" ry="8" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(25 120 105)" />
        <ellipse cx="100" cy="130" rx="18" ry="8" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" />

        {/* Center bud */}
        <ellipse cx="90" cy="100" rx="12" ry="6" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1" transform="rotate(-10 90 100)" />
        <ellipse cx="110" cy="100" rx="12" ry="6" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1" transform="rotate(10 110 100)" />
        <ellipse cx="100" cy="110" rx="14" ry="6" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1" />

        {/* Center */}
        <ellipse cx="100" cy="95" rx="8" ry="5" fill="#A8D5E2" stroke="#2C3E2A" strokeWidth="1" opacity="0.6" />
      </g>
    </svg>
  );
}
