import { useState, useEffect } from 'react';
import api from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type CartMap = Record<string, number>;

interface Product {
  id: string;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  emoji: string;
  tag?: string;
}

// ─── Static home-page data ────────────────────────────────────────────────────

const TOP_CATS = [
  { id: 'all',         label: 'All',         icon: '🛍️' },
  { id: 'rakhi',       label: 'Rakhi',       icon: '🎀', badge: true },
  { id: 'kids',        label: 'Kids',        icon: '👶' },
  { id: 'electronics', label: 'Electronics', icon: '📱' },
  { id: 'beauty',      label: 'Beauty',      icon: '💄' },
];

const BANNERS = [
  { bg: 'linear-gradient(135deg,#FF6D00,#FF9800)', label: 'NEWLY\nLAUNCHED', sub: '+ For You +', emoji: '🛒', badge: null as string | null },
  { bg: 'linear-gradient(135deg,#1565C0,#0D47A1)', label: 'Protein\nPicks',    sub: null,        emoji: '💪', badge: 'Featured' },
  { bg: 'linear-gradient(135deg,#4A148C,#7B1FA2)', label: 'Style\nYour Ha...', sub: null,        emoji: '💍', badge: 'Featured' },
];

const FREQ_GROUPS = [
  { label: 'Favourites',           more: 11, emojis: ['❤️','🛒'],        bg: '#FFF3E0' },
  { label: 'Vegetables\n& Fruits', more: 16, emojis: ['🥦','🍎','🍇'],   bg: '#E8F5E9' },
  { label: 'Chicken\n& Meat',      more: 8,  emojis: ['🍗','🥩'],        bg: '#FBE9E7' },
];

interface CatTile { label: string; emoji: string; bg: string; }

const GROCERY_CATS: CatTile[] = [
  { label: 'Vegetables & Fruits',      emoji: '🥦', bg: '#E8F5E9' },
  { label: 'Atta, Rice & Dal',         emoji: '🌾', bg: '#FFF8E1' },
  { label: 'Oil, Ghee & Masala',       emoji: '🫙', bg: '#FFF3E0' },
  { label: 'Dairy, Bread & Eggs',      emoji: '🥛', bg: '#E3F2FD' },
  { label: 'Bakery & Biscuits',        emoji: '🍪', bg: '#FCE4EC' },
  { label: 'Dry Fruits & Cereals',     emoji: '🥜', bg: '#F3E5F5' },
  { label: 'Chicken, Meat & Fish',     emoji: '🍗', bg: '#FFF3E0' },
  { label: 'Kitchenware & Appliances', emoji: '🍳', bg: '#E8EAF6' },
];

const SNACK_CATS: CatTile[] = [
  { label: 'Chips & Namkeen',           emoji: '🥔', bg: '#FFFDE7' },
  { label: 'Sweets & Chocolates',       emoji: '🍫', bg: '#FCE4EC' },
  { label: 'Drinks & Juices',           emoji: '🥤', bg: '#E3F2FD' },
  { label: 'Tea, Coffee & Milk Drinks', emoji: '☕', bg: '#FBE9E7' },
  { label: 'Instant Food',              emoji: '🍜', bg: '#FFF8E1' },
  { label: 'Ice Creams & More',         emoji: '🍦', bg: '#E8F5E9' },
];

// ─── Product catalogue (20 per category) ──────────────────────────────────────

const PRODUCTS: Record<string, Product[]> = {
  'Vegetables & Fruits': [
    { id:'vf1',  name:'Tomatoes',          weight:'500 g',   price:25,  mrp:30,  emoji:'🍅', tag:'FRESH' },
    { id:'vf2',  name:'Onions',            weight:'1 kg',    price:35,  mrp:40,  emoji:'🧅' },
    { id:'vf3',  name:'Potatoes',          weight:'1 kg',    price:40,  mrp:50,  emoji:'🥔' },
    { id:'vf4',  name:'Spinach',           weight:'250 g',   price:18,  mrp:22,  emoji:'🌿', tag:'ORGANIC' },
    { id:'vf5',  name:'Capsicum',          weight:'250 g',   price:30,  mrp:38,  emoji:'🫑' },
    { id:'vf6',  name:'Broccoli',          weight:'500 g',   price:65,  mrp:80,  emoji:'🥦', tag:'POPULAR' },
    { id:'vf7',  name:'Carrots',           weight:'500 g',   price:28,  mrp:35,  emoji:'🥕' },
    { id:'vf8',  name:'Cucumber',          weight:'500 g',   price:22,  mrp:28,  emoji:'🥒' },
    { id:'vf9',  name:'Green Chilli',      weight:'100 g',   price:12,  mrp:15,  emoji:'🌶️' },
    { id:'vf10', name:'Garlic',            weight:'100 g',   price:20,  mrp:25,  emoji:'🧄' },
    { id:'vf11', name:'Banana',            weight:'6 pcs',   price:35,  mrp:45,  emoji:'🍌', tag:'POPULAR' },
    { id:'vf12', name:'Apple Shimla',      weight:'4 pcs',   price:120, mrp:150, emoji:'🍎' },
    { id:'vf13', name:'Alphonso Mango',    weight:'1 kg',    price:180, mrp:220, emoji:'🥭', tag:'SEASONAL' },
    { id:'vf14', name:'Green Grapes',      weight:'500 g',   price:70,  mrp:90,  emoji:'🍇' },
    { id:'vf15', name:'Watermelon',        weight:'1 piece', price:60,  mrp:75,  emoji:'🍉' },
    { id:'vf16', name:'Papaya',            weight:'1 piece', price:55,  mrp:70,  emoji:'🍈' },
    { id:'vf17', name:'Pineapple',         weight:'1 piece', price:65,  mrp:80,  emoji:'🍍' },
    { id:'vf18', name:'Strawberries',      weight:'250 g',   price:99,  mrp:130, emoji:'🍓', tag:'FRESH' },
    { id:'vf19', name:'Kiwi',             weight:'4 pcs',   price:99,  mrp:120, emoji:'🥝' },
    { id:'vf20', name:'Oranges',           weight:'4 pcs',   price:60,  mrp:75,  emoji:'🍊' },
  ],
  'Atta, Rice & Dal': [
    { id:'ar1',  name:'Aashirvaad Atta',       weight:'5 kg',   price:250, mrp:270, emoji:'🌾', tag:'BESTSELLER' },
    { id:'ar2',  name:'Fortune Chakki Atta',    weight:'10 kg',  price:460, mrp:510, emoji:'🌾' },
    { id:'ar3',  name:'Basmati Rice',           weight:'1 kg',   price:120, mrp:145, emoji:'🍚' },
    { id:'ar4',  name:'Sona Masoori Rice',      weight:'5 kg',   price:350, mrp:400, emoji:'🍚', tag:'POPULAR' },
    { id:'ar5',  name:'Toor Dal',               weight:'1 kg',   price:150, mrp:170, emoji:'🫘' },
    { id:'ar6',  name:'Moong Dal',              weight:'500 g',  price:80,  mrp:95,  emoji:'🫘' },
    { id:'ar7',  name:'Chana Dal',              weight:'1 kg',   price:90,  mrp:105, emoji:'🫘' },
    { id:'ar8',  name:'Masoor Dal',             weight:'500 g',  price:70,  mrp:80,  emoji:'🫘' },
    { id:'ar9',  name:'Rajma',                  weight:'500 g',  price:85,  mrp:95,  emoji:'🫘' },
    { id:'ar10', name:'Chickpeas / Chole',      weight:'500 g',  price:75,  mrp:85,  emoji:'🫘' },
    { id:'ar11', name:'Poha',                   weight:'500 g',  price:40,  mrp:48,  emoji:'🌾' },
    { id:'ar12', name:'Semolina / Suji',        weight:'500 g',  price:35,  mrp:42,  emoji:'🌾' },
    { id:'ar13', name:'Maida',                  weight:'1 kg',   price:50,  mrp:58,  emoji:'🌾' },
    { id:'ar14', name:'Besan',                  weight:'500 g',  price:60,  mrp:70,  emoji:'🌾' },
    { id:'ar15', name:'Brown Rice',             weight:'1 kg',   price:110, mrp:130, emoji:'🍚' },
    { id:'ar16', name:'Quinoa',                 weight:'500 g',  price:220, mrp:260, emoji:'🌾', tag:'HEALTHY' },
    { id:'ar17', name:'Dalia / Broken Wheat',   weight:'500 g',  price:45,  mrp:52,  emoji:'🌾' },
    { id:'ar18', name:'Jowar Flour',            weight:'500 g',  price:55,  mrp:65,  emoji:'🌾' },
    { id:'ar19', name:'Ragi Flour',             weight:'500 g',  price:75,  mrp:90,  emoji:'🌾', tag:'HEALTHY' },
    { id:'ar20', name:'Urad Dal',               weight:'500 g',  price:95,  mrp:110, emoji:'🫘' },
  ],
  'Oil, Ghee & Masala': [
    { id:'og1',  name:'Fortune Sunflower Oil',  weight:'1 L',    price:145, mrp:165, emoji:'🫙' },
    { id:'og2',  name:'Saffola Gold Oil',       weight:'1 L',    price:175, mrp:200, emoji:'🫙', tag:'POPULAR' },
    { id:'og3',  name:'Amul Ghee',              weight:'500 ml', price:290, mrp:325, emoji:'🫙', tag:'BESTSELLER' },
    { id:'og4',  name:'MDH Chana Masala',       weight:'100 g',  price:60,  mrp:70,  emoji:'🌶️' },
    { id:'og5',  name:'MDH Rajma Masala',       weight:'100 g',  price:55,  mrp:65,  emoji:'🌶️' },
    { id:'og6',  name:'Everest Kitchen King',   weight:'100 g',  price:65,  mrp:75,  emoji:'🌶️' },
    { id:'og7',  name:'Turmeric Powder',        weight:'200 g',  price:45,  mrp:55,  emoji:'🌿' },
    { id:'og8',  name:'Red Chilli Powder',      weight:'200 g',  price:50,  mrp:60,  emoji:'🌶️' },
    { id:'og9',  name:'Coriander Powder',       weight:'200 g',  price:40,  mrp:50,  emoji:'🌿' },
    { id:'og10', name:'Garam Masala',           weight:'100 g',  price:55,  mrp:65,  emoji:'🌶️' },
    { id:'og11', name:'Mustard Oil',            weight:'1 L',    price:180, mrp:210, emoji:'🫙' },
    { id:'og12', name:'Olive Oil Extra Virgin', weight:'500 ml', price:350, mrp:420, emoji:'🫙', tag:'PREMIUM' },
    { id:'og13', name:'Coconut Oil',            weight:'500 ml', price:130, mrp:155, emoji:'🫙' },
    { id:'og14', name:'Black Pepper Powder',    weight:'100 g',  price:80,  mrp:95,  emoji:'🌶️' },
    { id:'og15', name:'Cumin Seeds',            weight:'100 g',  price:45,  mrp:55,  emoji:'🌿' },
    { id:'og16', name:'Mustard Seeds',          weight:'200 g',  price:30,  mrp:38,  emoji:'🌿' },
    { id:'og17', name:'Hing / Asafoetida',      weight:'25 g',   price:35,  mrp:42,  emoji:'🌿' },
    { id:'og18', name:'Bay Leaves',             weight:'20 g',   price:20,  mrp:25,  emoji:'🌿' },
    { id:'og19', name:'Cardamom',               weight:'50 g',   price:75,  mrp:90,  emoji:'🌿' },
    { id:'og20', name:'Saffola Active Oil',     weight:'2 L',    price:280, mrp:320, emoji:'🫙' },
  ],
  'Dairy, Bread & Eggs': [
    { id:'db1',  name:'Amul Taza Milk',         weight:'1 L',    price:68,  mrp:72,  emoji:'🥛', tag:'BESTSELLER' },
    { id:'db2',  name:'Amul Butter',            weight:'200 g',  price:112, mrp:125, emoji:'🧈' },
    { id:'db3',  name:'Amul Cheese Slices',     weight:'200 g',  price:99,  mrp:115, emoji:'🧀' },
    { id:'db4',  name:'Mother Dairy Dahi',      weight:'400 g',  price:45,  mrp:52,  emoji:'🍶' },
    { id:'db5',  name:'Amul Paneer',            weight:'200 g',  price:85,  mrp:99,  emoji:'🥮' },
    { id:'db6',  name:'Farm Fresh Eggs',        weight:'12 pcs', price:89,  mrp:99,  emoji:'🥚', tag:'POPULAR' },
    { id:'db7',  name:'Amul Buttermilk',        weight:'200 ml', price:20,  mrp:22,  emoji:'🥤' },
    { id:'db8',  name:'Amul Fresh Cream',       weight:'200 ml', price:55,  mrp:62,  emoji:'🍦' },
    { id:'db9',  name:'Milkmaid Condensed Milk',weight:'200 g',  price:48,  mrp:55,  emoji:'🍯' },
    { id:'db10', name:'Britannia Brown Bread',  weight:'400 g',  price:45,  mrp:52,  emoji:'🍞' },
    { id:'db11', name:'Harvest Gold Bread',     weight:'400 g',  price:40,  mrp:48,  emoji:'🍞' },
    { id:'db12', name:'English Muffins',        weight:'4 pcs',  price:65,  mrp:75,  emoji:'🧇' },
    { id:'db13', name:'Amul Lassi',             weight:'200 ml', price:25,  mrp:28,  emoji:'🥤' },
    { id:'db14', name:'Greek Yogurt',           weight:'90 g',   price:35,  mrp:40,  emoji:'🫙' },
    { id:'db15', name:'Amul Kool',              weight:'200 ml', price:25,  mrp:28,  emoji:'🥤' },
    { id:'db16', name:'Nandini Milk',           weight:'500 ml', price:32,  mrp:35,  emoji:'🥛' },
    { id:'db17', name:'Britannia Cheese Slices',weight:'200 g',  price:115, mrp:130, emoji:'🧀' },
    { id:'db18', name:'Pita Bread',             weight:'200 g',  price:55,  mrp:65,  emoji:'🫓' },
    { id:'db19', name:'Sourdough Bread',        weight:'300 g',  price:120, mrp:140, emoji:'🍞', tag:'ARTISAN' },
    { id:'db20', name:'Quail Eggs',             weight:'12 pcs', price:75,  mrp:85,  emoji:'🥚' },
  ],
  'Bakery & Biscuits': [
    { id:'bb1',  name:"Parle-G Biscuits",       weight:'800 g',  price:50,  mrp:55,  emoji:'🍪', tag:'BESTSELLER' },
    { id:'bb2',  name:'Britannia Good Day',     weight:'150 g',  price:30,  mrp:35,  emoji:'🍪' },
    { id:'bb3',  name:'Oreo Cream Biscuit',     weight:'150 g',  price:35,  mrp:40,  emoji:'🍪', tag:'POPULAR' },
    { id:'bb4',  name:'Dark Fantasy Chocofills',weight:'75 g',   price:35,  mrp:40,  emoji:'🍪' },
    { id:'bb5',  name:'Marie Gold',             weight:'250 g',  price:25,  mrp:30,  emoji:'🍪' },
    { id:'bb6',  name:'Monaco Salted',          weight:'150 g',  price:25,  mrp:28,  emoji:'🍪' },
    { id:'bb7',  name:'Hide & Seek Chocolate',  weight:'100 g',  price:40,  mrp:45,  emoji:'🍪' },
    { id:'bb8',  name:'Bourbon Cream',          weight:'100 g',  price:30,  mrp:35,  emoji:'🍪' },
    { id:'bb9',  name:'50-50 Maska Chaska',     weight:'150 g',  price:25,  mrp:30,  emoji:'🍪' },
    { id:'bb10', name:'Digestive Biscuits',     weight:'200 g',  price:55,  mrp:65,  emoji:'🍪' },
    { id:'bb11', name:'Nutrichoice Biscuit',    weight:'200 g',  price:45,  mrp:52,  emoji:'🍪', tag:'HEALTHY' },
    { id:'bb12', name:'Croissant',              weight:'2 pcs',  price:50,  mrp:58,  emoji:'🥐' },
    { id:'bb13', name:'Maska Bun',              weight:'4 pcs',  price:35,  mrp:40,  emoji:'🧁' },
    { id:'bb14', name:'Tutti Frutti Cake',      weight:'200 g',  price:75,  mrp:85,  emoji:'🎂' },
    { id:'bb15', name:'Banana Cake Slice',      weight:'200 g',  price:70,  mrp:80,  emoji:'🍰' },
    { id:'bb16', name:'Choco Pie',              weight:'6 pcs',  price:55,  mrp:65,  emoji:'🍫' },
    { id:'bb17', name:'Wafer Biscuit',          weight:'75 g',   price:15,  mrp:18,  emoji:'🍪' },
    { id:'bb18', name:'Khari Biscuit',          weight:'200 g',  price:45,  mrp:52,  emoji:'🥐' },
    { id:'bb19', name:'Gluco Biscuit',          weight:'200 g',  price:20,  mrp:24,  emoji:'🍪' },
    { id:'bb20', name:'Cream Cracker',          weight:'200 g',  price:55,  mrp:65,  emoji:'🍪' },
  ],
  'Dry Fruits & Cereals': [
    { id:'df1',  name:'Almonds',             weight:'200 g',  price:180, mrp:215, emoji:'🌰', tag:'POPULAR' },
    { id:'df2',  name:'Cashews',             weight:'200 g',  price:220, mrp:260, emoji:'🌰' },
    { id:'df3',  name:'Walnuts',             weight:'200 g',  price:250, mrp:290, emoji:'🌰' },
    { id:'df4',  name:'Pistachios',          weight:'100 g',  price:180, mrp:210, emoji:'🌰' },
    { id:'df5',  name:'Raisins',             weight:'200 g',  price:80,  mrp:95,  emoji:'🍇' },
    { id:'df6',  name:'Dates',               weight:'250 g',  price:120, mrp:140, emoji:'🌴' },
    { id:'df7',  name:'Mixed Dry Fruits',    weight:'200 g',  price:199, mrp:240, emoji:'🌰' },
    { id:'df8',  name:'Kellogg\'s Cornflakes',weight:'500 g', price:120, mrp:145, emoji:'🥣', tag:'BESTSELLER' },
    { id:'df9',  name:'Muesli',              weight:'500 g',  price:185, mrp:220, emoji:'🥣' },
    { id:'df10', name:'Quaker Oats',         weight:'500 g',  price:75,  mrp:90,  emoji:'🥣', tag:'HEALTHY' },
    { id:'df11', name:'Granola',             weight:'400 g',  price:220, mrp:260, emoji:'🥣' },
    { id:'df12', name:'Chia Seeds',          weight:'200 g',  price:160, mrp:190, emoji:'🌱', tag:'HEALTHY' },
    { id:'df13', name:'Flaxseeds',           weight:'200 g',  price:80,  mrp:95,  emoji:'🌱' },
    { id:'df14', name:'Sunflower Seeds',     weight:'200 g',  price:75,  mrp:90,  emoji:'🌻' },
    { id:'df15', name:'Pumpkin Seeds',       weight:'200 g',  price:120, mrp:145, emoji:'🎃' },
    { id:'df16', name:'Fox Nuts / Makhana', weight:'100 g',  price:80,  mrp:95,  emoji:'🌾', tag:'POPULAR' },
    { id:'df17', name:'Pine Nuts',           weight:'50 g',   price:180, mrp:210, emoji:'🌲' },
    { id:'df18', name:'Dried Cranberries',   weight:'150 g',  price:150, mrp:180, emoji:'🫐' },
    { id:'df19', name:'Dried Figs',          weight:'200 g',  price:180, mrp:210, emoji:'🍑' },
    { id:'df20', name:'Dried Apricots',      weight:'200 g',  price:140, mrp:170, emoji:'🍑' },
  ],
  'Chicken, Meat & Fish': [
    { id:'cm1',  name:'Chicken Breast',        weight:'500 g',  price:199, mrp:230, emoji:'🍗', tag:'FRESH' },
    { id:'cm2',  name:'Chicken Thigh Boneless',weight:'500 g',  price:175, mrp:210, emoji:'🍗' },
    { id:'cm3',  name:'Whole Chicken',         weight:'1 kg',   price:280, mrp:330, emoji:'🐔' },
    { id:'cm4',  name:'Mutton Keema',          weight:'500 g',  price:380, mrp:430, emoji:'🥩' },
    { id:'cm5',  name:'Lamb Chops',            weight:'500 g',  price:420, mrp:480, emoji:'🥩' },
    { id:'cm6',  name:'Rohu Fish',             weight:'500 g',  price:180, mrp:210, emoji:'🐟', tag:'FRESH' },
    { id:'cm7',  name:'Pomfret',               weight:'250 g',  price:250, mrp:290, emoji:'🐠' },
    { id:'cm8',  name:'Prawns',                weight:'250 g',  price:320, mrp:380, emoji:'🦐' },
    { id:'cm9',  name:'Salmon Fillet',         weight:'200 g',  price:450, mrp:520, emoji:'🐟', tag:'PREMIUM' },
    { id:'cm10', name:'Tuna Can',              weight:'185 g',  price:120, mrp:140, emoji:'🐟' },
    { id:'cm11', name:'Chicken Sausages',      weight:'400 g',  price:220, mrp:260, emoji:'🌭' },
    { id:'cm12', name:'Chicken Nuggets',       weight:'400 g',  price:245, mrp:280, emoji:'🍗', tag:'POPULAR' },
    { id:'cm13', name:'Fish Fingers',          weight:'300 g',  price:195, mrp:230, emoji:'🐟' },
    { id:'cm14', name:'Chicken Wings',         weight:'500 g',  price:220, mrp:260, emoji:'🍗' },
    { id:'cm15', name:'Salami Slices',         weight:'100 g',  price:180, mrp:210, emoji:'🥩' },
    { id:'cm16', name:'Squid / Calamari',      weight:'250 g',  price:280, mrp:330, emoji:'🦑' },
    { id:'cm17', name:'Tilapia Fillet',        weight:'500 g',  price:165, mrp:195, emoji:'🐟' },
    { id:'cm18', name:'Crab',                  weight:'500 g',  price:380, mrp:440, emoji:'🦀', tag:'SEASONAL' },
    { id:'cm19', name:'Mutton Biryani Cut',    weight:'500 g',  price:360, mrp:420, emoji:'🥩' },
    { id:'cm20', name:'Chicken Liver',         weight:'250 g',  price:99,  mrp:120, emoji:'🍗' },
  ],
  'Kitchenware & Appliances': [
    { id:'ka1',  name:'Non-stick Frying Pan',  weight:'22 cm',  price:799,  mrp:999,  emoji:'🍳', tag:'POPULAR' },
    { id:'ka2',  name:'Pressure Cooker',       weight:'3 L',    price:1299, mrp:1550, emoji:'🫕' },
    { id:'ka3',  name:'Chef\'s Knife',         weight:'1 pc',   price:450,  mrp:550,  emoji:'🔪' },
    { id:'ka4',  name:'Cutting Board',         weight:'1 pc',   price:299,  mrp:350,  emoji:'🪵' },
    { id:'ka5',  name:'Mixing Bowls Set',      weight:'3 pcs',  price:399,  mrp:480,  emoji:'🥣' },
    { id:'ka6',  name:'Steel Tongs',           weight:'1 pc',   price:150,  mrp:180,  emoji:'🥢' },
    { id:'ka7',  name:'Vegetable Peeler',      weight:'1 pc',   price:99,   mrp:120,  emoji:'🥕' },
    { id:'ka8',  name:'Box Grater',            weight:'1 pc',   price:199,  mrp:250,  emoji:'🧀' },
    { id:'ka9',  name:'Measuring Cups Set',    weight:'4 pcs',  price:249,  mrp:300,  emoji:'🫙' },
    { id:'ka10', name:'Colander',              weight:'1 pc',   price:299,  mrp:360,  emoji:'🫙' },
    { id:'ka11', name:'Spatula Set',           weight:'3 pcs',  price:199,  mrp:240,  emoji:'🍴' },
    { id:'ka12', name:'Kitchen Scale',         weight:'1 pc',   price:499,  mrp:599,  emoji:'⚖️' },
    { id:'ka13', name:'Rolling Pin',           weight:'1 pc',   price:149,  mrp:180,  emoji:'🪵' },
    { id:'ka14', name:'Wok',                   weight:'28 cm',  price:699,  mrp:850,  emoji:'🍳' },
    { id:'ka15', name:'Baking Tray',           weight:'1 pc',   price:299,  mrp:360,  emoji:'🫓' },
    { id:'ka16', name:'Food Container Set',    weight:'3 pcs',  price:499,  mrp:599,  emoji:'🫙', tag:'NEW' },
    { id:'ka17', name:'Ladle Set',             weight:'2 pcs',  price:149,  mrp:180,  emoji:'🥄' },
    { id:'ka18', name:'Garlic Press',          weight:'1 pc',   price:129,  mrp:160,  emoji:'🧄' },
    { id:'ka19', name:'Whisk',                 weight:'1 pc',   price:149,  mrp:180,  emoji:'🍴' },
    { id:'ka20', name:'Can Opener',            weight:'1 pc',   price:149,  mrp:180,  emoji:'🥫' },
  ],
  'Chips & Namkeen': [
    { id:'cn1',  name:"Lay's Classic Salted",   weight:'52 g',  price:20,  mrp:20,  emoji:'🥔', tag:'BESTSELLER' },
    { id:'cn2',  name:"Lay's Magic Masala",      weight:'52 g',  price:20,  mrp:20,  emoji:'🥔' },
    { id:'cn3',  name:'Kurkure Masala Munch',   weight:'55 g',  price:20,  mrp:20,  emoji:'🌽' },
    { id:'cn4',  name:'Bingo Mad Angles',       weight:'72 g',  price:20,  mrp:20,  emoji:'🌽' },
    { id:'cn5',  name:"Haldiram's Bhujia",      weight:'200 g', price:80,  mrp:90,  emoji:'🌾', tag:'POPULAR' },
    { id:'cn6',  name:"Haldiram's Aloo Bhujia", weight:'400 g', price:150, mrp:175, emoji:'🥔' },
    { id:'cn7',  name:'Pringles Original',      weight:'107 g', price:99,  mrp:110, emoji:'🥔' },
    { id:'cn8',  name:'Doritos Nacho Cheese',   weight:'70 g',  price:30,  mrp:35,  emoji:'🌽' },
    { id:'cn9',  name:'Cornitos Nacho',         weight:'60 g',  price:35,  mrp:40,  emoji:'🌽' },
    { id:'cn10', name:'Bikano Namkeen Mix',     weight:'200 g', price:65,  mrp:75,  emoji:'🌾' },
    { id:'cn11', name:'Too Yumm Multigrain',    weight:'56 g',  price:20,  mrp:20,  emoji:'🌾', tag:'HEALTHY' },
    { id:'cn12', name:'Act II Microwave Popcorn',weight:'120 g',price:55,  mrp:65,  emoji:'🍿' },
    { id:'cn13', name:'Roasted Peanuts',        weight:'200 g', price:50,  mrp:60,  emoji:'🥜' },
    { id:'cn14', name:'Chivda',                 weight:'200 g', price:70,  mrp:80,  emoji:'🌾' },
    { id:'cn15', name:'Chakli',                 weight:'200 g', price:80,  mrp:95,  emoji:'🌀' },
    { id:'cn16', name:'Papdi',                  weight:'200 g', price:65,  mrp:75,  emoji:'🌾' },
    { id:'cn17', name:'Masala Peanuts',         weight:'200 g', price:60,  mrp:70,  emoji:'🥜' },
    { id:'cn18', name:'Banana Chips',           weight:'200 g', price:75,  mrp:90,  emoji:'🍌' },
    { id:'cn19', name:'Mathri',                 weight:'200 g', price:70,  mrp:80,  emoji:'🌾' },
    { id:'cn20', name:'Bhujiawala Sev Mix',     weight:'200 g', price:75,  mrp:85,  emoji:'🌾' },
  ],
  'Sweets & Chocolates': [
    { id:'sc1',  name:'Dairy Milk Silk',        weight:'60 g',  price:60,  mrp:65,  emoji:'🍫', tag:'BESTSELLER' },
    { id:'sc2',  name:'KitKat',                 weight:'40 g',  price:30,  mrp:30,  emoji:'🍫' },
    { id:'sc3',  name:'5 Star',                 weight:'40 g',  price:20,  mrp:20,  emoji:'🍫' },
    { id:'sc4',  name:'Ferrero Rocher',         weight:'3 pcs', price:150, mrp:175, emoji:'🍬', tag:'PREMIUM' },
    { id:'sc5',  name:'Toblerone',              weight:'100 g', price:180, mrp:210, emoji:'🍫' },
    { id:'sc6',  name:'Amul Dark Chocolate',    weight:'55 g',  price:85,  mrp:100, emoji:'🍫' },
    { id:'sc7',  name:'Snickers',               weight:'50 g',  price:50,  mrp:55,  emoji:'🍫' },
    { id:'sc8',  name:'Bounty',                 weight:'57 g',  price:50,  mrp:55,  emoji:'🍫' },
    { id:'sc9',  name:'Milkybar',               weight:'27 g',  price:20,  mrp:20,  emoji:'🍬' },
    { id:'sc10', name:"Haldiram's Rasgulla",    weight:'1 kg',  price:180, mrp:210, emoji:'🫙', tag:'POPULAR' },
    { id:'sc11', name:"Haldiram's Gulab Jamun", weight:'1 kg',  price:175, mrp:200, emoji:'🫙' },
    { id:'sc12', name:'Soan Papdi',             weight:'400 g', price:120, mrp:145, emoji:'🍬' },
    { id:'sc13', name:'MTR Ladoo',              weight:'200 g', price:90,  mrp:105, emoji:'🍘' },
    { id:'sc14', name:'Eclairs Candy',          weight:'200 g', price:65,  mrp:75,  emoji:'🍬' },
    { id:'sc15', name:'Skittles',               weight:'62 g',  price:55,  mrp:65,  emoji:'🍬' },
    { id:'sc16', name:'Mentos',                 weight:'40 g',  price:20,  mrp:20,  emoji:'🍬' },
    { id:'sc17', name:'Coffee Bite',            weight:'20 pcs',price:40,  mrp:45,  emoji:'🍬' },
    { id:'sc18', name:'Cadbury Gems',           weight:'35 g',  price:20,  mrp:20,  emoji:'🍬' },
    { id:'sc19', name:'Munch',                  weight:'18 g',  price:10,  mrp:10,  emoji:'🍫' },
    { id:'sc20', name:'Dairy Milk Fruit & Nut', weight:'80 g',  price:80,  mrp:90,  emoji:'🍫' },
  ],
  'Drinks & Juices': [
    { id:'dj1',  name:'Coca-Cola',              weight:'750 ml', price:45,  mrp:45,  emoji:'🥤', tag:'POPULAR' },
    { id:'dj2',  name:'Pepsi',                  weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj3',  name:'Sprite',                 weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj4',  name:'Mountain Dew',           weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj5',  name:'Real Juice Mixed Fruit', weight:'1 L',    price:99,  mrp:120, emoji:'🧃' },
    { id:'dj6',  name:'Tropicana Orange',       weight:'1 L',    price:105, mrp:130, emoji:'🍊' },
    { id:'dj7',  name:'Minute Maid Pulpy Orange',weight:'1 L',   price:95,  mrp:115, emoji:'🍊' },
    { id:'dj8',  name:'Paper Boat Aam Panna',   weight:'250 ml', price:30,  mrp:35,  emoji:'🥭' },
    { id:'dj9',  name:'Maaza Mango Drink',      weight:'600 ml', price:45,  mrp:50,  emoji:'🥭', tag:'POPULAR' },
    { id:'dj10', name:'Frooti',                 weight:'200 ml', price:20,  mrp:22,  emoji:'🥭' },
    { id:'dj11', name:'Limca',                  weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj12', name:'Thums Up',               weight:'750 ml', price:45,  mrp:45,  emoji:'🥤' },
    { id:'dj13', name:'Red Bull Energy Drink',  weight:'250 ml', price:125, mrp:135, emoji:'⚡', tag:'NEW' },
    { id:'dj14', name:'Monster Energy',         weight:'250 ml', price:130, mrp:145, emoji:'⚡' },
    { id:'dj15', name:'Sting Energy Drink',     weight:'250 ml', price:20,  mrp:20,  emoji:'⚡' },
    { id:'dj16', name:'Nimbooz',                weight:'750 ml', price:40,  mrp:40,  emoji:'🍋' },
    { id:'dj17', name:'7UP',                    weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj18', name:'Fanta Orange',           weight:'750 ml', price:40,  mrp:40,  emoji:'🥤' },
    { id:'dj19', name:'B Natural Apple Juice',  weight:'1 L',    price:90,  mrp:110, emoji:'🍎' },
    { id:'dj20', name:'Raw Pressery Juice',     weight:'250 ml', price:65,  mrp:80,  emoji:'🧃', tag:'COLD PRESSED' },
  ],
  'Tea, Coffee & Milk Drinks': [
    { id:'tc1',  name:'Nescafé Classic',        weight:'100 g',  price:175, mrp:205, emoji:'☕', tag:'BESTSELLER' },
    { id:'tc2',  name:'Nescafé Gold',           weight:'200 g',  price:320, mrp:380, emoji:'☕', tag:'PREMIUM' },
    { id:'tc3',  name:'Bru Instant Coffee',     weight:'200 g',  price:185, mrp:220, emoji:'☕' },
    { id:'tc4',  name:'Tata Tea Premium',       weight:'500 g',  price:210, mrp:245, emoji:'🍵', tag:'POPULAR' },
    { id:'tc5',  name:'Red Label Tea',          weight:'500 g',  price:200, mrp:235, emoji:'🍵' },
    { id:'tc6',  name:'Darjeeling Tea Leaves',  weight:'100 g',  price:250, mrp:300, emoji:'🍵' },
    { id:'tc7',  name:'Tetley Green Tea',       weight:'25 bags',price:180, mrp:210, emoji:'🍵' },
    { id:'tc8',  name:'Lipton Yellow Label',    weight:'250 g',  price:195, mrp:230, emoji:'🍵' },
    { id:'tc9',  name:'Bournvita',              weight:'500 g',  price:230, mrp:265, emoji:'🍫', tag:'POPULAR' },
    { id:'tc10', name:'Horlicks',               weight:'500 g',  price:230, mrp:265, emoji:'🥛' },
    { id:'tc11', name:'Boost',                  weight:'500 g',  price:225, mrp:260, emoji:'⚡' },
    { id:'tc12', name:'Complan',                weight:'500 g',  price:280, mrp:320, emoji:'🥛' },
    { id:'tc13', name:'Starbucks Via Instant',  weight:'5 pcs',  price:250, mrp:295, emoji:'☕', tag:'PREMIUM' },
    { id:'tc14', name:'Chai Point Masala Tea',  weight:'200 g',  price:180, mrp:210, emoji:'🍵' },
    { id:'tc15', name:'Girnar Masala Chai Bags',weight:'10 bags',price:40,  mrp:48,  emoji:'🍵' },
    { id:'tc16', name:'Tulsi Green Tea',        weight:'25 bags',price:155, mrp:180, emoji:'🌿' },
    { id:'tc17', name:'Milo Chocolate Drink',   weight:'400 g',  price:225, mrp:260, emoji:'🍫' },
    { id:'tc18', name:'Amul Kool Milk',         weight:'200 ml', price:25,  mrp:28,  emoji:'🥛' },
    { id:'tc19', name:'Amul Lassi Mango',       weight:'200 ml', price:25,  mrp:28,  emoji:'🥛' },
    { id:'tc20', name:'Iced Tea Powder',        weight:'400 g',  price:140, mrp:165, emoji:'🍵' },
  ],
  'Instant Food': [
    { id:'if1',  name:'Maggi 2-Minute Noodles', weight:'70g×4',  price:56,  mrp:60,  emoji:'🍜', tag:'BESTSELLER' },
    { id:'if2',  name:'Yippee Magic Masala',    weight:'70 g',   price:15,  mrp:15,  emoji:'🍜' },
    { id:'if3',  name:'Top Ramen Noodles',      weight:'70 g',   price:15,  mrp:15,  emoji:'🍜' },
    { id:'if4',  name:'Knorr Tomato Soup',      weight:'46 g',   price:55,  mrp:65,  emoji:'🍲' },
    { id:'if5',  name:'MTR Upma Mix',           weight:'200 g',  price:65,  mrp:75,  emoji:'🍚' },
    { id:'if6',  name:'MTR Poha Mix',           weight:'200 g',  price:60,  mrp:70,  emoji:'🍚' },
    { id:'if7',  name:'MTR Rava Idli Mix',      weight:'500 g',  price:105, mrp:120, emoji:'🫓', tag:'POPULAR' },
    { id:'if8',  name:'Gits Dosa Mix',          weight:'500 g',  price:95,  mrp:110, emoji:'🫓' },
    { id:'if9',  name:'Gits Khaman Dhokla',     weight:'200 g',  price:70,  mrp:80,  emoji:'🟡' },
    { id:'if10', name:"Haldiram's Dal Makhani", weight:'300 g',  price:130, mrp:150, emoji:'🫘', tag:'POPULAR' },
    { id:'if11', name:"Haldiram's Palak Paneer",weight:'300 g',  price:140, mrp:165, emoji:'🥬' },
    { id:'if12', name:'Tasty Bite Pav Bhaji',   weight:'285 g',  price:145, mrp:170, emoji:'🍞' },
    { id:'if13', name:'McCain French Fries',    weight:'450 g',  price:160, mrp:190, emoji:'🍟' },
    { id:'if14', name:'Cup Noodles',            weight:'70 g',   price:35,  mrp:40,  emoji:'🍜' },
    { id:'if15', name:'Quaker Oats Instant',    weight:'400 g',  price:125, mrp:145, emoji:'🥣', tag:'HEALTHY' },
    { id:'if16', name:'Aashirvaad Ready Meal',  weight:'300 g',  price:120, mrp:140, emoji:'🫕' },
    { id:'if17', name:'Sunfeast Yippee Pasta',  weight:'65 g',   price:25,  mrp:30,  emoji:'🍝' },
    { id:'if18', name:'MTR Sambar Mix',         weight:'200 g',  price:60,  mrp:70,  emoji:'🍲' },
    { id:'if19', name:'Maggi Masala Sauce',     weight:'120 g',  price:35,  mrp:40,  emoji:'🫙' },
    { id:'if20', name:'Knorr Chinese Noodles',  weight:'65 g',   price:30,  mrp:35,  emoji:'🍜' },
  ],
  'Ice Creams & More': [
    { id:'ic1',  name:'Amul Vanilla Ice Cream', weight:'125 ml', price:40,  mrp:45,  emoji:'🍦', tag:'POPULAR' },
    { id:'ic2',  name:'Kwality Walls Cornetto', weight:'120 ml', price:50,  mrp:55,  emoji:'🍦' },
    { id:'ic3',  name:'Kwality Walls Paddle Pop',weight:'60 ml', price:25,  mrp:30,  emoji:'🍭' },
    { id:'ic4',  name:'Amul Chocozoo Bar',      weight:'60 ml',  price:30,  mrp:35,  emoji:'🍫' },
    { id:'ic5',  name:'Havmor Chocobar',        weight:'60 ml',  price:30,  mrp:35,  emoji:'🍫' },
    { id:'ic6',  name:'Mother Dairy Kulfi',     weight:'60 ml',  price:30,  mrp:35,  emoji:'🍦' },
    { id:'ic7',  name:'Vadilal Kesar Pista',    weight:'500 ml', price:180, mrp:210, emoji:'🍨' },
    { id:'ic8',  name:'Naturals Ice Cream',     weight:'80 g',   price:75,  mrp:85,  emoji:'🍨', tag:'POPULAR' },
    { id:'ic9',  name:'Magnum Classic',         weight:'100 ml', price:90,  mrp:100, emoji:'🍫' },
    { id:'ic10', name:"Ben & Jerry's Chocolate",weight:'500 ml', price:550, mrp:650, emoji:'🍨', tag:'PREMIUM' },
    { id:'ic11', name:'Dairy Milk Ice Cream Bar',weight:'58 ml', price:50,  mrp:55,  emoji:'🍫' },
    { id:'ic12', name:'Kwality Walls Feast',    weight:'60 ml',  price:30,  mrp:35,  emoji:'🍦' },
    { id:'ic13', name:'Amul Chocolate Cone',    weight:'125 ml', price:45,  mrp:52,  emoji:'🍦' },
    { id:'ic14', name:'Frozen Peas',            weight:'500 g',  price:75,  mrp:88,  emoji:'🫛' },
    { id:'ic15', name:'Frozen Sweet Corn',      weight:'500 g',  price:80,  mrp:95,  emoji:'🌽' },
    { id:'ic16', name:'McCain Aloo Tikki',      weight:'400 g',  price:145, mrp:170, emoji:'🟤' },
    { id:'ic17', name:'McCain Smiles',          weight:'420 g',  price:155, mrp:180, emoji:'🍟' },
    { id:'ic18', name:'Kwality Walls Sundae',   weight:'125 ml', price:65,  mrp:75,  emoji:'🍨' },
    { id:'ic19', name:'Go! Protein Yogurt',     weight:'85 g',   price:40,  mrp:46,  emoji:'🫙', tag:'HEALTHY' },
    { id:'ic20', name:'Flavoured Soy Milk',     weight:'200 ml', price:45,  mrp:52,  emoji:'🥛' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ p, qty, onAdd, onInc, onDec }: {
  p: Product; qty: number;
  onAdd: () => void; onInc: () => void; onDec: () => void;
}) {
  const disc = pct(p.price, p.mrp);
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 8px 10px', boxShadow: '0 1px 5px rgba(0,0,0,0.08)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {disc > 0 && (
        <div style={{ position: 'absolute', top: 6, left: 6, background: '#E8F5E9', color: '#0C831F', fontSize: 7.5, fontWeight: 800, borderRadius: 4, padding: '2px 5px' }}>
          {disc}% OFF
        </div>
      )}
      {p.tag && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: '#FFF8E1', color: '#FF8C00', fontSize: 6.5, fontWeight: 800, borderRadius: 4, padding: '2px 4px' }}>
          {p.tag}
        </div>
      )}
      <div style={{ fontSize: 34, textAlign: 'center', marginTop: 14, marginBottom: 2 }}>{p.emoji}</div>
      <div style={{ fontSize: 9.5, color: '#888' }}>{p.weight}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, minHeight: 28 }}>{p.name}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>₹{p.price}</div>
          {p.mrp > p.price && (
            <div style={{ fontSize: 9, color: '#aaa', textDecoration: 'line-through' }}>₹{p.mrp}</div>
          )}
        </div>
        {qty === 0 ? (
          <button onClick={onAdd} style={{ background: '#fff', border: '1.5px solid #0C831F', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0C831F' }}>ADD</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', background: '#0C831F', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            <button onClick={onDec} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 9px', cursor: 'pointer', lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <button onClick={onInc} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 9px', cursor: 'pointer', lineHeight: 1 }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Category Page ────────────────────────────────────────────────────────────

function CategoryPage({ category, cart, onAdd, onInc, onDec, onBack, onViewCart }: {
  category: string;
  cart: CartMap;
  onAdd: (id: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onBack: () => void;
  onViewCart: () => void;
}) {
  const [search, setSearch] = useState('');
  const products = PRODUCTS[category] ?? [];
  const visible  = search ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : products;
  const cartQty  = Object.values(cart).reduce((s, q) => s + q, 0);
  const cartPrice = Object.entries(cart).reduce((s, [id, q]) => {
    const p = products.find(x => x.id === id);
    return p ? s + p.price * q : s;
  }, 0);

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', fontFamily: "'Nunito', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* Status bar */}
      <div style={{ height: 44, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>01:13</span>
        <span style={{ fontSize: 9, color: '#555' }}>Vo LTEB ▌▌▌ 🔋22%</span>
      </div>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '8px 12px 10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0, color: '#1a1a1a', lineHeight: 1, flexShrink: 0 }}>←</button>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
          <span style={{ fontSize: 11, color: '#888' }}>{visible.length} items</span>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#888' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search in ${category}`}
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#333', background: 'transparent', flex: 1, fontFamily: 'inherit' }}
          />
          {search && <span onClick={() => setSearch('')} style={{ fontSize: 12, color: '#aaa', cursor: 'pointer' }}>✕</span>}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '10px 10px', paddingBottom: cartQty > 0 ? 80 : 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {visible.map(p => (
            <ProductCard
              key={p.id} p={p} qty={cart[p.id] ?? 0}
              onAdd={() => onAdd(p.id)}
              onInc={() => onInc(p.id)}
              onDec={() => onDec(p.id)}
            />
          ))}
        </div>
        {visible.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: '#aaa' }}>
            <div style={{ fontSize: 36 }}>🔍</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>No results for "{search}"</div>
          </div>
        )}
      </div>

      {/* View cart pill */}
      {cartQty > 0 && (
        <div onClick={onViewCart} style={{ position: 'absolute', bottom: 10, left: 14, right: 14, background: '#0C831F', borderRadius: 14, padding: '11px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer', zIndex: 20, boxShadow: '0 6px 20px rgba(12,131,31,0.45)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18 }}>🛒</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{cartQty} item{cartQty !== 1 ? 's' : ''}</span>
          </div>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center' }}>₹{cartPrice}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>View cart</span>
            <span style={{ fontSize: 13, color: '#F8C22C', fontWeight: 700 }}>▶</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Flat product lookup (built once from all categories) ─────────────────────

const ALL_PRODUCTS: Record<string, Product> = {};
Object.values(PRODUCTS).forEach(list => list.forEach(p => { ALL_PRODUCTS[p.id] = p; }));

// ─── Tracking Screen ──────────────────────────────────────────────────────────

const TRACK_STAGES = [
  { label: 'Order Confirmed',  icon: '✅', detail: 'We have received your order' },
  { label: 'Being Packed',     icon: '📦', detail: 'Your items are being packed' },
  { label: 'Out for Delivery', icon: '🛵', detail: 'Rahul is on the way to you' },
  { label: 'Delivered',        icon: '🎉', detail: 'Enjoy your order!' },
];

function TrackingScreen({ total, onBackHome }: { total: number; onBackHome: () => void }) {
  const [stage, setStage]     = useState(0);
  const [seconds, setSeconds] = useState(480);
  const [riderX, setRiderX]   = useState(10);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 6000);
    const t2 = setTimeout(() => setStage(2), 16000);
    const t3 = setTimeout(() => { setStage(3); setDone(true); }, 52000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (stage === 2) {
      const iv = setInterval(() => setRiderX(x => Math.min(78, x + 1.2)), 500);
      return () => clearInterval(iv);
    }
  }, [stage]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const etaLabel = done ? 'Delivered!' : `${mins}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', fontFamily: "'Nunito', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Status bar */}
      <div style={{ height: 44, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>01:14</span>
        <span style={{ fontSize: 9, color: '#555' }}>Vo LTEB ▌▌▌ 🔋22%</span>
      </div>

      {/* Header */}
      <div style={{ background: '#fff', padding: '8px 14px 12px', borderBottom: '1px solid #eee', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Order Tracking</span>
        <button onClick={onBackHome} style={{ background: '#E8F5E9', border: 'none', fontSize: 11, color: '#0C831F', fontWeight: 700, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>Home</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>

        {/* ETA card */}
        <div style={{ background: done ? '#0C831F' : '#fff', margin: '10px 10px 8px', borderRadius: 14, padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.5s' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: done ? 'rgba(255,255,255,0.2)' : '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {done ? '🎉' : '🕐'}
          </div>
          <div>
            <div style={{ fontSize: 11, color: done ? 'rgba(255,255,255,0.8)' : '#888', marginBottom: 2 }}>{done ? 'Your order has been' : 'Estimated arrival in'}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: done ? '#fff' : '#1a1a1a', lineHeight: 1.1 }}>{etaLabel}</div>
            <div style={{ fontSize: 10, color: done ? 'rgba(255,255,255,0.75)' : '#888', marginTop: 2 }}>₹{total} paid via Google Pay UPI</div>
          </div>
        </div>

        {/* Map placeholder */}
        <div style={{ margin: '0 10px 8px', borderRadius: 14, overflow: 'hidden', height: 120, background: 'linear-gradient(145deg,#E8F5E9,#C8E6C9)', position: 'relative', boxShadow: '0 1px 5px rgba(0,0,0,0.08)' }}>
          {/* Road */}
          <div style={{ position: 'absolute', bottom: 42, left: 0, right: 0, height: 3, background: '#aaa', opacity: 0.4 }} />
          {/* Store marker */}
          <div style={{ position: 'absolute', left: 10, bottom: 44, fontSize: 20 }}>🏪</div>
          {/* Home marker */}
          <div style={{ position: 'absolute', right: 10, bottom: 44, fontSize: 20 }}>🏠</div>
          {/* Rider */}
          {stage >= 2 && (
            <div style={{ position: 'absolute', bottom: 40, left: `${riderX}%`, fontSize: 22, transition: 'left 0.5s linear', filter: done ? 'none' : 'none' }}>
              🛵
            </div>
          )}
          {/* Dashed path */}
          <div style={{ position: 'absolute', bottom: 44, left: '12%', right: '12%', height: 2, borderTop: '2px dashed #0C831F', opacity: 0.5 }} />
          {/* Map label */}
          <div style={{ position: 'absolute', top: 8, left: 12, background: 'rgba(255,255,255,0.85)', borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 700, color: '#0C831F' }}>
            LIVE TRACKING
          </div>
          {/* Dotted streets */}
          <div style={{ position: 'absolute', top: 20, left: '30%', width: 1, height: 50, background: '#ccc', opacity: 0.4 }} />
          <div style={{ position: 'absolute', top: 20, left: '65%', width: 1, height: 50, background: '#ccc', opacity: 0.4 }} />
        </div>

        {/* Stage timeline */}
        <div style={{ background: '#fff', margin: '0 10px 8px', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 5px rgba(0,0,0,0.07)' }}>
          {TRACK_STAGES.map((s, i) => {
            const isCompleted = i < stage;
            const isActive    = i === stage;
            const isPending   = i > stage;
            return (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < TRACK_STAGES.length - 1 ? 14 : 0 }}>
                {/* Icon + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 32 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: isCompleted ? '#0C831F' : isActive ? '#E8F5E9' : '#f5f5f5',
                    border: isActive ? '2px solid #0C831F' : isCompleted ? 'none' : '2px solid #ddd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isCompleted ? 14 : 16,
                  }}>
                    {isCompleted ? <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>✓</span> : s.icon}
                  </div>
                  {i < TRACK_STAGES.length - 1 && (
                    <div style={{ width: 2, height: 20, background: isCompleted ? '#0C831F' : '#eee', marginTop: 2, borderRadius: 2 }} />
                  )}
                </div>
                {/* Label */}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: isActive || isCompleted ? 700 : 500, color: isPending ? '#bbb' : '#1a1a1a' }}>{s.label}</div>
                  {(isActive || isCompleted) && (
                    <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{s.detail}</div>
                  )}
                </div>
                {isActive && !done && (
                  <div style={{ marginLeft: 'auto', paddingTop: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0C831F', animation: 'pulse 1s infinite' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Delivery partner */}
        {stage >= 2 && (
          <div style={{ background: '#fff', margin: '0 10px 10px', borderRadius: 14, padding: '12px 16px', boxShadow: '0 1px 5px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>Rahul Kumar</div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>⭐ 4.8 · Delivery Partner</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8F5E9', border: 'none', cursor: 'pointer', fontSize: 16 }}>📞</button>
              <button style={{ width: 36, height: 36, borderRadius: '50%', background: '#E8F5E9', border: 'none', cursor: 'pointer', fontSize: 16 }}>💬</button>
            </div>
          </div>
        )}

        {/* Order details */}
        <div style={{ background: '#fff', margin: '0 10px 10px', borderRadius: 14, padding: '12px 16px', boxShadow: '0 1px 5px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#555' }}>Items total</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#555' }}>Delivery fee</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0C831F' }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Total paid</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

const SUGGESTED = [
  { id: 's1', name: 'English Cucumber',                           weight: '500 g', price: 26, mrp: 32, emoji: '🥒', offer: '18% OFF on MRP', reviews: '10,713' },
  { id: 's2', name: "Baker's Loaf Zero Preservatives Bread",      weight: '350 g', price: 77, mrp: 85, emoji: '🍞', offer: '9% OFF on MRP',  reviews: '1,022'  },
  { id: 's3', name: 'Wingreens Farms Tandoori - Flavoured Ma...', weight: '180 g', price: 67, mrp: 70, emoji: '🧄', offer: null,             reviews: '843', stock: '2 left' },
];

interface AiSuggestion {
  name: string; price: number; emoji: string;
  category: string; weight: string; reason: string;
}

function CheckoutPage({ cart, onInc, onDec, onBack }: {
  cart: CartMap;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onBack: () => void;
}) {
  const [suggested, setSugg]       = useState<CartMap>({});
  const [orderPhase, setPhase]     = useState<'idle' | 'placing' | 'tracking'>('idle');
  const [aiSuggestion, setAiSugg]  = useState<AiSuggestion | null>(null);
  const [aiSuggQty, setAiSuggQty]  = useState(0);
  const [aiLoading, setAiLoading]  = useState(false);

  function incSugg(id: string) { setSugg(m => ({ ...m, [id]: (m[id] ?? 0) + 1 })); }
  function decSugg(id: string) { setSugg(m => { const n = { ...m }; if ((n[id] ?? 0) <= 1) delete n[id]; else n[id]--; return n; }); }

  function handlePlaceOrder() {
    setPhase('placing');
    setTimeout(() => setPhase('tracking'), 2200);
  }

  const activeItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: ALL_PRODUCTS[id], qty }))
    .filter(x => x.product);

  const total = activeItems.reduce((s, { product, qty }) => s + product.price * qty, 0);

  // Fetch AI suggestion whenever cart items change (debounced 800ms)
  useEffect(() => {
    if (activeItems.length === 0) { setAiSugg(null); return; }
    const timer = setTimeout(async () => {
      setAiLoading(true);
      try {
        const payload = activeItems.map(({ product }) => ({
          name: product.name,
          category: Object.keys(PRODUCTS).find(cat => PRODUCTS[cat].some(p => p.id === product.id)) ?? 'General',
          weight: product.weight,
        }));
        const res = await api.post<{ success: boolean; data: AiSuggestion }>('/api/cart-suggestion', { cartItems: payload });
        if (res.data.success) { setAiSugg(res.data.data); setAiSuggQty(0); }
      } catch {
        // silently ignore — suggestion is non-critical
      } finally {
        setAiLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(Object.keys(cart).sort())]);

  if (orderPhase === 'tracking') {
    return <TrackingScreen total={total} onBackHome={onBack} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', fontFamily: "'Nunito', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 44, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>01:14</span>
        <span style={{ fontSize: 9, color: '#555' }}>Vo LTEB ▌▌▌ 🔋22%</span>
      </div>
      <div style={{ background: '#fff', padding: '8px 14px 12px', borderBottom: '1px solid #eee', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0, color: '#1a1a1a', lineHeight: 1 }}>←</button>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Checkout</span>
        <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', padding: '0 4px' }}>🔍</button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: '0 2px' }}>
          <span style={{ fontSize: 14 }}>↗</span><span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>Share</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ background: '#fff', margin: '8px 10px', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 5px rgba(0,0,0,0.07)' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🕐</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>Delivery in 8 minutes</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>Shipment of {activeItems.length} items</div>
          </div>
        </div>

        <div style={{ background: '#fff', margin: '0 10px', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 5px rgba(0,0,0,0.07)' }}>
          {activeItems.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 12 }}>Your cart is empty</div>
          )}
          {activeItems.map(({ product: item, qty }, i) => (
            <div key={item.id} style={{ padding: '14px', borderBottom: i < activeItems.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 58, height: 58, background: '#f8f8f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{item.name}</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{item.weight}</div>
                <div style={{ fontSize: 10, color: '#0C831F', marginTop: 5, cursor: 'pointer', fontWeight: 500 }}>Move to wishlist</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#0C831F', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => onDec(item.id)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '5px 10px', cursor: 'pointer', lineHeight: 1 }}>−</button>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 18, textAlign: 'center' }}>{qty}</span>
                  <button onClick={() => onInc(item.id)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '5px 10px', cursor: 'pointer', lineHeight: 1 }}>+</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>₹{item.price * qty}</div>
                  {item.mrp > item.price && <div style={{ fontSize: 10, color: '#aaa', textDecoration: 'line-through' }}>₹{item.mrp * qty}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI-powered suggestion card */}
        {(aiLoading || aiSuggestion) && (
          <div style={{ margin: '10px 10px 0', background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 5px rgba(0,0,0,0.08)', border: '1.5px solid #E8F5E9' }}>
            {/* Header — shows reason from AI once loaded, skeleton while loading */}
            <div style={{ background: 'linear-gradient(90deg,#E8F5E9,#F1F8E9)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>✨</span>
              {aiLoading || !aiSuggestion ? (
                <div style={{ flex: 1, height: 10, background: '#c8e6c9', borderRadius: 5 }} />
              ) : (
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0C831F', flex: 1 }}>{aiSuggestion.reason}</span>
              )}
              <span style={{ fontSize: 9, color: '#555', fontWeight: 500, flexShrink: 0 }}>AI Powered</span>
            </div>

            {aiLoading ? (
              <div style={{ padding: '16px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: '#f0f0f0' }} />
                  <div style={{ width: 40, height: 8, background: '#f0f0f0', borderRadius: 4 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: '70%', height: 10, background: '#f0f0f0', borderRadius: 5, marginBottom: 8 }} />
                  <div style={{ width: '40%', height: 10, background: '#f0f0f0', borderRadius: 5, marginBottom: 8 }} />
                  <div style={{ width: '55%', height: 8, background: '#f0f0f0', borderRadius: 4 }} />
                </div>
              </div>
            ) : aiSuggestion && (
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {/* Left: emoji + weight below */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                      {aiSuggestion.emoji}
                    </div>
                    <span style={{ fontSize: 9, color: '#444', textAlign: 'center' }}>{aiSuggestion.weight}</span>
                  </div>
                  {/* Right: name → price → rating */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>{aiSuggestion.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>₹{aiSuggestion.price}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#0C831F', background: '#E8F5E9', borderRadius: 4, padding: '1px 5px' }}>most reordered</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <span style={{ fontSize: 10, color: '#F59E0B', letterSpacing: -1 }}>★★★★★</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>4.5</span>
                      <span style={{ fontSize: 9, color: '#555' }}>2,847</span>
                    </div>
                  </div>
                  {/* ADD / stepper */}
                  <div style={{ flexShrink: 0 }}>
                    {aiSuggQty === 0 ? (
                      <button onClick={() => setAiSuggQty(1)} style={{ background: '#fff', border: '1.5px solid #0C831F', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0C831F' }}>ADD</span>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', background: '#0C831F', borderRadius: 8, overflow: 'hidden' }}>
                        <button onClick={() => setAiSuggQty(q => Math.max(0, q - 1))} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '5px 9px', cursor: 'pointer', lineHeight: 1 }}>−</button>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 18, textAlign: 'center' }}>{aiSuggQty}</span>
                        <button onClick={() => setAiSuggQty(q => q + 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, padding: '5px 9px', cursor: 'pointer', lineHeight: 1 }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Social proof */}
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10 }}>🔥</span>
                  <span style={{ fontSize: 9.5, color: '#444' }}>2,000+ people ordered this within 15 km radius</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ margin: '12px 10px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 10 }}>You might also like</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {SUGGESTED.map(s => (
              <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: '10px 8px', width: 110, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {s.offer && <div style={{ fontSize: 7.5, background: '#E8F5E9', color: '#0C831F', borderRadius: 3, padding: '1px 4px', fontWeight: 700, alignSelf: 'flex-start' }}>{s.offer}</div>}
                <div style={{ fontSize: 30, textAlign: 'center', margin: '4px 0' }}>{s.emoji}</div>
                <div style={{ fontSize: 9.5, color: '#888' }}>{s.weight}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>₹{s.price}</div>
                    <div style={{ fontSize: 9, color: '#aaa', textDecoration: 'line-through' }}>₹{s.mrp}</div>
                  </div>
                  {suggested[s.id] ? (
                    <div style={{ display: 'flex', alignItems: 'center', background: '#0C831F', borderRadius: 6, overflow: 'hidden' }}>
                      <button onClick={() => decSugg(s.id)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, padding: '3px 7px', cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>−</button>
                      <span style={{ fontSize: 11, color: '#fff', minWidth: 14, textAlign: 'center', fontWeight: 700 }}>{suggested[s.id]}</span>
                      <button onClick={() => incSugg(s.id)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 14, padding: '3px 7px', cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => setSugg(m => ({ ...m, [s.id]: 1 }))} style={{ background: '#fff', border: '1.5px solid #0C831F', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#0C831F' }}>ADD</span>
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 9, color: '#1a1a1a', lineHeight: 1.3, fontWeight: 500, marginTop: 2 }}>{s.name}</div>
                <div style={{ fontSize: 8, color: '#888' }}>⭐⭐⭐⭐⭐ {s.reviews}</div>
                {'stock' in s && s.stock && <div style={{ fontSize: 8, color: '#FF5722', fontWeight: 600 }}>🔴 {s.stock}</div>}
                <div style={{ fontSize: 8.5, color: '#0C831F', cursor: 'pointer', fontWeight: 600 }}>See more like this ▶</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', margin: '12px 10px', borderRadius: 12, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a' }}>Delivering to Home</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>
              3rd floor, 77 Paramount Gardens, Jyotipuram, Ben...
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0C831F', cursor: 'pointer', flexShrink: 0 }}>Change</span>
        </div>
        <div style={{ height: 12 }} />
      </div>

      <div style={{ background: '#fff', borderTop: '1px solid #eee', padding: '10px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: '#777' }}>PAY USING ▲</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginTop: 1 }}>📱 Google Pay UPI</div>
        </div>
        <button onClick={handlePlaceOrder} style={{ background: '#0C831F', borderRadius: 10, border: 'none', padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }}>₹{total} TOTAL</div>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Place Order ▶</div>
        </button>
      </div>

      {/* Placing overlay */}
      {orderPhase === 'placing' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.97)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 60, gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid #E8F5E9', borderTopColor: '#0C831F', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Placing your order...</div>
          <div style={{ fontSize: 11, color: '#888' }}>Connecting to the nearest store</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function SectionGrid({ title, cats, onCatClick }: { title: string; cats: CatTile[]; onCatClick: (label: string) => void }) {
  return (
    <div style={{ padding: '8px 10px 12px' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
        {cats.map(cat => (
          <div key={cat.label} onClick={() => onCatClick(cat.label)} style={{ background: cat.bg, borderRadius: 10, padding: '10px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 24 }}>{cat.emoji}</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3 }}>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({ cart, onAdd, onInc, onDec, onViewCart, onCatClick }: {
  cart: CartMap;
  onAdd: (id: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onViewCart: () => void;
  onCatClick: (label: string) => void;
}) {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch]       = useState('');
  const cartQty = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <div style={{ width: '100%', height: '100%', background: '#f5f5f5', fontFamily: "'Nunito', system-ui, sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 44, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>01:13</span>
        <span style={{ fontSize: 9, color: '#555' }}>Vo LTEB ▌▌▌ 🔋22%</span>
      </div>

      <div style={{ background: '#fff', padding: '0 14px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 500 }}>Blinkit in</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 1 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>8 minutes</span>
              <span style={{ background: '#F8C22C', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#000' }}>24/7</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>HOME - 3rd floor, 77, Paramount</span>
              <span style={{ fontSize: 11 }}>▾</span>
            </div>
          </div>
          <div style={{ paddingTop: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>👤</span>
            </div>
          </div>
        </div>
        <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#888' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search "bouquet"'
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#333', background: 'transparent', flex: 1, fontFamily: 'inherit' }} />
          <span style={{ fontSize: 16, color: '#555' }}>🎙️</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
        {TOP_CATS.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            style={{ flex: '0 0 auto', padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: activeCat === cat.id ? '2.5px solid #0C831F' : '2.5px solid transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
            {'badge' in cat && cat.badge && (
              <span style={{ position: 'absolute', top: 4, right: 4, background: '#FF5722', color: '#fff', fontSize: 6.5, fontWeight: 800, borderRadius: 3, padding: '1px 3px' }}>New</span>
            )}
            <span style={{ fontSize: 20 }}>{cat.icon}</span>
            <span style={{ fontSize: 9.5, fontWeight: activeCat === cat.id ? 700 : 500, color: activeCat === cat.id ? '#0C831F' : '#555', whiteSpace: 'nowrap' }}>{cat.label}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: cartQty > 0 ? 106 : 56 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 10px 8px' }}>
          {BANNERS.map((b, i) => (
            <div key={i} style={{ flexShrink: 0, width: i === 0 ? 108 : 118, height: 96, background: b.bg, borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '8px 10px', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: b.badge ? '2px solid rgba(255,255,255,0.3)' : 'none' }}>
              {b.badge && <span style={{ position: 'absolute', top: 6, left: 8, background: '#F8C22C', color: '#000', fontSize: 7, fontWeight: 800, borderRadius: 4, padding: '1px 5px' }}>{b.badge}</span>}
              {!b.badge && <span style={{ position: 'absolute', top: 6, left: 8, background: 'rgba(255,255,255,0.9)', color: '#FF6D00', fontSize: 7, fontWeight: 800, borderRadius: 4, padding: '2px 5px', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line' }}>NEWLY{'\n'}LAUNCHED</span>}
              <span style={{ fontSize: 26, marginTop: b.badge ? 12 : 10, marginBottom: 4 }}>{b.emoji}</span>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-line' }}>{b.label}</div>
              {b.sub && <div style={{ background: '#F8C22C', borderRadius: 5, padding: '2px 8px', marginTop: 4 }}><span style={{ fontSize: 8, fontWeight: 700, color: '#000' }}>{b.sub}</span></div>}
            </div>
          ))}
        </div>

        <div style={{ padding: '4px 10px 10px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 10 }}>Frequently bought</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {FREQ_GROUPS.map(g => (
              <div key={g.label} style={{ flex: 1, background: g.bg, borderRadius: 12, padding: '10px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, color: '#888', alignSelf: 'flex-start' }}>+{g.more} more</div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>{g.emojis.join(' ')}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{g.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 10px 12px' }}>
          <button style={{ width: '100%', background: '#E8F5E9', border: 'none', borderRadius: 12, padding: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🛒</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0C831F' }}>See all products</span>
            <span style={{ fontSize: 13, color: '#0C831F' }}>▶</span>
          </button>
        </div>

        <div style={{ padding: '0 10px 12px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a', marginBottom: 10 }}>Continue browsing for</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[{ label: '2 days ago', emoji: '🌾' }, { label: 'Recently Viewed', emoji: '🥬' }].map(item => (
              <div key={item.label} style={{ flexShrink: 0, width: 100, background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 8, color: '#888' }}>⏱ {item.label}</span>
                  <span style={{ fontSize: 10, color: '#aaa' }}>✕</span>
                </div>
                <div style={{ fontSize: 30, textAlign: 'center', padding: '4px 0' }}>{item.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        <SectionGrid title="Grocery & Kitchen" cats={GROCERY_CATS} onCatClick={onCatClick} />
        <SectionGrid title="Snacks & Drinks"   cats={SNACK_CATS}    onCatClick={onCatClick} />

        <div style={{ padding: '8px 10px 4px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>Beauty & Personal Care</div>
        </div>
      </div>

      {cartQty > 0 && (
        <div onClick={onViewCart} style={{ position: 'absolute', bottom: 60, left: 14, right: 14, background: '#0C831F', borderRadius: 14, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', zIndex: 20, boxShadow: '0 6px 20px rgba(12,131,31,0.45)' }}>
          <span style={{ fontSize: 20 }}>🛒</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1 }}>{cartQty} item{cartQty !== 1 ? 's' : ''}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>View cart</span>
          <span style={{ fontSize: 14, color: '#F8C22C', fontWeight: 700 }}>▶</span>
        </div>
      )}

      <div style={{ background: '#fff', borderTop: '1px solid #eee', display: 'flex', alignItems: 'stretch', height: 56, flexShrink: 0 }}>
        {[{ icon: '🏠', label: 'Home', active: true }, { icon: '🔄', label: 'Order Again', active: false }, { icon: '⊞', label: 'Categories', active: false }, { icon: '🖨️', label: 'Print', active: false }].map(item => (
          <button key={item.label} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 8, color: item.active ? '#0C831F' : '#888', fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
        <button style={{ flex: 1, background: '#5C3EFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>district</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

type View = 'home' | 'category' | 'cart';

function BlinkitApp() {
  const [view,     setView]     = useState<View>('home');
  const [category, setCategory] = useState('');
  const [cart,     setCart]     = useState<CartMap>({});

  function add(id: string) { setCart(c => ({ ...c, [id]: 1 })); }
  function inc(id: string) { setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 })); }
  function dec(id: string) {
    setCart(c => { const n = { ...c }; if ((n[id] ?? 0) <= 1) delete n[id]; else n[id]--; return n; });
  }

  function openCategory(label: string) {
    if (PRODUCTS[label]) { setCategory(label); setView('category'); }
  }

  if (view === 'cart')     return <CheckoutPage cart={cart} onInc={inc} onDec={dec} onBack={() => setView('home')} />;
  if (view === 'category') return (
    <CategoryPage
      category={category} cart={cart}
      onAdd={add} onInc={inc} onDec={dec}
      onBack={() => setView('home')}
      onViewCart={() => setView('cart')}
    />
  );

  return (
    <HomePage
      cart={cart} onAdd={add} onInc={inc} onDec={dec}
      onViewCart={() => setView('cart')}
      onCatClick={openCategory}
    />
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export function MvpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 select-none">
      <p className="text-sm text-muted-foreground mb-6 tracking-wide uppercase font-medium">
        Blinkit — Interactive Prototype
      </p>
      <div style={{ width: 375, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.45))' }}>
        <div style={{ width: 375, height: 760, borderRadius: 52, background: '#0f0f0f', padding: 10, border: '1.5px solid rgba(255,255,255,0.08)', position: 'relative', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: -3,  top: 130, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3,  top: 178, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', right: -3, top: 160, width: 3, height: 60, background: '#222', borderRadius: '0 3px 3px 0' }} />
          <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#0f0f0f', borderRadius: 20, zIndex: 30 }} />
            <BlinkitApp />
          </div>
        </div>
      </div>
    </div>
  );
}
