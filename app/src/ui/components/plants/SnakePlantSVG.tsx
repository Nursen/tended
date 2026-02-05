import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function SnakePlantSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="50" ry="6" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - modern cylinder */}
      <g className="pot-body">
        <rect x="65" y="155" width="70" height="95" rx="8" fill="#A8D5E2" stroke="#2C3E2A" strokeWidth="2" />
        <ellipse cx="100" cy="155" rx="35" ry="8" fill="#A8D5E2" stroke="#2C3E2A" strokeWidth="2" />
        <ellipse cx="100" cy="250" rx="35" ry="6" fill="#8BC5D5" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M72,165 L72,185" stroke="white" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />
      </g>

      {/* Face */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="85" cy="200" r="4" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M79,200 Q85,194 91,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="115" cy="200" r="4" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M109,200 Q115,194 121,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M93,215 Q100,223 107,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M95,217 L105,217" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M93,220 Q100,214 107,220" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M96,217 Q100,220 104,217 Q100,214 96,217" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="77" cy="208" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />
        <ellipse cx="123" cy="208" rx="6" ry="4" fill="#F7A8B8" opacity="0.4" />

        <text x="128" y="185" fontSize="12" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="135,172 137,167 139,172 144,174 139,176 137,181 135,176 130,174" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Snake plant leaves - tall pointed sword-like */}
      <g className="foliage">
        {/* Center tall leaf */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '100px 155px' }}>
          <path
            d="M94,155 L92,60 Q93,45 100,40 Q107,45 108,60 L106,155 Z"
            fill="#5C9A5E"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          {/* Yellow edge stripe */}
          <path d="M94,155 L92,60 Q93,50 96,48" stroke="#FFE17B" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M106,155 L108,60 Q107,50 104,48" stroke="#FFE17B" strokeWidth="2" fill="none" opacity="0.6" />
          {/* Horizontal bands */}
          <path d="M93,100 Q100,95 107,100" stroke="#4A8C5C" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M93,120 Q100,115 107,120" stroke="#4A8C5C" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* Left leaf */}
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '85px 155px' }}>
          <path
            d="M80,155 L75,80 Q76,65 82,60 Q88,65 89,80 L90,155 Z"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          <path d="M80,155 L75,80 Q76,70 78,65" stroke="#FFE17B" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M79,110 Q84,105 89,110" stroke="#5C9A5E" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* Right leaf */}
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '115px 155px' }}>
          <path
            d="M110,155 L111,80 Q112,65 118,60 Q124,65 125,80 L120,155 Z"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          <path d="M120,155 L125,80 Q124,70 122,65" stroke="#FFE17B" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M111,110 Q116,105 121,110" stroke="#5C9A5E" strokeWidth="1" fill="none" opacity="0.5" />
        </g>

        {/* Smaller outer leaves */}
        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '72px 155px' }}>
          <path
            d="M68,155 L65,105 Q66,95 70,92 Q74,95 75,105 L74,155 Z"
            fill="#8BB87A"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
        </g>

        <g className={animate ? 'leaf sway-5' : 'leaf'} style={{ transformOrigin: '128px 155px' }}>
          <path
            d="M126,155 L125,105 Q126,95 130,92 Q134,95 135,105 L132,155 Z"
            fill="#8BB87A"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
        </g>
      </g>
    </svg>
  );
}
