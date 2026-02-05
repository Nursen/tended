import type { FaceExpression } from '../../../core/models/types';

export interface FaceProps {
  eyesClosed: boolean;
  rightEyeWink: boolean;
  mouthId: string;
  showZzz: boolean;
  showSparkle: boolean;
}

export function getFaceProps(expression: FaceExpression): FaceProps {
  const eyesClosed = expression === 'sleeping' || expression === 'winking';
  const rightEyeWink = expression === 'winking';
  const showZzz = expression === 'sleeping';
  const showSparkle = expression === 'happy' || expression === 'excited';

  let mouthId: string;
  switch (expression) {
    case 'happy':
    case 'winking':
      mouthId = 'happy';
      break;
    case 'content':
      mouthId = 'content';
      break;
    case 'sleeping':
      mouthId = 'sleeping';
      break;
    case 'worried':
      mouthId = 'worried';
      break;
    case 'excited':
      mouthId = 'happy';
      break;
    default:
      mouthId = 'content';
  }

  return { eyesClosed, rightEyeWink, mouthId, showZzz, showSparkle };
}
