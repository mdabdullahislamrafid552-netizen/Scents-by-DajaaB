/**
 * setup-product-images.mjs
 *
 * 1. Removes the old flat /public/products/*.jpg hardlinks
 * 2. Creates /public/products/[slug]/ subdirectories
 * 3. Hardlinks every image from the source archive into those subfolders,
 *    renaming them 1.jpeg, 2.jpeg, … for URL-safe paths
 * 4. Writes data/image-manifest.json  → slug → string[]  (web-root paths)
 *
 * Run once:  node scripts/setup-product-images.mjs
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const DEST_BASE  = path.join(ROOT, 'public', 'products');
const MANIFEST   = path.join(ROOT, 'data', 'image-manifest.json');

const SOURCE_BASE = 'C:/Users/rafid/Downloads/Compressed/image-20260520T144940Z-3-001/perfume-images';

// ── Slug → relative path inside SOURCE_BASE ──────────────────────────────────
const SLUG_TO_SRC = {
  // PREMIUM
  'creed-aventus':               'PREMIUM/1. Creed — Aventus (Men_s, iconic luxury)',
  'creed-silver-mountain-water': 'PREMIUM/2. Creed — Silver Mountain Water (Unisex)',
  'creed-royal-oud':             'PREMIUM/3. Creed — Royal Oud (Unisex)',
  'creed-love-in-white':         'PREMIUM/4 Creed — Love In White (Women_s)',
  'creed-spring-flower':         'PREMIUM/5. Creed — Spring Flower (Women_s)',
  'baccarat-rouge-540':          'PREMIUM/6. Maison Francis Kurkdjian — Baccarat Rouge 540 EDP (Unisex)',
  'baccarat-rouge-540-extrait':  'PREMIUM/7. Maison Francis Kurkdjian — Baccarat Rouge 540 Extrait (Unisex)',
  'mfk-a-la-rose':               'PREMIUM/8. Maison Francis Kurkdjian — À La Rose (Women_s)',
  'mfk-grand-soir':              'PREMIUM/9. Maison Francis Kurkdjian — Grand Soir  Gentle Fluidity',
  'clive-christian-no1':         'PREMIUM/10. Clive Christian — No. 1 (Luxury Unisex',
  'initio-oud-greatness':        'PREMIUM/11. Initio — Oud For Greatness (Unisex)',
  'initio-side-effect':          'PREMIUM/12. Initio — Side Effect',
  'initio-rehab':                'PREMIUM/13. Initio  Rehab  Magnetic Blend',

  // WOMEN'S DESIGNER
  'ch-good-girl-very-good-girl': 'WOMEN S DESIGNER/14. Carolina Herrera — Good Girl Very Good Girl',
  'ch-good-girl-blush':          'WOMEN S DESIGNER/15. Carolina Herrera — Good Girl Blush',
  'ch-good-girl':                'WOMEN S DESIGNER/16. Carolina Herrera — Good Girl (Original)',
  'versace-bright-crystal':      'WOMEN S DESIGNER/17. Versace — Bright Crystal',
  'versace-eros-femme':          'WOMEN S DESIGNER/18. Versace — Eros Pour Femme',
  'dior-jadore':                 'WOMEN S DESIGNER/19. Dior — J_adore',
  'dior-miss-dior-blooming':     'WOMEN S DESIGNER/20. Dior — Miss Dior Blooming Bouquet',
  'chanel-coco-mademoiselle':    'WOMEN S DESIGNER/21. Chanel — Coco Mademoiselle',
  'chanel-chance':               'WOMEN S DESIGNER/22. Chanel — Chance',
  'prada-paradoxe':              'WOMEN S DESIGNER/23. Prada — Paradoxe',
  'valentino-donna-pink':        'WOMEN S DESIGNER/24. Valentino — Donna Born In Roma (Pink)',
  'valentino-donna-intense':     'WOMEN S DESIGNER/25. Valentino — Donna Born In Roma Intense',
  'valentino-donna-green':       'WOMEN S DESIGNER/26. Valentino — Donna Born In Roma Green Stravaganza',
  'gucci-flora-gardenia':        'WOMEN S DESIGNER/27. Gucci — Flora Gorgeous Gardenia',
  'ysl-libre-edp':               'WOMEN S DESIGNER/28. YSL — Libre',
  'ysl-mon-paris':               'WOMEN S DESIGNER/29. YSL — Mon Paris  Myself',
  'tom-ford-vanilla-sex':        'WOMEN S DESIGNER/30. Tom Ford — Vanilla Sex',
  'dg-light-blue':               'WOMEN S DESIGNER/31. Dolce & Gabbana — Light Blue',
  'pr-lady-million':             'WOMEN S DESIGNER/32. Paco Rabanne — Million  Lady Million',

  // MEN'S DESIGNER
  'chanel-bleu-de-chanel':       "MEN_S DESIGNER/33. Chanel — Bleu De Chanel",
  'chanel-allure-homme':         "MEN_S DESIGNER/34. Chanel — Allure Homme Sport Cologne",
  'dior-sauvage':                "MEN_S DESIGNER/35. Dior — Sauvage",
  'versace-eros':                "MEN_S DESIGNER/36. Versace — Eros",
  'versace-eros-flame':          "MEN_S DESIGNER/37. Versace — Eros Flame",
  'ysl-y-edp':                   "MEN_S DESIGNER/38. YSL — Y For Men",
  'valentino-uomo':              "MEN_S DESIGNER/39. Valentino — Uomo Born In Roma",
  'armani-acqua-di-gio':         "MEN_S DESIGNER/40. Giorgio Armani — Acqua Di Giò",
  'issey-miyake':                "MEN_S DESIGNER/41. Issey Miyake — L_Eau D_Issey Pour Homme",
  'prada-lhomme':                "MEN_S DESIGNER/42. Prada — L_Homme L_Eau  Ocean",
  'tom-ford-ombre-leather':      "MEN_S DESIGNER/43. Tom Ford — Ombré Leather",
  'tom-ford-tuscan-leather':     "MEN_S DESIGNER/44. Tom Ford — Tuscan Leather",
  'tom-ford-fucking-fabulous':   "MEN_S DESIGNER/45. Tom Ford — Fucking Fabulous",
  'pr-1-million-royal':          "MEN_S DESIGNER/46. Paco Rabanne — 1 Million Royal",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function imageFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort();                          // deterministic order
}

function removeOldFlats() {
  // Remove the old single-file hardlinks (slug.jpg) that sit directly in DEST_BASE
  for (const f of fs.readdirSync(DEST_BASE)) {
    const full = path.join(DEST_BASE, f);
    if (fs.statSync(full).isFile()) {
      fs.unlinkSync(full);
      console.log(`  removed flat file: ${f}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log('\n=== Setting up per-product image folders ===\n');

removeOldFlats();

const manifest = {};      // slug → ["/products/slug/1.jpeg", …]
let totalLinked = 0;
let totalFailed  = 0;

for (const [slug, srcRel] of Object.entries(SLUG_TO_SRC)) {
  const srcDir  = path.join(SOURCE_BASE, srcRel);
  const destDir = path.join(DEST_BASE, slug);

  if (!fs.existsSync(srcDir)) {
    console.error(`  [MISSING] source not found for ${slug}: ${srcDir}`);
    totalFailed++;
    continue;
  }

  // (re-)create destination subfolder
  fs.mkdirSync(destDir, { recursive: true });

  const files  = imageFiles(srcDir);
  const webPaths = [];

  files.forEach((file, idx) => {
    const ext      = path.extname(file).toLowerCase();          // .jpeg / .jpg
    const destName = `${idx + 1}${ext}`;                       // 1.jpeg, 2.jpeg …
    const srcPath  = path.join(srcDir, file);
    const destPath = path.join(destDir, destName);

    // Remove existing so we can safely hardlink
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);

    try {
      fs.linkSync(srcPath, destPath);
      webPaths.push(`/products/${slug}/${destName}`);
      totalLinked++;
    } catch (e) {
      // Hardlink across volumes fails — fall back to copy
      fs.copyFileSync(srcPath, destPath);
      webPaths.push(`/products/${slug}/${destName}`);
      totalLinked++;
      console.warn(`  [COPY fallback] ${slug}/${destName}`);
    }
  });

  manifest[slug] = webPaths;
  console.log(`  ✓  ${slug}  (${webPaths.length} image${webPaths.length > 1 ? 's' : ''})`);
}

// Write manifest
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`\n✅  Done — ${totalLinked} images linked, ${totalFailed} failed`);
console.log(`   Manifest → data/image-manifest.json\n`);
