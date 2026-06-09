"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv = __importStar(require("dotenv"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var products_1 = require("../data/products");
// Load .env.local
dotenv.config({ path: '.env.local' });
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Should ideally use service_role key for bypassing RLS, but for initial seeding anon might work if RLS is off
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var settingsError, salt, passwordHash, adminError, _i, PRODUCTS_1, product, _a, id, family, shape, liquidColor, capColor, label, topNotes, middleNotes, baseNotes, prodData, sizes, prodError;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('Seeding database...');
                    // 1. Seed Settings
                    console.log('Seeding settings...');
                    return [4 /*yield*/, supabase.from('settings').insert([
                            {
                                store_name: 'Scents by DajaaB',
                                phone: '901-921-2322',
                                email: 'scentsbydajaab@gmail.com',
                                address: 'Memphis, TN',
                                pickup_hours: JSON.stringify([
                                    { day: 'Mon', open: '10:00 AM', close: '6:00 PM' },
                                    { day: 'Tue', open: '10:00 AM', close: '6:00 PM' }
                                ]),
                                cashapp_tag: '$DajaaB',
                                paypal_email: 'dajaa@example.com',
                                gift_charge: 10,
                                instagram_url: 'https://instagram.com/scentsbydajaab',
                                facebook_url: 'https://facebook.com/scentsbydajaab'
                            }
                        ])];
                case 1:
                    settingsError = (_e.sent()).error;
                    if (settingsError)
                        console.error('Error seeding settings:', settingsError);
                    // 2. Seed Admin User
                    console.log('Seeding admin user...');
                    return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
                case 2:
                    salt = _e.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('Admin123', salt)];
                case 3:
                    passwordHash = _e.sent();
                    return [4 /*yield*/, supabase.from('admin_users').insert([
                            {
                                email: 'admin@scentsbydajaab.com',
                                password_hash: passwordHash,
                                name: 'Admin',
                                role: 'owner'
                            }
                        ])];
                case 4:
                    adminError = (_e.sent()).error;
                    if (adminError)
                        console.error('Error seeding admin user:', adminError);
                    // 3. Seed Products
                    console.log('Seeding products...');
                    _i = 0, PRODUCTS_1 = products_1.PRODUCTS;
                    _e.label = 5;
                case 5:
                    if (!(_i < PRODUCTS_1.length)) return [3 /*break*/, 8];
                    product = PRODUCTS_1[_i];
                    _a = product, id = _a.id, family = _a.family, shape = _a.shape, liquidColor = _a.liquidColor, capColor = _a.capColor, label = _a.label, topNotes = _a.topNotes, middleNotes = _a.middleNotes, baseNotes = _a.baseNotes, prodData = __rest(_a, ["id", "family", "shape", "liquidColor", "capColor", "label", "topNotes", "middleNotes", "baseNotes"]);
                    sizes = [
                        { size: '3.4 oz / 100ml', price: prodData.price },
                        { size: '1.7 oz / 50ml', price: prodData.price - 40 > 0 ? prodData.price - 40 : prodData.price }
                    ];
                    return [4 /*yield*/, supabase.from('products').insert([
                            {
                                slug: prodData.slug,
                                name: prodData.name,
                                brand: prodData.brand,
                                price: prodData.price,
                                tier: prodData.tier,
                                for_gender: prodData.gender,
                                description: prodData.desc,
                                blurb: prodData.blurb,
                                sizes: JSON.stringify(sizes),
                                images: prodData.images,
                                main_image: prodData.mainImage,
                                in_stock: (_b = prodData.inStock) !== null && _b !== void 0 ? _b : true,
                                stock_count: (_c = prodData.stockCount) !== null && _c !== void 0 ? _c : 10,
                                featured: (_d = prodData.featured) !== null && _d !== void 0 ? _d : false
                            }
                        ])];
                case 6:
                    prodError = (_e.sent()).error;
                    if (prodError) {
                        console.error("Error seeding product ".concat(prodData.name, ":"), prodError);
                    }
                    _e.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log('Seeding complete!');
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(console.error);
