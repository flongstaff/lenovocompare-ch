-- Seed prices generated from data/seed-prices.ts
-- Run: wrangler d1 execute lenovocompare-prices --file seeds/seed-prices.sql --local

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-1', 'x1-carbon-gen13', 'Digitec', 2349.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-2', 'x1-carbon-gen13', 'Lenovo CH', 2599.0, 'msrp', 'https://www.lenovo.com/ch/de', NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-3', 'x1-carbon-gen13', 'Brack', 2399.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-4', 't14s-gen6-amd', 'Digitec', 1849.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-5', 't14s-gen6-amd', 'Brack', 1899.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-6', 't14s-gen6-intel', 'Digitec', 1749.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-7', 't14s-gen6-intel', 'Lenovo CH', 1949.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-8', 't14-gen6-intel', 'Digitec', 1349.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-9', 't14-gen6-intel', 'Brack', 1399.0, 'retail', NULL, NULL, '2025-02-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-10', 't14-gen6-amd', 'Digitec', 1299.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-11', 't14-gen6-amd', 'Brack', 1329.0, 'retail', NULL, NULL, '2025-02-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-12', 'x1-carbon-gen12', 'Digitec', 2149.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-13', 'x1-carbon-gen12', 'Lenovo CH', 2399.0, 'msrp', 'https://www.lenovo.com/ch/de', NULL, '2024-11-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-14', 'x1-carbon-gen12', 'Digitec', 1899.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-15', 'x1-yoga-gen9', 'Digitec', 2549.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-16', 'x1-yoga-gen9', 'Lenovo CH', 2799.0, 'msrp', NULL, NULL, '2024-11-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-17', 'x1-yoga-gen9', 'Digitec', 2299.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-18', 'x1-nano-gen3', 'Digitec', 1899.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-19', 'x1-nano-gen3', 'Brack', 1699.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-20', 'x1-2in1-gen9', 'Digitec', 2749.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-21', 'x1-2in1-gen9', 'Lenovo CH', 2999.0, 'msrp', NULL, NULL, '2025-01-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-22', 't14s-gen5-intel', 'Digitec', 1649.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-23', 't14s-gen5-intel', 'Brack', 1689.0, 'retail', NULL, NULL, '2024-11-14', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-24', 't14s-gen5-intel', 'Digitec', 1449.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-25', 't14s-gen5-amd', 'Digitec', 1749.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-26', 't14s-gen5-amd', 'Toppreise', 1699.0, 'retail', NULL, NULL, '2024-11-13', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-27', 't14s-gen5-amd', 'Digitec', 1549.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-28', 't14-gen5-intel', 'Digitec', 1149.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-29', 't14-gen5-intel', 'Digitec', 999.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-30', 't14-gen5-amd', 'Digitec', 1099.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-31', 't14-gen5-amd', 'Interdiscount', 1129.0, 'retail', NULL, NULL, '2024-11-12', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-32', 't14-gen5-amd', 'Brack', 949.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-33', 't16-gen3-intel', 'Digitec', 1449.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-34', 't16-gen3-intel', 'Digitec', 1299.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-35', 'p16s-gen3-intel', 'Digitec', 1899.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-36', 'p16s-gen3-intel', 'Lenovo CH', 2099.0, 'msrp', NULL, NULL, '2024-11-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-37', 'p14s-gen5-intel', 'Digitec', 2099.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-38', 'p14s-gen5-intel', 'Digitec', 1899.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-39', 'p1-gen7', 'Digitec', 3499.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-40', 'p1-gen7', 'Lenovo CH', 3899.0, 'msrp', NULL, NULL, '2024-11-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-41', 'p1-gen7', 'Digitec', 3199.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-42', 'l14-gen5-intel', 'Digitec', 899.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-43', 'l14-gen5-intel', 'Brack', 799.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-44', 'l14-gen5-amd', 'Digitec', 749.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-45', 'l14-gen5-amd', 'Brack', 779.0, 'retail', NULL, NULL, '2024-11-14', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-46', 'l16-gen3-intel', 'Digitec', 999.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-47', 'l16-gen3-intel', 'Brack', 879.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-48', 'e14-gen6-intel', 'Digitec', 849.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-49', 'e14-gen6-intel', 'Interdiscount', 879.0, 'retail', NULL, NULL, '2024-11-11', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-50', 'e14-gen6-intel', 'Digitec', 749.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-51', 'e16-gen2-amd', 'Digitec', 799.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-52', 'e16-gen2-amd', 'Interdiscount', 699.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-53', 'x13-gen5', 'Digitec', 1549.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-54', 'x13-gen5', 'Brack', 1399.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-55', 'x1-carbon-gen11', 'Digitec', 1599.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-56', 'x1-carbon-gen11', 'Brack', 1649.0, 'retail', NULL, NULL, '2024-11-14', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-57', 'x1-carbon-gen11', 'Digitec', 1399.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-58', 'x1-yoga-gen8', 'Digitec', 1799.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-59', 'x1-yoga-gen8', 'Brack', 1549.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-60', 'x13-gen4-intel', 'Digitec', 1399.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-61', 'x13-gen4-intel', 'Digitec', 1199.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-62', 't14s-gen4-intel', 'Digitec', 1349.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-63', 't14s-gen4-intel', 'Brack', 1149.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-64', 't14s-gen4-amd', 'Digitec', 1299.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-65', 't14s-gen4-amd', 'Digitec', 1099.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-66', 't14-gen4-intel', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-67', 't14-gen4-intel', 'Digitec', 849.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-68', 't14-gen4-amd', 'Digitec', 949.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-69', 't14-gen4-amd', 'Brack', 799.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-70', 't16-gen2-intel', 'Digitec', 1249.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-71', 't16-gen2-intel', 'Digitec', 1049.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-72', 'l14-gen4-intel', 'Digitec', 749.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-73', 'l14-gen4-intel', 'Brack', 649.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-74', 'e14-gen5', 'Digitec', 699.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-75', 'e14-gen5', 'Digitec', 599.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-76', 'p14s-gen4', 'Digitec', 1699.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-77', 'p14s-gen4', 'Digitec', 1499.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-78', 'p16s-gen2', 'Digitec', 1599.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-79', 'p16s-gen2', 'Brack', 1399.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-80', 'p16-gen2', 'Digitec', 4299.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-81', 'p16-gen2', 'Lenovo CH', 4699.0, 'msrp', NULL, NULL, '2024-11-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-82', 'p16-gen2', 'Digitec', 3899.0, 'sale', NULL, 'Digitec Galaxus Days 2024', '2024-06-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-83', 'x1-carbon-gen10', 'Digitec', 1299.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-84', 'x1-carbon-gen10', 'Brack', 1349.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-85', 'x1-carbon-gen10', 'Digitec', 1099.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-86', 'x1-yoga-gen7', 'Digitec', 1399.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-87', 'x1-yoga-gen7', 'Brack', 1149.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-88', 'x1-nano-gen2', 'Digitec', 1249.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-89', 'x1-nano-gen2', 'Digitec', 999.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-90', 't14s-gen3-intel', 'Digitec', 1099.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-91', 't14s-gen3-intel', 'Digitec', 899.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-92', 't14s-gen3-amd', 'Digitec', 1049.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-93', 't14s-gen3-amd', 'Brack', 849.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-94', 't14-gen3-intel', 'Digitec', 849.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-95', 't14-gen3-intel', 'Digitec', 699.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-96', 't14-gen3-amd', 'Digitec', 799.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-97', 't14-gen3-amd', 'Brack', 649.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-98', 't16-gen1-intel', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-99', 't16-gen1-intel', 'Digitec', 849.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-100', 'l14-gen3-intel', 'Digitec', 599.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-101', 'l14-gen3-intel', 'Brack', 499.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-102', 'e14-gen4', 'Digitec', 549.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-103', 'e14-gen4', 'Digitec', 449.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-104', 't480', 'Digitec', 399.0, 'used', NULL, 'Refurbished', '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-105', 't480', 'Ricardo', 299.0, 'used', NULL, NULL, '2024-09-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-106', 't480s', 'Digitec', 349.0, 'used', NULL, 'Refurbished', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-107', 't480s', 'Ricardo', 279.0, 'used', NULL, NULL, '2024-10-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-108', 'x1-2in1-gen10', 'Digitec', 2699.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-109', 'x1-2in1-gen10', 'Lenovo CH', 2949.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-110', 'l13-2in1-gen6-intel', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-111', 'l13-2in1-gen6-intel', 'Lenovo CH', 1149.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-112', 'l13-2in1-gen6-amd', 'Digitec', 949.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-113', 'l13-2in1-gen6-amd', 'Brack', 979.0, 'retail', NULL, NULL, '2025-02-10', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-114', 'l13-2in1-gen5-intel', 'Digitec', 899.0, 'retail', NULL, NULL, '2024-11-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-115', 'l13-2in1-gen5-intel', 'Brack', 849.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-116', 'x13-yoga-gen4', 'Digitec', 1299.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-117', 'x13-yoga-gen4', 'Brack', 1099.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-118', 'l13-yoga-gen4-intel', 'Digitec', 799.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-119', 'l13-yoga-gen4-intel', 'Brack', 699.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-120', 'l13-yoga-gen4-amd', 'Digitec', 749.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-121', 'l13-yoga-gen4-amd', 'Brack', 649.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-122', 'x13-yoga-gen3', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-123', 'x13-yoga-gen3', 'Brack', 849.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-124', 'l13-yoga-gen3-intel', 'Digitec', 649.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-125', 'l13-yoga-gen3-intel', 'Brack', 549.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-126', 'l13-yoga-gen3-amd', 'Digitec', 599.0, 'retail', NULL, NULL, '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-127', 'l13-yoga-gen3-amd', 'Brack', 499.0, 'sale', NULL, 'Black Friday 2024', '2024-11-29', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-128', 'x1-yoga-gen6', 'Digitec', 799.0, 'used', NULL, 'Refurbished', '2025-02-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-129', 'x1-yoga-gen6', 'Ricardo', 599.0, 'used', NULL, NULL, '2024-10-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-130', 'x1-titanium-yoga', 'Ricardo', 699.0, 'used', NULL, NULL, '2024-11-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-131', 'x1-titanium-yoga', 'Tutti', 549.0, 'used', NULL, NULL, '2024-09-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-132', 'x13-yoga-gen2', 'Ricardo', 449.0, 'used', NULL, NULL, '2024-10-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-133', 'x13-yoga-gen2', 'Tutti', 399.0, 'used', NULL, NULL, '2024-09-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-134', 'l13-yoga-gen2-intel', 'Ricardo', 299.0, 'used', NULL, NULL, '2024-10-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-135', 'l13-yoga-gen2-intel', 'Tutti', 249.0, 'used', NULL, NULL, '2024-08-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-136', 'l13-yoga-gen2-amd', 'Ricardo', 279.0, 'used', NULL, NULL, '2024-10-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-137', 'l13-yoga-gen2-amd', 'Tutti', 229.0, 'used', NULL, NULL, '2024-09-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-138', 'x1-yoga-gen5', 'Ricardo', 499.0, 'used', NULL, NULL, '2024-09-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-139', 'x1-yoga-gen5', 'Tutti', 449.0, 'used', NULL, NULL, '2024-08-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-140', 'x13-yoga-gen1', 'Ricardo', 299.0, 'used', NULL, NULL, '2024-09-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-141', 'x13-yoga-gen1', 'Tutti', 249.0, 'used', NULL, NULL, '2024-08-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-142', 'x1-yoga-4th', 'Ricardo', 399.0, 'used', NULL, NULL, '2024-08-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-143', 'x1-yoga-4th', 'Tutti', 349.0, 'used', NULL, NULL, '2024-07-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-144', 'l13-yoga-gen1', 'Ricardo', 199.0, 'used', NULL, NULL, '2024-08-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-145', 'l13-yoga-gen1', 'Tutti', 179.0, 'used', NULL, NULL, '2024-07-15', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-146', 'x1-yoga-3rd', 'Ricardo', 299.0, 'used', NULL, NULL, '2024-08-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-147', 'x1-yoga-3rd', 'Tutti', 249.0, 'used', NULL, NULL, '2024-07-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-148', 'ideapad-pro-5-14-gen9-amd', 'Digitec', 1249.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-149', 'ideapad-pro-5-14-gen9-amd', 'Lenovo CH', 1299.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-150', 'ideapad-pro-5-16-gen9-amd', 'Digitec', 1299.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-151', 'ideapad-pro-5-16-gen9-amd', 'Lenovo CH', 1349.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-152', 'ideapad-pro-5i-14-gen9', 'Digitec', 1349.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-153', 'ideapad-pro-5i-14-gen9', 'Lenovo CH', 1399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-154', 'ideapad-pro-5i-16-gen9', 'Digitec', 1399.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-155', 'ideapad-pro-5i-16-gen9', 'Lenovo CH', 1449.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-156', 'ideapad-pro-5-14-gen8-amd', 'Digitec', 1049.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-157', 'ideapad-pro-5-14-gen8-amd', 'Lenovo CH', 1099.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-158', 'ideapad-pro-5-16-gen8-amd', 'Digitec', 1099.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-159', 'ideapad-pro-5-16-gen8-amd', 'Lenovo CH', 1149.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-160', 'ideapad-pro-5i-14-gen8', 'Digitec', 1149.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-161', 'ideapad-pro-5i-14-gen8', 'Lenovo CH', 1199.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-162', 'ideapad-pro-5i-16-gen8', 'Digitec', 1199.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-163', 'ideapad-pro-5i-16-gen8', 'Lenovo CH', 1249.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-164', 'ideapad-pro-5-14-gen10-amd', 'Digitec', 1349.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-165', 'ideapad-pro-5-14-gen10-amd', 'Lenovo CH', 1399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-166', 'ideapad-pro-5-16-gen10-amd', 'Digitec', 1399.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-167', 'ideapad-pro-5-16-gen10-amd', 'Lenovo CH', 1449.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-168', 'ideapad-pro-5i-14-gen10', 'Digitec', 899.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-169', 'ideapad-pro-5i-14-gen10', 'Lenovo CH', 934.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-170', 'ideapad-pro-5i-16-gen10', 'Digitec', 1499.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-171', 'ideapad-pro-5i-16-gen10', 'Lenovo CH', 1549.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-172', 'ideapad-pro-7-14-gen9', 'Digitec', 1849.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-173', 'ideapad-pro-7-14-gen9', 'Lenovo CH', 1899.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-174', 'ideapad-pro-7-16-gen9', 'Digitec', 1949.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-175', 'ideapad-pro-7-16-gen9', 'Lenovo CH', 1999.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-176', 'legion-5-16-gen9-amd', 'Digitec', 1549.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-177', 'legion-5-16-gen9-amd', 'Lenovo CH', 1799.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-178', 'legion-5i-16-gen9', 'Digitec', 1599.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-179', 'legion-5i-16-gen9', 'Lenovo CH', 1849.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-180', 'legion-7i-16-gen9', 'Digitec', 2199.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-181', 'legion-7i-16-gen9', 'Lenovo CH', 2499.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-182', 'legion-pro-5-16-gen9-amd', 'Digitec', 1899.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-183', 'legion-pro-5-16-gen9-amd', 'Lenovo CH', 2199.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-184', 'legion-pro-5i-16-gen9', 'Digitec', 2099.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-185', 'legion-pro-5i-16-gen9', 'Lenovo CH', 2399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-186', 'legion-slim-5-14-gen9-amd', 'Digitec', 1399.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-187', 'legion-slim-5-14-gen9-amd', 'Lenovo CH', 1599.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-188', 'legion-slim-5-16-gen9-amd', 'Digitec', 1499.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-189', 'legion-slim-5-16-gen9-amd', 'Lenovo CH', 1699.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-190', 'legion-5-15-gen8-amd', 'Digitec', 1199.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-191', 'legion-5-15-gen8-amd', 'Lenovo CH', 1399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-192', 'legion-5i-16-gen8', 'Digitec', 1249.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-193', 'legion-5i-16-gen8', 'Lenovo CH', 1449.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-194', 'legion-pro-5i-16-gen8', 'Digitec', 1699.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-195', 'legion-pro-5i-16-gen8', 'Lenovo CH', 1999.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-196', 'legion-5-15-gen7-amd', 'Digitec', 899.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-197', 'legion-5-15-gen7-amd', 'Lenovo CH', 1099.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-198', 'legion-5i-15-gen7', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-199', 'legion-5i-15-gen7', 'Lenovo CH', 1199.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-200', 'legion-5-15-gen10-amd', 'Digitec', 1699.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-201', 'legion-5-15-gen10-amd', 'Lenovo CH', 1949.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-202', 'legion-5i-15-gen10', 'Digitec', 1749.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-203', 'legion-5i-15-gen10', 'Lenovo CH', 1999.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-204', 'legion-pro-7i-16-gen10', 'Digitec', 2999.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-205', 'legion-pro-7i-16-gen10', 'Lenovo CH', 3399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-206', 'ideapad-pro-5i-14-gen10', 'Lenovo CH', 866.0, 'sale', NULL, 'Web Price -9% (Core Ultra 7 255H config)', '2026-02-20', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-207', 'legion-7i-16-gen10', 'Digitec', 2799.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-208', 'legion-7i-16-gen10', 'Lenovo CH', 2999.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-209', 'legion-pro-5-16-gen10-amd', 'Digitec', 2199.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-210', 'legion-pro-5-16-gen10-amd', 'Lenovo CH', 2399.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-211', 'legion-pro-5i-16-gen10', 'Digitec', 2299.0, 'retail', NULL, NULL, '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-212', 'legion-pro-5i-16-gen10', 'Lenovo CH', 2499.0, 'msrp', NULL, 'Lenovo CH MSRP', '2025-02-05', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-213', 'x1-carbon-gen12', 'Digitec', 1499.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-x1-carbon-gen-12-14-intel-core-ultra-5-125u-32-gb-512-gb-ch-notebooks-44744301', 'Ultra 5 125U / 32GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-214', 'x1-carbon-gen12', 'Lenovo CH', 1127.0, 'msrp', 'https://www.lenovo.com/ch/de/p/laptops/thinkpad/thinkpadx1/thinkpad-x1-carbon-gen-12-14-inch-intel/21kc0056mz', 'Ultra 5 125U / 16GB / 512GB — Lenovo CH direct', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-215', 'x1-carbon-gen12', 'Brack', 1579.0, 'retail', 'https://www.brack.ch/lenovo-notebook-thinkpad-x1-carbon-gen-12-1732495', 'Ultra 7 155H / 32GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-216', 'x1-yoga-gen9', 'Digitec', 2139.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-x1-2-in-1-gen-9-14-1000-gb-32-gb-de-intel-core-ultra-5-125u-notebook-44745273', 'Ultra 7 155U / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-217', 'x1-yoga-gen9', 'Brack', 2190.0, 'retail', 'https://www.brack.ch/lenovo-notebook-thinkpad-x1-2in1-gen-9-intel-1732490', 'Ultra 7 155U / 32GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-218', 't14s-gen5-intel', 'Digitec', 1099.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-t14s-gen-5-14-intel-core-ultra-7-155u-32-gb-512-gb-ch-notebooks-46144658', 'Ultra 7 155U / 32GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-219', 't14s-gen5-intel', 'Brack', 1635.0, 'sale', 'https://www.brack.ch/lenovo-notebook-thinkpad-t14s-gen-5-intel-1732482', 'Ultra 7 155U / 32GB / 1TB — was CHF 1923, -15%', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-220', 't14s-gen5-amd', 'Digitec', 1199.0, 'retail', NULL, 'Ryzen 7 PRO 8840U / 32GB / 1TB — via Toppreise', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-221', 't14-gen5-intel', 'Digitec', 1380.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-t14-gen-5-14-intel-core-ultra-5-125u-16-gb-512-gb-ch-notebooks-46143866', 'Ultra 5 125U / 16GB / 256GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-222', 't14-gen5-intel', 'Brack', 1317.0, 'sale', 'https://www.brack.ch/lenovo-notebook-thinkpad-t14-gen-5-intel-1732475', 'Ultra 5 125U / 16GB / 512GB / 5G — was CHF 1549, -15%', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-223', 't14-gen5-amd', 'Digitec', 1199.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-t14-gen-5-14-512-gb-16-gb-ch-amd-ryzen-7-pro-8840u-notebooks-46142629', 'Ryzen 7 PRO 8840U / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-224', 't14-gen5-amd', 'Brack', 1327.0, 'retail', NULL, 'Ryzen 5 PRO 8540U / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-225', 't16-gen3-intel', 'Digitec', 1065.0, 'retail', NULL, 'Collection starting price via Toppreise', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-226', 't16-gen3-intel', 'Brack', 1199.0, 'retail', NULL, NULL, '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-227', 'p16s-gen3-intel', 'Digitec', 1285.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-p16s-gen-3-16-intel-core-ultra-7-155h-64-gb-1000-gb-ch-notebooks-46143710', 'Ultra 7 155H / 64GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-228', 'p16s-gen3-intel', 'Lenovo CH', 992.0, 'msrp', 'https://www.lenovo.com/ch/de/p/laptops/thinkpad/thinkpadp/lenovo-thinkpad-p16s-gen-3-16-inch-intel-mobile-workstation/len101t0105', 'Starting config — Lenovo CH direct', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-229', 'p14s-gen5-intel', 'Brack', 1319.0, 'sale', 'https://www.brack.ch/lenovo-notebook-thinkpad-p14s-gen-5-intel-1732503', 'Ultra 7 155H / 16GB / 512GB / RTX 500 Ada — was CHF 1649, -20%', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-230', 'p14s-gen5-intel', 'Digitec', 1380.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-p14s-gen-5-14-intel-core-ultra-7-155h-16-gb-512-gb-ch-notebooks-46144338', 'Ultra 7 155H / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-231', 'p1-gen7', 'Digitec', 2222.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-p1-gen-7-16-intel-core-ultra-7-165h-64-gb-1000-gb-ch-notebooks-46143256', 'Ultra 7 165H / 64GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-232', 'p1-gen7', 'Lenovo CH', 2441.0, 'msrp', 'https://www.lenovo.com/ch/de/p/laptops/thinkpad/thinkpadp/thinkpad-p1-gen-7-16-inch-intel/len101t0107', 'Starting config — Lenovo CH direct', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-233', 'l14-gen5-intel', 'Digitec', 1044.0, 'retail', NULL, 'Ultra 7 155U / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-234', 'l14-gen5-intel', 'Brack', 1232.0, 'retail', NULL, 'Ultra 5 125U / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-235', 'l14-gen5-amd', 'Digitec', 1104.0, 'retail', NULL, 'Ryzen 5 PRO 7535U / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-236', 'l16-gen3-intel', 'Digitec', 1215.0, 'retail', NULL, 'Gen 1 equivalent — via Toppreise collection', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-237', 'e14-gen6-intel', 'Digitec', 849.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-e14-gen-6-14-intel-core-ultra-5-125u-16-gb-512-gb-ch-notebooks-44743809', 'Ultra 5 125U / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-238', 'e14-gen6-intel', 'Brack', 895.0, 'retail', 'https://www.brack.ch/lenovo-notebook-thinkpad-e14-gen-6-intel-1728179', 'Ultra 7 155H / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-239', 'e16-gen2-amd', 'Digitec', 759.0, 'retail', 'https://www.digitec.ch/de/s1/product/lenovo-thinkpad-e16-gen-2-16-amd-ryzen-5-7535hs-16-gb-512-gb-de-notebooks-45129941', 'Ryzen 5 7535HS / 16GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-240', 'e16-gen2-amd', 'Brack', 899.0, 'retail', 'https://www.brack.ch/lenovo-notebook-thinkpad-e16-gen-2-amd-1794084', 'Ryzen 7 7735HS / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-241', 'x13-gen4-intel', 'Digitec', 1024.0, 'retail', NULL, 'Collection starting price via Toppreise', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-242', 'x13-gen4-intel', 'Brack', 1259.0, 'retail', NULL, 'i5-1335U / 16GB / 512GB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-243', 'e14-gen4', 'Brack', 1185.0, 'retail', NULL, 'Old stock via Bechtle/Manor pricing', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-244', 'e14-gen5', 'Toppreise', 949.0, 'retail', NULL, 'i5-1335U / 16GB / 512GB — best price', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-245', 'e14-gen5', 'Brack', 1291.0, 'retail', NULL, 'i7-13700H / 32GB / 1TB', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-246', 'p14s-gen4', 'Toppreise', 1099.0, 'retail', NULL, 'i7-1360P / 16GB / 512GB — collection best', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-247', 't14-gen3-intel', 'Brack', 941.0, 'retail', NULL, 'Limited old stock', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-248', 't14-gen4-intel', 'Toppreise', 939.0, 'retail', NULL, 'i5-1335U / 16GB / 512GB — best price', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-249', 't14s-gen3-intel', 'Brack', 1420.0, 'retail', NULL, 'Old stock', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-250', 't14s-gen4-amd', 'Toppreise', 1181.0, 'retail', NULL, 'Collection starting price', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-251', 't16-gen1-intel', 'Toppreise', 679.0, 'retail', NULL, 'Collection best price — clearance', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-252', 't16-gen2-intel', 'Toppreise', 777.0, 'retail', NULL, 'i5-1335U / 16GB / 512GB — best price', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-253', 'x1-nano-gen2', 'Brack', 2694.0, 'retail', NULL, 'Limited availability', '2026-02-26', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-254', 'x13-gen1-intel', 'Revendo', 449.0, 'refurbished', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-255', 'x13-gen1-intel', 'Ricardo', 379.0, 'used', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-256', 'x13-gen1-amd', 'Revendo', 429.0, 'refurbished', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-257', 'x13-gen1-amd', 'Ricardo', 369.0, 'used', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-258', 'x13-gen2-intel', 'Revendo', 549.0, 'refurbished', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-259', 'x13-gen2-intel', 'Ricardo', 479.0, 'used', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-260', 'x13-gen2-amd', 'Revendo', 529.0, 'refurbished', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-261', 'x13-gen2-amd', 'Ricardo', 449.0, 'used', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-262', 'x13-gen3-intel', 'Digitec', 899.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-263', 'x13-gen3-intel', 'Lenovo CH', 1499.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-264', 'x13-gen3-amd', 'Digitec', 879.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-265', 'x13-gen3-amd', 'Brack', 899.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-266', 'x13-gen4-amd', 'Digitec', 1199.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-267', 'x13-gen4-amd', 'Lenovo CH', 1549.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-268', 'x13s-gen1', 'Digitec', 799.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-269', 'x13s-gen1', 'Lenovo CH', 1599.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-270', 'yoga-6-13alc7', 'Digitec', 699.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-271', 'yoga-6-13alc7', 'Lenovo CH', 899.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-272', 'yoga-7-14ial7', 'Digitec', 1099.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-273', 'yoga-7-14ial7', 'Lenovo CH', 1399.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-274', 'yoga-7-16iah7', 'Digitec', 1199.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-275', 'yoga-7-16iah7', 'Lenovo CH', 1499.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-276', 'yoga-7-2in1-14ahp9', 'Digitec', 1249.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-277', 'yoga-7-2in1-14ahp9', 'Lenovo CH', 1399.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-278', 'yoga-7-2in1-14iml9', 'Brack', 1349.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-279', 'yoga-7-2in1-14iml9', 'Lenovo CH', 1499.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-280', 'yoga-9-14iap7', 'Digitec', 1499.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-281', 'yoga-9-14iap7', 'Lenovo CH', 1999.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-282', 'yoga-9-14irp8', 'Digitec', 1699.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-283', 'yoga-9-14irp8', 'Lenovo CH', 2099.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-284', 'yoga-9-2in1-14imh9', 'Digitec', 2099.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-285', 'yoga-9-2in1-14imh9', 'Lenovo CH', 2399.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-286', 'yoga-slim-6-14iap8', 'Digitec', 999.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-287', 'yoga-slim-6-14iap8', 'Lenovo CH', 1199.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-288', 'yoga-slim-6-14irh8', 'Digitec', 1049.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-289', 'yoga-slim-6-14irh8', 'Lenovo CH', 1299.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-290', 'yoga-slim-7-14apu8', 'Digitec', 1149.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-291', 'yoga-slim-7-14apu8', 'Lenovo CH', 1399.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-292', 'yoga-slim-7-14imh9', 'Brack', 1349.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-293', 'yoga-slim-7-14imh9', 'Lenovo CH', 1499.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-294', 'yoga-slim-7x-14are9', 'Digitec', 1499.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-295', 'yoga-slim-7x-14are9', 'Lenovo CH', 1699.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-296', 'yoga-slim-9-14iap7', 'Digitec', 1599.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-297', 'yoga-slim-9-14iap7', 'Lenovo CH', 2199.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-298', 'yoga-book-9-13iru8', 'Digitec', 2299.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-299', 'yoga-book-9-13iru8', 'Lenovo CH', 2799.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-300', 'yoga-book-9-14iah10', 'Digitec', 2799.0, 'retail', NULL, NULL, '2025-02-01', 0, 'seed');

INSERT OR IGNORE INTO prices (id, laptop_id, retailer, price_chf, price_type, url, note, date_added, is_user_added, source)
VALUES ('sp-301', 'yoga-book-9-14iah10', 'Lenovo CH', 2999.0, 'msrp', NULL, NULL, '2025-02-01', 0, 'seed');
