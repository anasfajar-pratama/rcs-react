import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'images');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// BLISERA (Wanita) - Warm Rose & Soft Pink
// PIJAR NALA (Baby & Kids) - Soft Yellow & Mint
// FOKKA (Men) - Deep Blue & Dark Grey

function gradientSvg(brand, name, colors, icon) {
  const [c1, c2] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" rx="16"/>
  <g transform="translate(400,320)" filter="url(#shadow)">
    <text font-family="serif" font-size="100" fill="white" text-anchor="middle" dy="0" opacity="0.9">${icon}</text>
  </g>
  <text font-family="Arial,sans-serif" font-size="28" fill="white" text-anchor="middle" x="400" y="540" opacity="0.85" font-weight="bold">${name}</text>
  <text font-family="Arial,sans-serif" font-size="18" fill="white" text-anchor="middle" x="400" y="580" opacity="0.6">${brand}</text>
</svg>`;
}

const items = [
  // BLISERA (Wanita) - Warm Rose palette
  { brand: 'BLISERA', name: 'Serum Glow Intensif',        colors: ['#E8A0BF', '#D4729A'], icon: '✦' },
  { brand: 'BLISERA', name: 'Moisturizer Intensif',       colors: ['#F2C4CE', '#E8A0BF'], icon: '◈' },
  { brand: 'BLISERA', name: 'Face Wash Pencerah',         colors: ['#F5D6C6', '#E8A0BF'], icon: '○' },
  { brand: 'BLISERA', name: 'Brightening Toner',          colors: ['#E8A0BF', '#C9A0DC'], icon: '◇' },
  { brand: 'BLISERA', name: 'Eye Cream Gold',             colors: ['#F2C4CE', '#D4A574'], icon: '☆' },
  { brand: 'BLISERA', name: 'Night Repair Masque',        colors: ['#C9A0DC', '#A8A0DC'], icon: '☽' },
  { brand: 'BLISERA', name: 'BB Cream Natural',           colors: ['#F5D6C6', '#E8C4A0'], icon: '♡' },
  { brand: 'BLISERA', name: 'Sunscreen SPF 50',           colors: ['#FFD6A5', '#F2C4CE'], icon: '☀' },
  { brand: 'BLISERA', name: 'Lip Treatment',              colors: ['#D4729A', '#C24B78'], icon: '♢' },
  { brand: 'BLISERA', name: 'Hair Tonic',                 colors: ['#A8C4DC', '#D4A574'], icon: '✦' },
  { brand: 'BLISERA', name: 'Body Lotion Silk',           colors: ['#F5D6C6', '#F2C4CE'], icon: '◈' },

  // FOKKA (Pria) - Deep Blue & Dark Grey
  { brand: 'FOKKA', name: "Men's Active Cleanser",        colors: ['#2C3E50', '#1A252F'], icon: '◆' },
  { brand: 'FOKKA', name: "Men's Hydra Gel",              colors: ['#34495E', '#2C3E50'], icon: '●' },
  { brand: 'FOKKA', name: "Men's Face Scrub",             colors: ['#3E5C76', '#2C3E50'], icon: '■' },
  { brand: 'FOKKA', name: "Men's Aftershave Balm",        colors: ['#5D6D7E', '#34495E'], icon: '▲' },
  { brand: 'FOKKA', name: "Men's Body Wash",              colors: ['#2C3E50', '#1A252F'], icon: '▼' },
  { brand: 'FOKKA', name: "Men's Deodorant",              colors: ['#3E5C76', '#2C3E50'], icon: '★' },
  { brand: 'FOKKA', name: "Men's Hair Clay",              colors: ['#283747', '#1C2833'], icon: '◆' },
  { brand: 'FOKKA', name: "Men's Beard Oil",              colors: ['#5D6D7E', '#283747'], icon: '●' },

  // PIJAR NALA (Anak) - Soft Yellow & Mint
  { brand: 'PIJAR NALA', name: 'Kids Gentle Wash',        colors: ['#B8E6C8', '#89D4B8'], icon: '✿' },
  { brand: 'PIJAR NALA', name: 'Baby Lotion Calm',        colors: ['#FFEAA7', '#B8E6C8'], icon: '❀' },
  { brand: 'PIJAR NALA', name: 'Kids Shampoo',            colors: ['#FFD6A5', '#89D4B8'], icon: '✦' },
  { brand: 'PIJAR NALA', name: 'Baby Oil',                colors: ['#FFEAA7', '#FFD6A5'], icon: '✧' },
  { brand: 'PIJAR NALA', name: 'Kids Sunscreen',          colors: ['#FFD6A5', '#B8E6C8'], icon: '☀' },
  { brand: 'PIJAR NALA', name: 'Baby Wipes',              colors: ['#E8F5E9', '#B8E6C8'], icon: '❁' },
  { brand: 'PIJAR NALA', name: 'Diaper Cream',            colors: ['#FFF3E0', '#FFEAA7'], icon: '✤' },
  { brand: 'PIJAR NALA', name: 'Baby Powder',             colors: ['#E8F5E9', '#C8E6C9'], icon: '✿' },

  // Hero slides
  { brand: 'HERO', name: 'BLISERA',           colors: ['#E8A0BF', '#D4729A'], icon: '♕' },
  { brand: 'HERO', name: 'PIJAR NALA',        colors: ['#FFEAA7', '#89D4B8'], icon: '♕' },
  { brand: 'HERO', name: 'FOKKA',             colors: ['#2C3E50', '#1A252F'], icon: '♕' },
];

for (const item of items) {
  const filename = `${item.brand.toLowerCase()}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.svg`;
  if (item.brand === 'HERO') {
    writeFileSync(join(outputDir, `hero-${item.name.toLowerCase()}.svg`), gradientSvg(item.name, item.name, item.colors, item.icon));
  } else {
    writeFileSync(join(outputDir, filename), gradientSvg(item.brand, item.name, item.colors, item.icon));
  }
}

console.log(`Generated ${items.length} placeholder SVGs in ${outputDir}`);
