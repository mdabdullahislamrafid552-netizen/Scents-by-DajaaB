-- Scents by DajaaB Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  tier TEXT NOT NULL, -- niche/womens/mens
  for_gender TEXT NOT NULL, -- women/men/unisex
  description TEXT,
  blurb TEXT,
  sizes JSONB DEFAULT '[]'::jsonb, -- [{size: "50ml", price: 60}]
  images TEXT[] DEFAULT '{}',
  main_image TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL, -- [{product_id, name, size, quantity, price}]
  subtotal NUMERIC NOT NULL,
  gift_charge NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- cash/cashapp/paypal
  status TEXT DEFAULT 'pending', -- pending/ready/completed/cancelled
  pickup_address JSONB, -- {street, city, state, zip}
  recipient_address JSONB, -- for gift orders
  is_gift BOOLEAN DEFAULT false,
  desired_pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  saved_address JSONB,
  total_spent NUMERIC DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings Table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT DEFAULT 'Scents by DajaaB',
  phone TEXT,
  email TEXT,
  address TEXT,
  pickup_hours JSONB DEFAULT '[]'::jsonb, -- [{day, open, close}]
  cashapp_tag TEXT,
  paypal_email TEXT,
  gift_charge NUMERIC DEFAULT 10,
  instagram_url TEXT,
  facebook_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
