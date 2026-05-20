import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/rafid/Pictures/images';
const DEST = 'C:/Users/rafid/Desktop/Scents_By_DajaaB/scents-app/public/products';

fs.mkdirSync(DEST, { recursive: true });

// Map: destination slug → source folder (relative to SRC)
const MAP = [
  ['creed-aventus',              "PREMIUM/1. Creed — Aventus (Men's, iconic luxury)"],
  ['creed-silver-mountain-water',"PREMIUM/2. Creed — Silver Mountain Water (Unisex)"],
  ['creed-royal-oud',            "PREMIUM/3. Creed — Royal Oud (Unisex)"],
  ['creed-love-in-white',        "PREMIUM/4 Creed — Love In White (Women's)"],
  ['creed-spring-flower',        "PREMIUM/5. Creed — Spring Flower (Women's)"],
  ['baccarat-rouge-540',         "PREMIUM/6. Maison Francis Kurkdjian — Baccarat Rouge 540 EDP (Unisex)"],
  ['baccarat-rouge-540-extrait', "PREMIUM/7. Maison Francis Kurkdjian — Baccarat Rouge 540 Extrait (Unisex)"],
  ['mfk-a-la-rose',              "PREMIUM/8. Maison Francis Kurkdjian — À La Rose (Women's)"],
  ['mfk-grand-soir',             "PREMIUM/9. Maison Francis Kurkdjian — Grand Soir  Gentle Fluidity"],
  ['clive-christian-no1',        "PREMIUM/10. Clive Christian — No. 1 (Luxury Unisex"],
  ['initio-oud-greatness',       "PREMIUM/11. Initio — Oud For Greatness (Unisex)"],
  ['initio-side-effect',         "PREMIUM/12. Initio — Side Effect"],
  ['initio-rehab',               "PREMIUM/13. Initio  Rehab  Magnetic Blend"],
  ['ch-good-girl-very-good-girl',"WOMEN S DESIGNER/14. Carolina Herrera — Good Girl Very Good Girl"],
  ['ch-good-girl-blush',         "WOMEN S DESIGNER/15. Carolina Herrera — Good Girl Blush"],
  ['ch-good-girl',               "WOMEN S DESIGNER/16. Carolina Herrera — Good Girl (Original)"],
  ['versace-bright-crystal',     "WOMEN S DESIGNER/17. Versace — Bright Crystal"],
  ['versace-eros-femme',         "WOMEN S DESIGNER/18. Versace — Eros Pour Femme"],
  ['dior-jadore',                "WOMEN S DESIGNER/19. Dior — J'adore"],
  ['dior-miss-dior-blooming',    "WOMEN S DESIGNER/20. Dior — Miss Dior Blooming Bouquet"],
  ['chanel-coco-mademoiselle',   "WOMEN S DESIGNER/21. Chanel — Coco Mademoiselle"],
  ['chanel-chance',              "WOMEN S DESIGNER/22. Chanel — Chance"],
  ['prada-paradoxe',             "WOMEN S DESIGNER/23. Prada — Paradoxe"],
  ['valentino-donna-pink',       "WOMEN S DESIGNER/24. Valentino — Donna Born In Roma (Pink)"],
  ['valentino-donna-intense',    "WOMEN S DESIGNER/25. Valentino — Donna Born In Roma Intense"],
  ['valentino-donna-green',      "WOMEN S DESIGNER/26. Valentino — Donna Born In Roma Green Stravaganza"],
  ['gucci-flora-gardenia',       "WOMEN S DESIGNER/27. Gucci — Flora Gorgeous Gardenia"],
  ['ysl-libre-edp',              "WOMEN S DESIGNER/28. YSL — Libre"],
  ['ysl-mon-paris',              "WOMEN S DESIGNER/29. YSL — Mon Paris  Myself"],
  ['tom-ford-vanilla-sex',       "WOMEN S DESIGNER/30. Tom Ford — Vanilla Sex"],
  ['dg-light-blue',              "WOMEN S DESIGNER/31. Dolce & Gabbana — Light Blue"],
  ['pr-lady-million',            "WOMEN S DESIGNER/32. Paco Rabanne — Million  Lady Million"],
  ['chanel-bleu-de-chanel',      "MEN'S DESIGNER/33. Chanel — Bleu De Chanel"],
  ['chanel-allure-homme',        "MEN'S DESIGNER/34. Chanel — Allure Homme Sport Cologne"],
  ['dior-sauvage',               "MEN'S DESIGNER/35. Dior — Sauvage"],
  ['versace-eros',               "MEN'S DESIGNER/36. Versace — Eros"],
  ['versace-eros-flame',         "MEN'S DESIGNER/37. Versace — Eros Flame"],
  ['ysl-y-edp',                  "MEN'S DESIGNER/38. YSL — Y For Men"],
  ['valentino-uomo',             "MEN'S DESIGNER/39. Valentino — Uomo Born In Roma"],
  ['armani-acqua-di-gio',        "MEN'S DESIGNER/40. Giorgio Armani — Acqua Di Giò"],
  ['issey-miyake',               "MEN'S DESIGNER/41. Issey Miyake — L'Eau D'Issey Pour Homme"],
  ['prada-lhomme',               "MEN'S DESIGNER/42. Prada — L'Homme L'Eau  Ocean"],
  ['tom-ford-ombre-leather',     "MEN'S DESIGNER/43. Tom Ford — Ombré Leather"],
  ['tom-ford-tuscan-leather',    "MEN'S DESIGNER/44. Tom Ford — Tuscan Leather"],
  ['tom-ford-fucking-fabulous',  "MEN'S DESIGNER/45. Tom Ford — Fucking Fabulous"],
  ['pr-1-million-royal',         "MEN'S DESIGNER/46. Paco Rabanne — 1 Million Royal"],
];

let ok = 0, fail = 0;
for (const [slug, folder] of MAP) {
  const dir = path.join(SRC, folder);
  let files;
  try { files = fs.readdirSync(dir).filter(f => /\.(jpeg|jpg|png)$/i.test(f)).sort(); }
  catch { console.error(`❌ Missing dir: ${folder}`); fail++; continue; }

  if (!files.length) { console.error(`❌ No images in: ${folder}`); fail++; continue; }

  // Pick the first image (the hero shot without "(1)" suffix)
  const hero = files.find(f => !f.includes('(')) || files[0];
  const src = path.join(dir, hero);
  const dest = path.join(DEST, `${slug}.jpg`);
  fs.copyFileSync(src, dest);
  console.log(`✓ ${slug}.jpg`);
  ok++;
}

console.log(`\nDone: ${ok} copied, ${fail} failed`);
