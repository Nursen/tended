import { useState, useRef, useEffect } from 'react';
import type { PlantType, FaceExpression, HealthStatus } from '../../core/models/types';
import {
  MonsteraSVG,
  OrchidSVG,
  PothosSVG,
  FernSVG,
  SnakePlantSVG,
  CactusSVG,
  SeedlingSVG,
  SucculentSVG,
} from './plants';
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
  const svgRef = useRef<HTMLDivElement>(null);
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
      const delay = 2000 + Math.random() * 4000;
      blinkTimeoutRef.current = window.setTimeout(() => {
        if (!svgRef.current) return;

        const eyesOpen = svgRef.current.querySelectorAll('.eye-open');
        const eyesClosed = svgRef.current.querySelectorAll('.eye-closed');

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
  }, [animate, currentExpression]);

  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  const pixelSize = SIZE_MAP[size];

  return (
    <div
      ref={svgRef}
      className={`plant ${animate ? 'plant-animated' : ''} ${isBouncing ? 'plant-bouncing' : ''}`}
      style={{ width: pixelSize, height: pixelSize * 1.4 }}
      onClick={handleClick}
    >
      <PlantSVG plantType={plantType} expression={currentExpression} animate={animate} />
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
  plantType,
  expression,
  animate,
}: {
  plantType: PlantType;
  expression: FaceExpression;
  animate: boolean;
}) {
  switch (plantType) {
    // Tier 1 - High maintenance tropicals
    case 'monstera':
      return <MonsteraSVG expression={expression} animate={animate} />;
    case 'fiddle_leaf_fig':
      return <MonsteraSVG expression={expression} animate={animate} />; // TODO: create fiddle leaf
    case 'bird_of_paradise':
      return <OrchidSVG expression={expression} animate={animate} />; // Similar tall tropical
    case 'orchid':
      return <OrchidSVG expression={expression} animate={animate} />;

    // Tier 2 - Expressive houseplants
    case 'pothos':
      return <PothosSVG expression={expression} animate={animate} />;
    case 'peace_lily':
      return <OrchidSVG expression={expression} animate={animate} />; // Similar flowering
    case 'rubber_plant':
      return <MonsteraSVG expression={expression} animate={animate} />; // Similar large leaves

    // Tier 3 - Forgiving everyday plants
    case 'fern':
      return <FernSVG expression={expression} animate={animate} />;
    case 'spider_plant':
      return <FernSVG expression={expression} animate={animate} />; // Similar arching
    case 'herbs':
      return <FernSVG expression={expression} animate={animate} />; // Small leafy

    // Tier 4 - Low maintenance
    case 'succulent':
      return <SucculentSVG expression={expression} animate={animate} />;
    case 'snake_plant':
      return <SnakePlantSVG expression={expression} animate={animate} />;
    case 'aloe':
      return <SucculentSVG expression={expression} animate={animate} />; // Similar rosette

    // Tier 5 - Neglect tolerant
    case 'cactus':
      return <CactusSVG expression={expression} animate={animate} />;
    case 'air_plant':
      return <SeedlingSVG expression={expression} animate={animate} />; // Small
    case 'seedling':
      return <SeedlingSVG expression={expression} animate={animate} />;

    default:
      return <MonsteraSVG expression={expression} animate={animate} />;
  }
}
