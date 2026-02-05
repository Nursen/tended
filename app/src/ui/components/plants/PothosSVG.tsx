import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function PothosSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="60" ry="8" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - round hanging-style pot */}
      <g className="pot-body">
        <path
          d="M55,160 Q50,165 52,180 L58,230 Q62,245 80,248 L120,248 Q138,245 142,230 L148,180 Q150,165 145,160 Z"
          fill="#7CAA6D"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <ellipse cx="100" cy="160" rx="47" ry="10" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M65,175 Q60,168 70,163" stroke="white" strokeWidth="4" fill="none" opacity="0.15" strokeLinecap="round" />
      </g>

      {/* Face */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="82" cy="200" r="4.5" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M76,200 Q82,194 88,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="118" cy="200" r="4.5" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M112,200 Q118,194 124,200" stroke="#2C3E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M93,215 Q100,223 107,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M95,217 L105,217" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M93,220 Q100,214 107,220" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M96,217 Q100,220 104,217 Q100,214 96,217" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="74" cy="208" rx="7" ry="5" fill="#F7A8B8" opacity="0.4" />
        <ellipse cx="126" cy="208" rx="7" ry="5" fill="#F7A8B8" opacity="0.4" />

        <text x="130" y="185" fontSize="12" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="140,175 142,170 144,175 149,177 144,179 142,184 140,179 135,177" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Pothos foliage - heart-shaped leaves cascading */}
      <g className="foliage">
        {/* Upward leaves */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '80px 140px' }}>
          <path d="M80,140 Q65,120 70,100 Q75,95 82,100 Q80,90 88,92 Q85,105 82,120 Q80,130 80,140" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1.5" />
        </g>
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '120px 135px' }}>
          <path d="M120,135 Q135,115 130,95 Q125,90 118,95 Q120,85 112,87 Q115,100 118,115 Q120,125 120,135" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1.5" />
        </g>
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '100px 130px' }}>
          <path d="M100,130 Q95,105 100,80 Q105,75 110,82 Q108,72 115,75 Q110,95 105,115 Q102,125 100,130" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1.5" />
        </g>

        {/* Trailing vines with heart leaves */}
        <path d="M60,248 Q45,260 35,275" stroke="#4A8C5C" strokeWidth="2" fill="none" />
        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '35px 275px' }}>
          <path d="M35,275 Q25,265 30,255 Q33,253 37,257 Q35,250 40,252 Q38,262 36,270" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1" />
        </g>
        <g className={animate ? 'leaf sway-5' : 'leaf'} style={{ transformOrigin: '48px 262px' }}>
          <path d="M48,262 Q40,255 43,248 Q46,246 49,249 Q48,244 52,245 Q50,252 49,258" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1" />
        </g>

        <path d="M140,248 Q155,260 165,275" stroke="#4A8C5C" strokeWidth="2" fill="none" />
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '165px 275px' }}>
          <path d="M165,275 Q175,265 170,255 Q167,253 163,257 Q165,250 160,252 Q162,262 164,270" fill="#7CAA6D" stroke="#2C3E2A" strokeWidth="1" />
        </g>
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '152px 262px' }}>
          <path d="M152,262 Q160,255 157,248 Q154,246 151,249 Q152,244 148,245 Q150,252 151,258" fill="#5C9A5E" stroke="#2C3E2A" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}
