import { useState, useRef, useEffect } from 'react';
import type { PlantType, FaceExpression, HealthStatus } from '../../core/models/types';
import './Plant.css';

interface PlantProps {
  plantType: PlantType;
  expression?: FaceExpression;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: 80,
  md: 120,
  lg: 180,
};

export function Plant({
  plantType,
  expression = 'content',
  size = 'md',
  animate = true,
  onClick,
}: PlantProps) {
  const [isBouncing, setIsBouncing] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(expression);
  const blinkTimeoutRef = useRef<number | null>(null);

  // Handle click bounce
  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
    onClick?.();
  };

  // Random blinking
  useEffect(() => {
    if (!animate || currentExpression === 'sleeping') return;

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 4000; // 2-6 seconds
      blinkTimeoutRef.current = window.setTimeout(() => {
        // Quick blink
        const eyesOpen = document.querySelectorAll(`[data-plant-id="${plantType}"] .eye-open`);
        const eyesClosed = document.querySelectorAll(`[data-plant-id="${plantType}"] .eye-closed`);

        eyesOpen.forEach(eye => (eye as SVGElement).style.visibility = 'hidden');
        eyesClosed.forEach(eye => (eye as SVGElement).style.visibility = 'visible');

        setTimeout(() => {
          eyesOpen.forEach(eye => (eye as SVGElement).style.visibility = 'visible');
          eyesClosed.forEach(eye => (eye as SVGElement).style.visibility = 'hidden');
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, [animate, currentExpression, plantType]);

  // Update expression when prop changes
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  const pixelSize = SIZE_MAP[size];

  return (
    <div
      className={`plant ${animate ? 'plant-animated' : ''} ${isBouncing ? 'plant-bouncing' : ''}`}
      style={{ width: pixelSize, height: pixelSize * 1.4 }}
      onClick={handleClick}
      data-plant-id={plantType}
    >
      <PlantSVG
        plantType={plantType}
        expression={currentExpression}
        animate={animate}
      />
    </div>
  );
}

// Map health status to expression
export function healthToExpression(status: HealthStatus): FaceExpression {
  switch (status) {
    case 'thriving':
      return 'happy';
    case 'healthy':
      return 'content';
    case 'cooling':
      return 'content';
    case 'at_risk':
      return 'worried';
    case 'dormant':
      return 'sleeping';
    default:
      return 'content';
  }
}

// SVG Component - renders the appropriate plant
function PlantSVG({
  plantType: _plantType,
  expression,
  animate,
}: {
  plantType: PlantType;
  expression: FaceExpression;
  animate: boolean;
}) {
  // For now, we use monstera as the base for all plants
  // Will be replaced with actual plant-specific SVGs when illustrations are ready
  // _plantType will be used to select the correct SVG component
  return <MonsteraSVG expression={expression} animate={animate} />;
}

function MonsteraSVG({ expression, animate }: { expression: FaceExpression; animate: boolean }) {
  const mouthId = getMouthId(expression);
  const showZzz = expression === 'sleeping';
  const showSparkle = expression === 'happy' || expression === 'excited';
  const eyesClosed = expression === 'sleeping' || expression === 'winking';
  const rightEyeWink = expression === 'winking';

  return (
    <svg viewBox="0 0 200 280" className="plant-svg">
      {/* Shadow */}
      <ellipse cx="100" cy="268" rx="65" ry="8" fill="#2C3E2A" opacity="0.08" />

      {/* Pot Body */}
      <g className="pot-body">
        <path
          d="M60,160 Q58,155 62,150 L138,150 Q142,155 140,160 L135,230 Q133,240 125,242 L75,242 Q67,240 65,230 Z"
          fill="#FFE17B"
          stroke="#2C3E2A"
          strokeWidth="2"
        />
        <rect x="55" y="145" width="90" height="12" rx="4" fill="#FFE17B" stroke="#2C3E2A" strokeWidth="2" />
        <path d="M70,165 Q68,162 72,158 L82,158 Q80,162 78,165 Z" fill="white" opacity="0.15" />
      </g>

      {/* Face */}
      <g className="face">
        {/* Eyes */}
        <g className="eye-left">
          <circle
            className="eye-open"
            cx="82"
            cy="195"
            r="4.5"
            fill="#2C3E2A"
            style={{ visibility: eyesClosed ? 'hidden' : 'visible' }}
          />
          <path
            className="eye-closed"
            d="M76,195 Q82,189 88,195"
            stroke="#2C3E2A"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            style={{ visibility: eyesClosed ? 'visible' : 'hidden' }}
          />
        </g>
        <g className="eye-right">
          <circle
            className="eye-open"
            cx="118"
            cy="195"
            r="4.5"
            fill="#2C3E2A"
            style={{ visibility: rightEyeWink || eyesClosed ? 'hidden' : 'visible' }}
          />
          <path
            className="eye-closed"
            d="M112,195 Q118,189 124,195"
            stroke="#2C3E2A"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            style={{ visibility: rightEyeWink || eyesClosed ? 'visible' : 'hidden' }}
          />
        </g>

        {/* Mouths */}
        <g className="mouth">
          <path
            d="M93,210 Q100,218 107,210"
            stroke="#2C3E2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{ visibility: mouthId === 'happy' ? 'visible' : 'hidden' }}
          />
          <path
            d="M95,212 L105,212"
            stroke="#2C3E2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{ visibility: mouthId === 'content' ? 'visible' : 'hidden' }}
          />
          <path
            d="M93,215 Q100,209 107,215"
            stroke="#2C3E2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            style={{ visibility: mouthId === 'worried' ? 'visible' : 'hidden' }}
          />
          <path
            d="M96,212 Q100,215 104,212 Q100,209 96,212"
            fill="#2C3E2A"
            style={{ visibility: mouthId === 'sleeping' ? 'visible' : 'hidden' }}
          />
          <path
            d="M93,208 Q100,220 107,208"
            stroke="#2C3E2A"
            strokeWidth="2"
            fill="#F7A8B8"
            strokeLinecap="round"
            style={{ visibility: mouthId === 'excited' ? 'visible' : 'hidden' }}
          />
        </g>

        {/* Blush */}
        <g className="blush">
          <ellipse cx="74" cy="204" rx="8" ry="5" fill="#F7A8B8" opacity="0.4" />
          <ellipse cx="126" cy="204" rx="8" ry="5" fill="#F7A8B8" opacity="0.4" />
        </g>

        {/* Extras */}
        <text
          x="130"
          y="178"
          fontSize="14"
          fill="#2C3E2A"
          opacity="0.5"
          style={{ visibility: showZzz ? 'visible' : 'hidden' }}
          fontFamily="sans-serif"
        >
          z z
        </text>
        <g style={{ visibility: showSparkle ? 'visible' : 'hidden' }}>
          <polygon points="140,170 142,165 144,170 149,172 144,174 142,179 140,174 135,172" fill="#FFE17B" opacity="0.8" />
          <polygon points="155,182 156,179 157,182 160,183 157,184 156,187 155,184 152,183" fill="#FFE17B" opacity="0.6" />
        </g>
      </g>

      {/* Foliage */}
      <g className="foliage">
        {/* Stems */}
        <path d="M95,150 Q90,120 85,95" stroke="#4A8C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M105,148 Q108,110 115,85" stroke="#4A8C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M100,150 Q100,115 95,80" stroke="#4A8C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M110,150 Q120,125 130,105" stroke="#4A8C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M90,150 Q75,130 65,110" stroke="#4A8C5C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Leaves */}
        <g className={animate ? 'leaf sway-1' : 'leaf'} style={{ transformOrigin: '85px 95px' }}>
          <path
            d="M85,95 Q70,80 60,60 Q65,55 75,58 Q72,50 78,48 Q82,52 80,60 Q88,50 90,55 Q85,65 82,75 Z"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          <ellipse cx="74" cy="68" rx="4" ry="5" fill="#FFF8F0" opacity="0.6" />
        </g>

        <g className={animate ? 'leaf sway-2' : 'leaf'} style={{ transformOrigin: '115px 85px' }}>
          <path
            d="M115,85 Q130,70 140,48 Q135,45 128,50 Q132,40 126,38 Q122,44 125,52 Q115,42 112,48 Q118,58 122,68 Z"
            fill="#7CAA6D"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          <ellipse cx="132" cy="55" rx="4" ry="5" fill="#FFF8F0" opacity="0.6" />
        </g>

        <g className={animate ? 'leaf sway-3' : 'leaf'} style={{ transformOrigin: '95px 80px' }}>
          <path
            d="M95,80 Q85,60 80,35 Q86,32 90,38 Q88,28 94,26 Q97,32 95,42 Q102,32 105,38 Q98,50 96,62 Z"
            fill="#5C9A5E"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
          <ellipse cx="90" cy="48" rx="3.5" ry="5" fill="#FFF8F0" opacity="0.6" />
        </g>

        <g className={animate ? 'leaf sway-4' : 'leaf'} style={{ transformOrigin: '130px 105px' }}>
          <path
            d="M130,105 Q145,90 150,72 Q145,70 140,76 Q143,66 138,65 Q135,70 137,78 Q130,70 128,75 Q134,84 133,92 Z"
            fill="#8BB87A"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
        </g>

        <g className={animate ? 'leaf sway-5' : 'leaf'} style={{ transformOrigin: '65px 110px' }}>
          <path
            d="M65,110 Q50,95 42,78 Q48,76 52,82 Q49,72 55,70 Q58,76 56,84 Q62,75 65,80 Q60,90 62,100 Z"
            fill="#8BB87A"
            stroke="#2C3E2A"
            strokeWidth="1.5"
          />
        </g>
      </g>
    </svg>
  );
}

function getMouthId(expression: FaceExpression): string {
  switch (expression) {
    case 'happy':
      return 'happy';
    case 'content':
      return 'content';
    case 'sleeping':
      return 'sleeping';
    case 'worried':
      return 'worried';
    case 'excited':
      return 'excited';
    case 'winking':
      return 'happy';
    default:
      return 'content';
  }
}
