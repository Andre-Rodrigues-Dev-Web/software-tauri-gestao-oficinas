import React from "react";

export function SimpleDonutChart({ title, values, colors, labels, size = 180, radius = 70 }: { title: string; values: number[]; colors: string[]; labels: string[]; size?: number; radius?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const circles = values.map((v, i) => {
    const frac = v / total;
    const dash = 2 * Math.PI * radius * frac;
    const gap = 2 * Math.PI * radius - dash;
    const rot = (acc / total) * 360; acc += v;
    return (
      <circle key={i} r={radius} cx={cx} cy={cy} fill="none" strokeWidth={18} strokeDasharray={`${dash} ${gap}`} stroke={colors[i % colors.length]} transform={`rotate(-90 ${cx} ${cy}) rotate(${rot} ${cx} ${cy})`} />
    );
  });
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="font-semibold mb-2">{title}</div>
      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{circles}</svg>
        <div className="text-sm text-gray-600 space-y-1">
          {labels.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: colors[i % colors.length] }} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
