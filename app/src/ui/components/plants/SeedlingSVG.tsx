import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function SeedlingSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="35" ry="4" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - tiny starter pot */}
      <g className="pot-body">
        <path
          d="M75,190 Q73,185 77,180 L123,180 Q127,185 125,190 L120,245 Q118,255 110,257 L90,257 Q82,255 80,245 Z"
          fill="#FFE17B"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <rect x="72" y="176" width="56" height="8" rx="2" fill="#FFE17B" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M82,195 Q80,190 85,187" stroke="white" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round" />
      </g>

      {/* Face on pot */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="90" cy="215" r="3" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M86,215 Q90,210 94,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="110" cy="215" r="3" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M106,215 Q110,210 114,215" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M95,228 Q100,233 105,228" stroke="#2C3E2A" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M96,230 L104,230" stroke="#2C3E2A" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M95,232 Q100,228 105,232" stroke="#2C3E2A" strokeWidth="1.5" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M97,230 Q100,232 103,230 Q100,228 97,230" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="83" cy="222" rx="5" ry="3" fill="#F7A8B8" opacity="0.5" />
        <ellipse cx="117" cy="222" rx="5" ry="3" fill="#F7A8B8" opacity="0.5" />

        <text x="118" y="202" fontSize="10" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="125,195 127,191 129,195 133,197 129,199 127,203 125,199 121,197" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Tiny seedling sprout */}
      <g className="foliage">
        {/* Stem */}
        <path d="M100,176 L100,145" stroke="#7CAA6D" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Two cotyledon leaves (seed leaves) */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '100px 145px' }}>
          <ellipse cx="85" cy="140" rx="18" ry="10" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(-20 85 140)" />
          {/* Leaf vein */}
          <path d="M95,142 Q88,140 78,138" stroke="#5C9A5E" strokeWidth="1" fill="none" />
        </g>

        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '100px 145px' }}>
          <ellipse cx="115" cy="140" rx="18" ry="10" fill="#8BB87A" stroke="#2C3E2A" strokeWidth="1.5" transform="rotate(20 115 140)" />
          {/* Leaf vein */}
          <path d="M105,142 Q112,140 122,138" stroke="#5C9A5E" strokeWidth="1" fill="none" />
        </g>

        {/* Tiny new leaf emerging */}
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '100px 145px' }}>
          <path
            d="M100,145 Q100,130 95,120 Q98,118 100,120 Q102,118 105,120 Q100,130 100,145"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="1"
          />
        </g>

        {/* Soil dots */}
        <circle cx="85" cy="178" r="2" fill="#8B7355" opacity="0.5" />
        <circle cx="100" cy="179" r="1.5" fill="#8B7355" opacity="0.4" />
        <circle cx="115" cy="178" r="2" fill="#8B7355" opacity="0.5" />
      </g>
    </svg>
  );
}
