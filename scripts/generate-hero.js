#!/usr/bin/env node

/**
 * Generate ProvenIQ Hero Image — Clinical Dashboard Mockup
 *
 * Creates a professional SVG-based dashboard visualization
 * showing what ProvenIQ does: treatment recommendations,
 * lab trends, patient matching, safety monitoring.
 *
 * Usage: node scripts/generate-hero.js
 */

const sharp = require("sharp");
const path = require("path");

const WIDTH = 1200;
const HEIGHT = 700;

// Brand colors
const TEAL = "#1A7A6A";
const TEAL_LIGHT = "#adddd5";
const TEAL_DARK = "#0f4a3f";
const GOLD = "#D4A843";
const GOLD_LIGHT = "#f8edd4";
const SLATE_900 = "#0f172a";
const SLATE_800 = "#1e293b";
const SLATE_700 = "#334155";
const SLATE_600 = "#475569";
const SLATE_400 = "#94a3b2";
const SLATE_200 = "#e2e8ec";
const SLATE_100 = "#f1f4f6";
const WHITE = "#ffffff";

function barChart(x, y, w, h) {
  const bars = [
    { height: 0.85, color: TEAL, label: "Pellet" },
    { height: 0.72, color: TEAL, label: "Injectable" },
    { height: 0.58, color: GOLD, label: "Oral" },
    { height: 0.45, color: GOLD, label: "Topical" },
  ];
  const barW = Math.floor((w - 40) / bars.length) - 8;
  let svg = "";

  // Axis line
  svg += `<line x1="${x + 30}" y1="${y + h - 20}" x2="${x + w}" y2="${y + h - 20}" stroke="${SLATE_200}" stroke-width="1"/>`;

  bars.forEach((bar, i) => {
    const bx = x + 35 + i * (barW + 8);
    const bh = (h - 50) * bar.height;
    const by = y + h - 20 - bh;
    svg += `<rect x="${bx}" y="${by}" width="${barW}" height="${bh}" rx="3" fill="${bar.color}" opacity="0.85"/>`;
    svg += `<text x="${bx + barW / 2}" y="${y + h - 6}" text-anchor="middle" font-size="9" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">${bar.label}</text>`;
    svg += `<text x="${bx + barW / 2}" y="${by - 5}" text-anchor="middle" font-size="10" fill="${SLATE_600}" font-weight="600" font-family="Inter,system-ui,sans-serif">${Math.round(bar.height * 100)}%</text>`;
  });

  return svg;
}

function lineChart(x, y, w, h) {
  // Lab trend visualization
  const points1 = [
    [0, 0.6], [0.15, 0.55], [0.3, 0.45], [0.45, 0.35],
    [0.6, 0.3], [0.75, 0.25], [0.9, 0.2], [1, 0.18],
  ];
  const points2 = [
    [0, 0.8], [0.15, 0.75], [0.3, 0.7], [0.45, 0.6],
    [0.6, 0.55], [0.75, 0.48], [0.9, 0.42], [1, 0.38],
  ];

  const chartY = y + 10;
  const chartH = h - 40;

  let svg = "";

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const gy = chartY + (chartH / 4) * i;
    svg += `<line x1="${x + 25}" y1="${gy}" x2="${x + w - 10}" y2="${gy}" stroke="${SLATE_200}" stroke-width="0.5" stroke-dasharray="3,3"/>`;
  }

  // Optimal range band
  svg += `<rect x="${x + 25}" y="${chartY + chartH * 0.15}" width="${w - 35}" height="${chartH * 0.25}" fill="${TEAL}" opacity="0.08" rx="2"/>`;
  svg += `<text x="${x + w - 12}" y="${chartY + chartH * 0.28}" text-anchor="end" font-size="7" fill="${TEAL}" opacity="0.6" font-family="Inter,system-ui,sans-serif">optimal</text>`;

  // Line 1 (Total T)
  const path1 = points1
    .map((p, i) => {
      const px = x + 25 + p[0] * (w - 35);
      const py = chartY + p[1] * chartH;
      return `${i === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");
  svg += `<path d="${path1}" fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Line 2 (Free T)
  const path2 = points2
    .map((p, i) => {
      const px = x + 25 + p[0] * (w - 35);
      const py = chartY + p[1] * chartH;
      return `${i === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");
  svg += `<path d="${path2}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Dots on latest values
  const last1 = points1[points1.length - 1];
  const last2 = points2[points2.length - 1];
  svg += `<circle cx="${x + 25 + last1[0] * (w - 35)}" cy="${chartY + last1[1] * chartH}" r="4" fill="${TEAL}" stroke="${WHITE}" stroke-width="2"/>`;
  svg += `<circle cx="${x + 25 + last2[0] * (w - 35)}" cy="${chartY + last2[1] * chartH}" r="4" fill="${GOLD}" stroke="${WHITE}" stroke-width="2"/>`;

  // X axis labels
  const months = ["Jun", "Aug", "Oct", "Dec", "Feb", "Apr", "Jun", "Aug"];
  months.forEach((m, i) => {
    const mx = x + 25 + (i / (months.length - 1)) * (w - 35);
    svg += `<text x="${mx}" y="${y + h - 5}" text-anchor="middle" font-size="8" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">${m}</text>`;
  });

  return svg;
}

function generateSVG() {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`;

  // Definitions
  svg += `<defs>
    <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000" flood-opacity="0.08"/>
    </filter>
    <filter id="shadow-sm" x="-5%" y="-5%" width="115%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000" flood-opacity="0.06"/>
    </filter>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f9f7"/>
      <stop offset="100%" stop-color="#f8fafb"/>
    </linearGradient>
  </defs>`;

  // Background
  svg += `<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg-grad)" rx="16"/>`;

  // ======= LEFT PANEL: Treatment Recommendations =======
  const lx = 30, ly = 30, lw = 370, lh = 640;
  svg += `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;

  // Header
  svg += `<rect x="${lx}" y="${ly}" width="${lw}" height="52" rx="12" fill="${WHITE}"/>`;
  svg += `<rect x="${lx}" y="${ly + 40}" width="${lw}" height="12" fill="${WHITE}"/>`;
  svg += `<line x1="${lx}" y1="${ly + 52}" x2="${lx + lw}" y2="${ly + 52}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<circle cx="${lx + 24}" cy="${ly + 26}" r="10" fill="${TEAL}" opacity="0.12"/>`;
  svg += `<text x="${lx + 24}" y="${ly + 30}" text-anchor="middle" font-size="12" fill="${TEAL}" font-family="Inter,system-ui,sans-serif">&#x2713;</text>`;
  svg += `<text x="${lx + 42}" y="${ly + 31}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Treatment Recommendations</text>`;

  // Patient info chip
  svg += `<rect x="${lx + 16}" y="${ly + 64}" width="${lw - 32}" height="36" rx="8" fill="${SLATE_100}"/>`;
  svg += `<text x="${lx + 28}" y="${ly + 86}" font-size="11" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">Patient: Female, 52  |  Low Energy, Weight Gain  |  TSH: 3.8</text>`;

  // Treatment cards
  const treatments = [
    { name: "BioTE Hormone Pellet", rate: "87%", confidence: "High", patients: "2,670", color: TEAL },
    { name: "Testosterone Cypionate IM", rate: "79%", confidence: "High", patients: "2,416", color: TEAL },
    { name: "Semaglutide 0.5mg", rate: "73%", confidence: "Med", patients: "754", color: GOLD },
    { name: "Thyroid (NP Thyroid)", rate: "68%", confidence: "Med", patients: "412", color: GOLD },
  ];

  treatments.forEach((t, i) => {
    const ty = ly + 115 + i * 82;
    svg += `<rect x="${lx + 16}" y="${ty}" width="${lw - 32}" height="72" rx="8" fill="${WHITE}" stroke="${SLATE_200}" stroke-width="1"/>`;
    // Rank
    svg += `<rect x="${lx + 26}" y="${ty + 10}" width="24" height="24" rx="6" fill="${t.color}" opacity="0.12"/>`;
    svg += `<text x="${lx + 38}" y="${ty + 27}" text-anchor="middle" font-size="12" font-weight="700" fill="${t.color}" font-family="Inter,system-ui,sans-serif">${i + 1}</text>`;
    // Name
    svg += `<text x="${lx + 60}" y="${ty + 27}" font-size="12" font-weight="600" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">${t.name}</text>`;
    // Stats row
    svg += `<text x="${lx + 60}" y="${ty + 47}" font-size="10" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">Success Rate:</text>`;
    svg += `<text x="${lx + 130}" y="${ty + 47}" font-size="10" font-weight="700" fill="${t.color}" font-family="Inter,system-ui,sans-serif">${t.rate}</text>`;
    svg += `<text x="${lx + 170}" y="${ty + 47}" font-size="10" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">Confidence:</text>`;
    svg += `<text x="${lx + 235}" y="${ty + 47}" font-size="10" font-weight="600" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">${t.confidence}</text>`;
    // Patients badge
    svg += `<rect x="${lx + 260}" y="${ty + 37}" width="70" height="18" rx="9" fill="${SLATE_100}"/>`;
    svg += `<text x="${lx + 295}" y="${ty + 50}" text-anchor="middle" font-size="9" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">${t.patients} pts</text>`;
    // Progress bar
    svg += `<rect x="${lx + 60}" y="${ty + 56}" width="${lw - 92}" height="4" rx="2" fill="${SLATE_100}"/>`;
    svg += `<rect x="${lx + 60}" y="${ty + 56}" width="${(lw - 92) * parseFloat(t.rate) / 100}" height="4" rx="2" fill="${t.color}" opacity="0.7"/>`;
  });

  // Similar patients note
  svg += `<rect x="${lx + 16}" y="${ly + 550}" width="${lw - 32}" height="36" rx="8" fill="${TEAL}" opacity="0.06"/>`;
  svg += `<text x="${lx + 28}" y="${ly + 572}" font-size="10" fill="${TEAL}" font-family="Inter,system-ui,sans-serif">&#9432;  Based on 847 similar patients (72% match score)</text>`;

  // Disclaimer
  svg += `<text x="${lx + 16}" y="${ly + 610}" font-size="8" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">AI-generated recommendation — clinical judgment required</text>`;

  // ======= TOP RIGHT: Lab Trends =======
  const rx = 420, ry = 30, rw = 380, rh = 300;
  svg += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;
  svg += `<line x1="${rx}" y1="${ry + 48}" x2="${rx + rw}" y2="${ry + 48}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<text x="${rx + 16}" y="${ry + 31}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Lab Trends — Testosterone</text>`;

  // Legend
  svg += `<circle cx="${rx + rw - 120}" cy="${ry + 27}" r="4" fill="${TEAL}"/>`;
  svg += `<text x="${rx + rw - 112}" y="${ry + 31}" font-size="9" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">Total T</text>`;
  svg += `<circle cx="${rx + rw - 60}" cy="${ry + 27}" r="4" fill="${GOLD}"/>`;
  svg += `<text x="${rx + rw - 52}" y="${ry + 31}" font-size="9" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">Free T</text>`;

  svg += lineChart(rx, ry + 50, rw, rh - 70);

  // ======= BOTTOM RIGHT TOP: Safety Monitoring =======
  const sx = 420, sy = 350, sw = 380, sh = 155;
  svg += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;
  svg += `<line x1="${sx}" y1="${sy + 48}" x2="${sx + sw}" y2="${sy + 48}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<circle cx="${sx + 24}" cy="${sy + 24}" r="10" fill="#fef3c7"/>`;
  svg += `<text x="${sx + 24}" y="${sy + 28}" text-anchor="middle" font-size="11" fill="${GOLD}" font-family="Inter,system-ui,sans-serif">!</text>`;
  svg += `<text x="${sx + 42}" y="${sy + 30}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Safety Monitoring</text>`;

  // Status badges
  const alerts = [
    { label: "Hematocrit 52.1%", status: "Attention", color: GOLD },
    { label: "PSA 1.2 ng/mL", status: "Normal", color: TEAL },
    { label: "Estradiol 48 pg/mL", status: "Normal", color: TEAL },
    { label: "ALT 28 U/L", status: "Normal", color: TEAL },
  ];
  alerts.forEach((a, i) => {
    const ay = sy + 60 + i * 22;
    svg += `<text x="${sx + 20}" y="${ay + 12}" font-size="11" fill="${SLATE_700}" font-family="Inter,system-ui,sans-serif">${a.label}</text>`;
    svg += `<rect x="${sx + sw - 90}" y="${ay}" width="70" height="18" rx="9" fill="${a.color}" opacity="0.12"/>`;
    svg += `<text x="${sx + sw - 55}" y="${ay + 13}" text-anchor="middle" font-size="9" font-weight="600" fill="${a.color}" font-family="Inter,system-ui,sans-serif">${a.status}</text>`;
  });

  // ======= FAR RIGHT: Success Rate Chart =======
  const bx = 820, by = 30, bw = 350, bh = 300;
  svg += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;
  svg += `<line x1="${bx}" y1="${by + 48}" x2="${bx + bw}" y2="${by + 48}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<text x="${bx + 16}" y="${by + 31}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Treatment Success by Type</text>`;
  svg += barChart(bx, by + 55, bw, bh - 70);

  // ======= FAR RIGHT BOTTOM: Patient Summary =======
  const px = 820, py = 350, pw = 350, ph = 320;
  svg += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;
  svg += `<line x1="${px}" y1="${py + 48}" x2="${px + pw}" y2="${py + 48}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<text x="${px + 16}" y="${py + 31}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Chart Summary</text>`;

  // Summary content
  const summaryLines = [
    { label: "Journey", text: "4 years, 21 encounters" },
    { label: "Primary Dx", text: "Hypothyroidism, Fatigue" },
    { label: "Current Tx", text: "Pellet + NP Thyroid" },
    { label: "Response", text: "Positive — energy improved" },
    { label: "Labs", text: "Total T: 142 → 680 ng/dL" },
    { label: "Next Visit", text: "March 28, 2026" },
  ];
  summaryLines.forEach((line, i) => {
    const ly2 = py + 68 + i * 28;
    svg += `<text x="${px + 20}" y="${ly2}" font-size="10" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">${line.label}</text>`;
    svg += `<text x="${px + 100}" y="${ly2}" font-size="11" fill="${SLATE_700}" font-family="Inter,system-ui,sans-serif">${line.text}</text>`;
  });

  // Symptoms section
  const symptomY = py + 245;
  svg += `<text x="${px + 20}" y="${symptomY}" font-size="10" font-weight="600" fill="${SLATE_600}" font-family="Inter,system-ui,sans-serif">Symptom Tracking</text>`;
  const symptoms = [
    { name: "Energy", pct: 0.8, color: TEAL },
    { name: "Sleep", pct: 0.65, color: TEAL },
    { name: "Libido", pct: 0.7, color: GOLD },
    { name: "Weight", pct: 0.45, color: GOLD },
  ];
  symptoms.forEach((s, i) => {
    const sy2 = symptomY + 14 + i * 18;
    svg += `<text x="${px + 20}" y="${sy2 + 10}" font-size="9" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">${s.name}</text>`;
    svg += `<rect x="${px + 72}" y="${sy2 + 2}" width="${pw - 110}" height="8" rx="4" fill="${SLATE_100}"/>`;
    svg += `<rect x="${px + 72}" y="${sy2 + 2}" width="${(pw - 110) * s.pct}" height="8" rx="4" fill="${s.color}" opacity="0.6"/>`;
  });

  // ======= BOTTOM CENTER: Safety bottom section =======
  const bsx = 420, bsy = 525, bsw = 380, bsh = 145;
  svg += `<rect x="${bsx}" y="${bsy}" width="${bsw}" height="${bsh}" rx="12" fill="${WHITE}" filter="url(#shadow)"/>`;
  svg += `<line x1="${bsx}" y1="${bsy + 48}" x2="${bsx + bsw}" y2="${bsy + 48}" stroke="${SLATE_200}" stroke-width="1"/>`;
  svg += `<text x="${bsx + 16}" y="${bsy + 31}" font-size="13" font-weight="700" fill="${SLATE_800}" font-family="Inter,system-ui,sans-serif">Similar Patients (72% match)</text>`;

  // Mini patient rows
  const matchPatients = [
    { id: "F-48", tx: "Pellet + Thyroid", outcome: "Optimal", t: "14mo" },
    { id: "F-55", tx: "Pellet + Semaglutide", outcome: "Improved", t: "8mo" },
    { id: "F-51", tx: "Injectable + Thyroid", outcome: "Optimal", t: "22mo" },
  ];
  matchPatients.forEach((mp, i) => {
    const my = bsy + 60 + i * 24;
    svg += `<rect x="${bsx + 16}" y="${my}" width="36" height="16" rx="4" fill="${TEAL}" opacity="0.1"/>`;
    svg += `<text x="${bsx + 34}" y="${my + 12}" text-anchor="middle" font-size="9" font-weight="600" fill="${TEAL}" font-family="Inter,system-ui,sans-serif">${mp.id}</text>`;
    svg += `<text x="${bsx + 62}" y="${my + 12}" font-size="10" fill="${SLATE_700}" font-family="Inter,system-ui,sans-serif">${mp.tx}</text>`;
    svg += `<rect x="${bsx + sw - 120}" y="${my}" width="55" height="16" rx="8" fill="${TEAL}" opacity="0.1"/>`;
    svg += `<text x="${bsx + sw - 92}" y="${my + 12}" text-anchor="middle" font-size="8" font-weight="600" fill="${TEAL}" font-family="Inter,system-ui,sans-serif">${mp.outcome}</text>`;
    svg += `<text x="${bsx + sw - 50}" y="${my + 12}" font-size="9" fill="${SLATE_400}" font-family="Inter,system-ui,sans-serif">${mp.t}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

async function main() {
  console.log("Generating ProvenIQ hero image...");

  const svg = generateSVG();
  const outputPath = path.join(__dirname, "..", "public", "images", "hero-dashboard.png");

  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);

  console.log(`Hero image saved to: ${outputPath}`);

  // Also save SVG for reference
  const svgPath = path.join(__dirname, "..", "public", "images", "hero-dashboard.svg");
  require("fs").writeFileSync(svgPath, svg);
  console.log(`SVG saved to: ${svgPath}`);
}

main().catch(console.error);
