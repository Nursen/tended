import type { FaceExpression } from '../../../core/models/types';
import { getFaceProps } from './faceUtils';

interface PlantSVGProps {
  expression: FaceExpression;
  animate: boolean;
}

export function CactusSVG({ expression, animate }: PlantSVGProps) {
  const face = getFaceProps(expression);

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="45" ry="5" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body - small terracotta */}
      <g className="pot-body">
        <path
          d="M70,175 Q68,170 72,165 L128,165 Q132,170 130,175 L125,240 Q123,250 115,252 L85,252 Q77,250 75,240 Z"
          fill="#D4896A"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <rect x="65" y="160" width="70" height="10" rx="3" fill="#D4896A" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M78,180 Q75,173 82,170" stroke="white" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round" />
      </g>

      {/* Face on pot */}
      <g className="face">
        <g className="eye-left">
          <circle className="eye-open" cx="88" cy="205" r="3.5" fill="#2C3E2A" style={{ visibility: face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M83,205 Q88,200 93,205" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>
        <g className="eye-right">
          <circle className="eye-open" cx="112" cy="205" r="3.5" fill="#2C3E2A" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'hidden' : 'visible' }} />
          <path className="eye-closed" d="M107,205 Q112,200 117,205" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.rightEyeWink || face.eyesClosed ? 'visible' : 'hidden' }} />
        </g>

        <g className="mouth">
          <path d="M95,218 Q100,224 105,218" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'happy' ? 'visible' : 'hidden' }} />
          <path d="M96,220 L104,220" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'content' ? 'visible' : 'hidden' }} />
          <path d="M95,222 Q100,217 105,222" stroke="#2C3E2A" strokeWidth="2" fill="none" strokeLinecap="round" style={{ visibility: face.mouthId === 'worried' ? 'visible' : 'hidden' }} />
          <path d="M97,220 Q100,222 103,220 Q100,218 97,220" fill="#2C3E2A" style={{ visibility: face.mouthId === 'sleeping' ? 'visible' : 'hidden' }} />
        </g>

        <ellipse cx="80" cy="212" rx="5" ry="3" fill="#F7A8B8" opacity="0.4" />
        <ellipse cx="120" cy="212" rx="5" ry="3" fill="#F7A8B8" opacity="0.4" />

        <text x="122" y="192" fontSize="10" fill="#2C3E2A" opacity="0.5" style={{ visibility: face.showZzz ? 'visible' : 'hidden' }} fontFamily="sans-serif">z z</text>
        <g style={{ visibility: face.showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="130,185 132,181 134,185 138,187 134,189 132,193 130,189 126,187" fill="#FFE17B" opacity="0.8" />
        </g>
      </g>

      {/* Cactus body */}
      <g className="foliage">
        {/* Main cactus body - rounded column */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '100px 160px' }}>
          <path
            d="M82,160 Q80,140 82,100 Q85,60 100,50 Q115,60 118,100 Q120,140 118,160 Z"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="2"
          />
          {/* Vertical ridges */}
          <path d="M90,155 Q88,120 90,70" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
          <path d="M100,155 Q100,110 100,55" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />
          <path d="M110,155 Q112,120 110,70" stroke="#5C9A5E" strokeWidth="1.5" fill="none" />

          {/* Spines */}
          <g stroke="#2C3E2A" strokeWidth="0.8" fill="none">
            <line x1="82" y1="80" x2="75" y2="78" />
            <line x1="82" y1="100" x2="74" y2="99" />
            <line x1="82" y1="120" x2="75" y2="120" />
            <line x1="118" y1="80" x2="125" y2="78" />
            <line x1="118" y1="100" x2="126" y2="99" />
            <line x1="118" y1="120" x2="125" y2="120" />
            <line x1="100" y1="52" x2="100" y2="45" />
            <line x1="95" y1="55" x2="90" y2="50" />
            <line x1="105" y1="55" x2="110" y2="50" />
          </g>
        </g>

        {/* Left arm */}
        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '82px 110px' }}>
          <path
            d="M82,110 Q65,110 60,95 Q58,80 65,70 Q72,78 70,90 Q70,100 82,105"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="2"
          />
          <path d="M70,100 Q68,90 70,80" stroke="#5C9A5E" strokeWidth="1" fill="none" />
          <line x1="60" y1="90" x2="53" y2="88" stroke="#2C3E2A" strokeWidth="0.8" />
          <line x1="65" y1="72" x2="62" y2="65" stroke="#2C3E2A" strokeWidth="0.8" />
        </g>

        {/* Right arm */}
        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '118px 100px' }}>
          <path
            d="M118,100 Q135,100 140,85 Q142,70 135,62 Q128,70 130,82 Q130,92 118,95"
            fill="#8BB87A"
            stroke="#2C3E2A"
            strokeWidth="2"
          />
          <path d="M130,92 Q132,82 130,72" stroke="#6B9A5E" strokeWidth="1" fill="none" />
          <line x1="140" y1="80" x2="147" y2="78" stroke="#2C3E2A" strokeWidth="0.8" />
          <line x1="135" y1="64" x2="138" y2="57" stroke="#2C3E2A" strokeWidth="0.8" />
        </g>

        {/* Flower on top */}
        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '100px 50px' }}>
          <ellipse cx="100" cy="42" rx="8" ry="5" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="96" cy="38" rx="5" ry="8" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <ellipse cx="104" cy="38" rx="5" ry="8" fill="#F7A8B8" stroke="#2C3E2A" strokeWidth="1" />
          <circle cx="100" cy="40" r="4" fill="#FFE17B" />
          <circle cx="100" cy="40" r="2" fill="#D4896A" />
        </g>
      </g>
    </svg>
  );
}
