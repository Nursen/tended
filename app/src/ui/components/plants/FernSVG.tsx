import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function FernSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="58" ry="7" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - classic terracotta */}
      <g className="pot-body">
        <path
          d="M60,160 Q58,155 62,150 L138,150 Q142,155 140,160 L132,235 Q130,245 120,248 L80,248 Q70,245 68,235 Z"
          fill="#D4896A"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <rect x="55" y="145" width="90" height="10" rx="3" fill="#D4896A" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M70,165 Q68,160 75,157" stroke="white" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />
      </g>

      {/* Face */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="85" cy="195" r="4" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M79,195 Q85,189 91,195" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="115" cy="195" r="4" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M109,195 Q115,189 121,195" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M93,210 Q100,218 107,210" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M95,212 L105,212" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M93,215 Q100,209 107,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M96,212 Q100,215 104,212 Q100,209 96,212" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="77" cy="203" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />
        <ellipse cx="123" cy="203" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />

        <text x="128" y="180" fontSize="12" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="138,168 140,163 142,168 147,170 142,172 140,177 138,172 133,170" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Fern fronds - delicate feathery leaves */}
      <g className="foliage">
        {/* Center frond */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '100px 145px' }}>
          <path d="M100,145 L100,50" stroke="#4A8C5C" strokeWidth="2" fill="none" />
          {/* Leaflets */}
          <path d="M100,130 Q90,125 85,130" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,130 Q110,125 115,130" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,115 Q88,108 82,115" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,115 Q112,108 118,115" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,100 Q86,92 78,100" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,100 Q114,92 122,100" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,85 Q88,78 82,85" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,85 Q112,78 118,85" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,70 Q92,65 88,70" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,70 Q108,65 112,70" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
          <path d="M100,58 Q95,55 92,58" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
          <path d="M100,58 Q105,55 108,58" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
        </g>

        {/* Left frond */}
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '90px 145px' }}>
          <path d="M90,145 Q70,100 55,60" stroke="#4A8C5C" strokeWidth="2" fill="none" />
          <path d="M82,125 Q72,122 68,128" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M75,108 Q65,102 60,110" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M68,90 Q58,85 52,92" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M62,75 Q54,70 50,76" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
        </g>

        {/* Right frond */}
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '110px 145px' }}>
          <path d="M110,145 Q130,100 145,60" stroke="#4A8C5C" strokeWidth="2" fill="none" />
          <path d="M118,125 Q128,122 132,128" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M125,108 Q135,102 140,110" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M132,90 Q142,85 148,92" stroke="#8BB87A" strokeWidth="1.5" fill="none" />
          <path d="M138,75 Q146,70 150,76" stroke="#7CAA6D" strokeWidth="1.5" fill="none" />
        </g>

        {/* Smaller side fronds */}
        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '80px 145px' }}>
          <path d="M80,145 Q55,120 40,95" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
          <path d="M68,125 Q60,122 56,127" stroke="#7CAA6D" strokeWidth="1" fill="none" />
          <path d="M55,108 Q48,105 45,110" stroke="#7CAA6D" strokeWidth="1" fill="none" />
        </g>

        <g className={animate ? 'leaf sway-5' : 'leaf'} style={{ transformOrigin: '120px 145px' }}>
          <path d="M120,145 Q145,120 160,95" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
          <path d="M132,125 Q140,122 144,127" stroke="#7CAA6D" strokeWidth="1" fill="none" />
          <path d="M145,108 Q152,105 155,110" stroke="#7CAA6D" strokeWidth="1" fill="none" />
        </g>
      </g>
    </svg>
  );
}
