const fs = require('fs');
const bcrypt = require('bcryptjs');

// Read the TS file, strip types to make it plain JS
const tsCode = fs.readFileSync('data/products.ts', 'utf8');
const jsCode = tsCode.replace(/export const PRODUCTS: Product\[\] =/g, 'const PRODUCTS =');

// We'll eval it safely by defining the Product type as undefined
const evalCode = `
  ${jsCode.replace(/export type Product = .*?;/g, '')}
  module.exports = PRODUCTS;
`;

fs.writeFileSync('scripts/temp.js', evalCode);
const PRODUCTS = require('./temp.js');
fs.unlinkSync('scripts/temp.js');

let sql = `-- Seed Admin User
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('admin@scentsbydajaab.com', '$2b$10$hv5nhtqg3qW1VUwa5ot/BuoPVyO4i1WYZEiLq9sWXff1H4Efm1u0a', 'Admin', 'owner');

-- Seed Settings
INSERT INTO settings (store_name, phone, email, address, pickup_hours, cashapp_tag, paypal_email, gift_charge, instagram_url, facebook_url)
VALUES ('Scents by DajaaB', '901-921-2322', 'scentsbydajaab@gmail.com', 'Memphis, TN', '[{"day":"Mon","open":"10:00 AM","close":"6:00 PM"},{"day":"Tue","open":"10:00 AM","close":"6:00 PM"}]', '$DajaaB', 'dajaa@example.com', 10, 'https://instagram.com/scentsbydajaab', 'https://facebook.com/scentsbydajaab');

-- Seed Products
`;

for (const p of PRODUCTS) {
  const sizes = [
    { size: '3.4 oz / 100ml', price: p.price },
    { size: '1.7 oz / 50ml', price: p.price - 40 > 0 ? p.price - 40 : p.price }
  ];

  const escapeStr = (str) => {
    if (!str) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
  };

  sql += `INSERT INTO products (slug, name, brand, price, tier, for_gender, description, blurb, sizes, images, main_image, in_stock, stock_count, featured) VALUES (
    ${escapeStr(p.slug)},
    ${escapeStr(p.name)},
    ${escapeStr(p.brand)},
    ${p.price},
    ${escapeStr(p.tier)},
    ${escapeStr(p.gender)},
    ${escapeStr(p.desc)},
    ${escapeStr(p.blurb)},
    '${JSON.stringify(sizes).replace(/'/g, "''")}',
    ARRAY[${p.images.map(i => escapeStr(i)).join(', ')}],
    ${escapeStr(p.mainImage)},
    ${p.inStock ?? true},
    ${p.stockCount ?? 10},
    ${p.featured ?? false}
  );\n`;
}

fs.writeFileSync('seed.sql', sql);
console.log('Created seed.sql');
