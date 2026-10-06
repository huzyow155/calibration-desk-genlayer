import React from 'react';

// 5-column by 7-row bitmap definitions for digits and metric symbols
const BITMAPS: Record<string, number[]> = {
  '0': [
    0b01110,
    0b10001,
    0b10011,
    0b10101,
    0b11001,
    0b10001,
    0b01110,
  ],
  '1': [
    0b00100,
    0b01100,
    0b00100,
    0b00100,
    0b00100,
    0b00100,
    0b01110,
  ],
  '2': [
    0b01110,
    0b10001,
    0b00001,
    0b00010,
    0b00100,
    0b01000,
    0b11111,
  ],
  '3': [
    0b11110,
    0b00001,
    0b00001,
    0b01110,
    0b00001,
    0b00001,
    0b11110,
  ],
  '4': [
    0b00010,
    0b00110,
    0b01010,
    0b10010,
    0b11111,
    0b00010,
    0b00010,
  ],
  '5': [
    0b11111,
    0b10000,
    0b11110,
    0b00001,
    0b00001,
    0b10001,
    0b01110,
  ],
  '6': [
    0b00110,
    0b01000,
    0b10000,
    0b11110,
    0b10001,
    0b10001,
    0b01110,
  ],
  '7': [
    0b11111,
    0b00001,
    0b00010,
    0b00100,
    0b01000,
    0b01000,
    0b01000,
  ],
  '8': [
    0b01110,
    0b10001,
    0b10001,
    0b01110,
    0b10001,
    0b10001,
    0b01110,
  ],
  '9': [
    0b01110,
    0b10001,
    0b10001,
    0b01111,
    0b00001,
    0b00010,
    0b01100,
  ],
  '+': [
    0b00000,
    0b00100,
    0b00100,
    0b11111,
    0b00100,
    0b00100,
    0b00000,
  ],
  '-': [
    0b00000,
    0b00000,
    0b00000,
    0b11111,
    0b00000,
    0b00000,
    0b00000,
  ],
  '.': [
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b01100,
    0b01100,
  ],
  '%': [
    0b11001,
    0b11010,
    0b00100,
    0b01000,
    0b01011,
    0b10011,
    0b00000,
  ],
  '/': [
    0b00001,
    0b00010,
    0b00100,
    0b01000,
    0b10000,
    0b00000,
    0b00000,
  ],
  ':': [
    0b00000,
    0b01100,
    0b01100,
    0b00000,
    0b01100,
    0b01100,
    0b00000,
  ],
  ' ': [
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b00000,
    0b00000,
  ],
};

interface DotMatrixProps {
  value: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  color?: string;
  className?: string;
  showInactiveDots?: boolean;
}

export const DotMatrix: React.FC<DotMatrixProps> = ({
  value,
  size = 'md',
  color = '#ffffff',
  className = '',
  showInactiveDots = true,
}) => {
  // Dot dimension metrics based on requested size
  const config = {
    sm: { dotR: 1.2, step: 3.4, charGap: 3.5 },
    md: { dotR: 1.8, step: 5.0, charGap: 5.0 },
    lg: { dotR: 2.5, step: 6.8, charGap: 7.0 },
    hero: { dotR: 3.4, step: 9.0, charGap: 9.5 },
  }[size];

  const cols = 5;
  const rows = 7;
  const charWidth = cols * config.step;
  const charHeight = rows * config.step;

  const chars = String(value).split('');
  const totalWidth = chars.length * charWidth + (chars.length - 1) * config.charGap;

  return (
    <div className={`inline-flex items-center overflow-visible select-none ${className}`}>
      <svg
        width={totalWidth}
        height={charHeight}
        viewBox={`0 0 ${totalWidth} ${charHeight}`}
        className="overflow-visible"
        aria-label={value}
        role="img"
      >
        <defs>
          <filter id={`dot-glow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={config.dotR * 0.8} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {chars.map((char, charIdx) => {
          const bitmap = BITMAPS[char] || BITMAPS[' '];
          const xOffset = charIdx * (charWidth + config.charGap);

          const dots: React.ReactNode[] = [];

          for (let r = 0; r < rows; r++) {
            const rowBits = bitmap[r];
            for (let c = 0; c < cols; c++) {
              // Read bit at column (MSB is column 0)
              const bit = (rowBits >> (cols - 1 - c)) & 1;
              const cx = xOffset + c * config.step + config.step / 2;
              const cy = r * config.step + config.step / 2;

              if (bit === 1) {
                dots.push(
                  <circle
                    key={`dot-${charIdx}-${r}-${c}`}
                    cx={cx}
                    cy={cy}
                    r={config.dotR}
                    fill={color}
                    filter={`url(#dot-glow-${size})`}
                    className="dot-matrix-active"
                  />
                );
              } else if (showInactiveDots) {
                dots.push(
                  <circle
                    key={`dot-dim-${charIdx}-${r}-${c}`}
                    cx={cx}
                    cy={cy}
                    r={config.dotR * 0.75}
                    fill="rgba(255, 255, 255, 0.06)"
                    className="dot-matrix-dim"
                  />
                );
              }
            }
          }

          return <g key={`char-${charIdx}`}>{dots}</g>;
        })}
      </svg>
    </div>
  );
};
