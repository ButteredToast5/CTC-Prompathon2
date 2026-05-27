import { GroceryItem } from './types';

export const GROCERY_ITEMS: GroceryItem[] = [
  { id: 'item_veg', name: 'Fresh Vegetables & Fruits', price: 15, isNeed: true, category: 'Food', icon: '🍎' },
  { id: 'item_energy', name: 'Hyper-Charge Neon Energy Drink x6', price: 22, isNeed: false, category: 'Drinks', icon: '⚡' },
  { id: 'item_eggs', name: 'Farm Brand Eggs & Milk', price: 10, isNeed: true, category: 'Food', icon: '🥛' },
  { id: 'item_skin', name: 'Cyber-Viper Epic Assault Weapon Skin', price: 45, isNeed: false, category: 'Gaming', icon: '🎮' },
  { id: 'item_bus', name: 'Monthly City Bus & Transit Pass', price: 40, isNeed: true, category: 'Transit', icon: '🚌' },
  { id: 'item_glasses', name: 'Retro Futuristic Golden Wire Sunglasses', price: 65, isNeed: false, category: 'Fashion', icon: '🕶️' },
  { id: 'item_clean_socks', name: 'Comfort-Weave Cotton Socks Pack', price: 12, isNeed: true, category: 'Clothing', icon: '🧦' },
  { id: 'item_truffles', name: 'Belgian Salted Caramel Gold Truffles', price: 30, isNeed: false, category: 'Snacks', icon: '🍫' },
];

export const CRYPTO_TICKS = [
  { second: 0, price: 500, label: 'Start' },
  { second: 1, price: 620, label: 'Twitter Hype' },
  { second: 2, price: 950, label: 'Exchange Listing' },
  { second: 3, price: 1540, label: 'Influencer Post' },
  { second: 4, price: 2310, label: 'FOMO Peak' },
  { second: 5, price: 3200, label: 'ATH Peak!' },
  { second: 6, price: 1400, label: 'Whale Dumps' },
  { second: 7, price: 350, label: 'Panic Selling' },
  { second: 8, price: 45, label: 'Liquidation Event' },
  { second: 9, price: 2, label: 'Rug Pulled (Dead)' }
];
