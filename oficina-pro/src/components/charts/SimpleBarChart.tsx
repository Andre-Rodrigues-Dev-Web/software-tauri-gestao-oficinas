import React from "react";

export function SimpleBarChart({ title, labels, values, barColor = "#3b82f6" }: { title: string; labels: string[]; values: number[]; barColor?: string }) {
  const max = Math.max(1, ...values);
  const height = 120;
  const barWidth = 28;
  const gap = 16;
  const width = values.length * (barWidth + gap) + gap;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      <svg width={width} height={height + 24} role="img" aria-label={title}>
        {values.map((v, i) => {
          const h = Math.round((v / max) * height);
          const x = gap + i * (barWidth + gap);
          const y = height - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} rx={4} fill={barColor} />
              <text x={x + barWidth / 2} y={height + 12} textAnchor="middle" fontSize={10} fill="#6b7280">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
