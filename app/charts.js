// charts.js — small SVG chart builders for the statistics site.
// No library: each function takes a series and returns an SVG string. All charts
// are drawn from the Office's published figures in data.js and carry axis labels,
// so a reader can read a value off the chart without guessing.

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceMax(max) {
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Line chart with a filled area under the line. points: [{x: label, y: number}].
export function lineChart({ points, yLabel, width = 640, height = 300, format = (v) => String(v) }) {
  const padL = 74, padR = 14, padT = 14, padB = 30;
  const values = points.map((p) => p.y);
  const min = Math.min(0, ...values);
  const max = niceMax(Math.max(...values));
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const x = (i) => padL + (i / (points.length - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;
  const ticks = 4;
  let grid = '';
  for (let t = 0; t <= ticks; t += 1) {
    const v = min + ((max - min) * t) / ticks;
    const yy = y(v);
    grid += `<line class="gridline" x1="${padL}" y1="${yy}" x2="${width - padR}" y2="${yy}"/>`
      + `<text class="tick" x="${padL - 8}" y="${yy + 4}" text-anchor="end">${esc(format(Math.round(v)))}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(min).toFixed(1)} L${x(0).toFixed(1)},${y(min).toFixed(1)} Z`;
  const dots = points.map((p, i) => `<circle class="dot" cx="${x(i).toFixed(1)}" cy="${y(p.y).toFixed(1)}" r="3.5"><title>${esc(p.x)}: ${esc(format(p.y))}</title></circle>`).join('');
  const labels = points.map((p, i) => {
    if (i % 2 !== 0 && i !== points.length - 1) return '';
    return `<text class="tick" x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle">${esc(p.x)}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)} line chart">`
    + grid
    + `<path class="area" d="${area}"/><path class="line" d="${path}"/>`
    + dots + labels + '</svg>';
}

// Vertical bar chart. bars: [{label, value, alt?}].
export function barChart({ bars, yLabel, width = 640, height = 300, format = (v) => String(v) }) {
  const padL = 74, padR = 14, padT = 14, padB = 44;
  const max = niceMax(Math.max(...bars.map((b) => b.value)) * 1.08);
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const slot = innerW / bars.length;
  const barW = Math.min(56, slot * 0.62);
  const y = (v) => padT + innerH - (v / max) * innerH;
  let grid = '';
  for (let t = 0; t <= 4; t += 1) {
    const v = (max * t) / 4;
    const yy = y(v);
    grid += `<line class="gridline" x1="${padL}" y1="${yy}" x2="${width - padR}" y2="${yy}"/>`
      + `<text class="tick" x="${padL - 8}" y="${yy + 4}" text-anchor="end">${esc(format(Math.round(v)))}</text>`;
  }
  const rects = bars.map((b, i) => {
    const cx = padL + slot * i + slot / 2;
    return `<rect class="bar${b.alt ? ' alt' : ''}" x="${(cx - barW / 2).toFixed(1)}" y="${y(b.value).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(b.value)).toFixed(1)}" rx="3">`
      + `<title>${esc(b.label)}: ${esc(format(b.value))}</title></rect>`
      + `<text class="tick" x="${cx.toFixed(1)}" y="${(y(b.value) - 6).toFixed(1)}" text-anchor="middle">${esc(format(b.value))}</text>`
      + `<text class="tick" x="${cx.toFixed(1)}" y="${height - 22}" text-anchor="middle">${esc(b.label)}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(yLabel)} bar chart">`
    + grid + rects + '</svg>';
}

// Horizontal bar chart, good for ranked categories. bars: [{label, value}].
export function hbarChart({ bars, width = 640, rowH = 34, format = (v) => String(v) }) {
  const padL = 170, padR = 60, padT = 8, padB = 8;
  const height = padT + padB + bars.length * rowH;
  const max = Math.max(...bars.map((b) => b.value));
  const innerW = width - padL - padR;
  const rows = bars.map((b, i) => {
    const y = padT + i * rowH;
    const w = (b.value / max) * innerW;
    return `<text class="tick" x="${padL - 8}" y="${y + rowH / 2 + 4}" text-anchor="end">${esc(b.label)}</text>`
      + `<rect class="bar" x="${padL}" y="${y + 6}" width="${w.toFixed(1)}" height="${rowH - 12}" rx="3">`
      + `<title>${esc(b.label)}: ${esc(format(b.value))}</title></rect>`
      + `<text class="tick" x="${(padL + w + 8).toFixed(1)}" y="${y + rowH / 2 + 4}">${esc(format(b.value))}</text>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Horizontal bar chart">${rows}</svg>`;
}

// Donut chart with a centre label. slices: [{label, value}].
export function donutChart({ slices, centre, centreSub = '', width = 300, height = 300 }) {
  const cx = width / 2, cy = height / 2, r = 105, hole = 62;
  const total = slices.reduce((s, x) => s + x.value, 0);
  const colors = ['#14524f', '#1f7a6d', '#d98a1f', '#7fb5ab', '#c9a86a', '#8a9a94'];
  let angle = -Math.PI / 2;
  const parts = slices.map((s, i) => {
    const a0 = angle;
    angle += (s.value / total) * Math.PI * 2;
    const a1 = angle;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const ix1 = cx + hole * Math.cos(a1), iy1 = cy + hole * Math.sin(a1);
    const ix0 = cx + hole * Math.cos(a0), iy0 = cy + hole * Math.sin(a0);
    return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${ix1.toFixed(1)},${iy1.toFixed(1)} A${hole},${hole} 0 ${large} 0 ${ix0.toFixed(1)},${iy0.toFixed(1)} Z" fill="${colors[i % colors.length]}"><title>${esc(s.label)}: ${s.value}%</title></path>`;
  }).join('');
  const legend = '<div class="legend">' + slices.map((s, i) =>
    `<span><span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(s.label)} ${s.value}%</span>`).join('') + '</div>';
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Donut chart">`
    + parts
    + `<text class="donut-label" x="${cx}" y="${cy - 4}" text-anchor="middle">${esc(centre)}</text>`
    + `<text class="tick" x="${cx}" y="${cy + 16}" text-anchor="middle">${esc(centreSub)}</text></svg>`
    + legend;
}
