import { useState } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  weight: string;
  price: number;
  mrp: number;
  emoji: string;
  category: string;
  tag?: string;
};

const CATEGORIES = [
  { id: 'vegetables', label: 'Vegetables', emoji: '🥬' },
  { id: 'fruits',     label: 'Fruits',     emoji: '🍎' },
  { id: 'dairy',      label: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'snacks',     label: 'Snacks',     emoji: '🍿' },
  { id: 'beverages',  label: 'Beverages',  emoji: '🧃' },
];

const PRODUCTS: Product[] = [
  // Vegetables (10)
  { id: 'v1',  category: 'vegetables', emoji: '🍅', name: 'Tomatoes',       weight: '500 g',  price: 25,  mrp: 30,  tag: 'FRESH' },
  { id: 'v2',  category: 'vegetables', emoji: '🧅', name: 'Onions',         weight: '1 kg',   price: 35,  mrp: 40 },
  { id: 'v3',  category: 'vegetables', emoji: '🥔', name: 'Potatoes',       weight: '1 kg',   price: 40,  mrp: 50 },
  { id: 'v4',  category: 'vegetables', emoji: '🌿', name: 'Spinach',        weight: '250 g',  price: 18,  mrp: 22,  tag: 'ORGANIC' },
  { id: 'v5',  category: 'vegetables', emoji: '🫑', name: 'Capsicum',       weight: '250 g',  price: 30,  mrp: 38 },
  { id: 'v6',  category: 'vegetables', emoji: '🥦', name: 'Broccoli',       weight: '500 g',  price: 65,  mrp: 80,  tag: 'POPULAR' },
  { id: 'v7',  category: 'vegetables', emoji: '🥕', name: 'Carrots',        weight: '500 g',  price: 28,  mrp: 35 },
  { id: 'v8',  category: 'vegetables', emoji: '🥒', name: 'Cucumber',       weight: '500 g',  price: 22,  mrp: 28 },
  { id: 'v9',  category: 'vegetables', emoji: '🌶️', name: 'Green Chilli',   weight: '100 g',  price: 12,  mrp: 15 },
  { id: 'v10', category: 'vegetables', emoji: '🧄', name: 'Garlic',         weight: '100 g',  price: 20,  mrp: 25 },

  // Fruits (10)
  { id: 'f1',  category: 'fruits',     emoji: '🍌', name: 'Banana',         weight: '6 pcs',  price: 35,  mrp: 45,  tag: 'POPULAR' },
  { id: 'f2',  category: 'fruits',     emoji: '🍎', name: 'Apple Shimla',   weight: '4 pcs',  price: 120, mrp: 150 },
  { id: 'f3',  category: 'fruits',     emoji: '🥭', name: 'Alphonso Mango', weight: '1 kg',   price: 180, mrp: 220, tag: 'SEASONAL' },
  { id: 'f4',  category: 'fruits',     emoji: '🍇', name: 'Green Grapes',   weight: '500 g',  price: 70,  mrp: 90 },
  { id: 'f5',  category: 'fruits',     emoji: '🍉', name: 'Watermelon',     weight: '1 piece',price: 60,  mrp: 75 },
  { id: 'f6',  category: 'fruits',     emoji: '🍈', name: 'Papaya',         weight: '1 piece',price: 55,  mrp: 70 },
  { id: 'f7',  category: 'fruits',     emoji: '🍍', name: 'Pineapple',      weight: '1 piece',price: 65,  mrp: 80 },
  { id: 'f8',  category: 'fruits',     emoji: '🍓', name: 'Strawberries',   weight: '250 g',  price: 99,  mrp: 130, tag: 'FRESH' },
  { id: 'f9',  category: 'fruits',     emoji: '🥝', name: 'Kiwi',           weight: '4 pcs',  price: 99,  mrp: 120 },
  { id: 'f10', category: 'fruits',     emoji: '🍊', name: 'Oranges',        weight: '4 pcs',  price: 60,  mrp: 75 },

  // Dairy & Eggs (10)
  { id: 'd1',  category: 'dairy',      emoji: '🥛', name: 'Amul Taza Milk', weight: '1 L',    price: 68,  mrp: 72,  tag: 'BESTSELLER' },
  { id: 'd2',  category: 'dairy',      emoji: '🧈', name: 'Amul Butter',    weight: '200 g',  price: 112, mrp: 125 },
  { id: 'd3',  category: 'dairy',      emoji: '🧀', name: 'Amul Cheese',    weight: '200 g',  price: 99,  mrp: 115 },
  { id: 'd4',  category: 'dairy',      emoji: '🍶', name: 'Mother Dairy Dahi', weight: '400 g', price: 45, mrp: 52 },
  { id: 'd5',  category: 'dairy',      emoji: '🥮', name: 'Amul Paneer',    weight: '200 g',  price: 85,  mrp: 99 },
  { id: 'd6',  category: 'dairy',      emoji: '🥚', name: 'Farm Fresh Eggs', weight: '12 pcs', price: 89, mrp: 99,  tag: 'POPULAR' },
  { id: 'd7',  category: 'dairy',      emoji: '🥤', name: 'Amul Buttermilk', weight: '200 ml', price: 20, mrp: 22 },
  { id: 'd8',  category: 'dairy',      emoji: '🍦', name: 'Amul Fresh Cream', weight: '200 ml', price: 55, mrp: 62 },
  { id: 'd9',  category: 'dairy',      emoji: '🫙', name: 'Amul Ghee',      weight: '500 ml', price: 290, mrp: 325 },
  { id: 'd10', category: 'dairy',      emoji: '🍯', name: 'Milkmaid',       weight: '200 g',  price: 48,  mrp: 55 },

  // Snacks (10)
  { id: 's1',  category: 'snacks',     emoji: '🥔', name: "Lay's Classic",  weight: '52 g',   price: 20,  mrp: 20,  tag: 'BESTSELLER' },
  { id: 's2',  category: 'snacks',     emoji: '🌽', name: 'Kurkure Masala', weight: '55 g',   price: 20,  mrp: 20 },
  { id: 's3',  category: 'snacks',     emoji: '🍜', name: 'Maggi 2-Min',    weight: '70 g × 4', price: 56, mrp: 60 },
  { id: 's4',  category: 'snacks',     emoji: '🫘', name: "Haldiram's Bhujia", weight: '200 g', price: 80, mrp: 90 },
  { id: 's5',  category: 'snacks',     emoji: '🍪', name: 'Oreo Cream',     weight: '150 g',  price: 35,  mrp: 40 },
  { id: 's6',  category: 'snacks',     emoji: '🍘', name: 'Britannia Good Day', weight: '150 g', price: 30, mrp: 35 },
  { id: 's7',  category: 'snacks',     emoji: '🫙', name: 'Pringles Original', weight: '107 g', price: 99, mrp: 110, tag: 'POPULAR' },
  { id: 's8',  category: 'snacks',     emoji: '🍿', name: 'Act II Popcorn', weight: '120 g',  price: 35,  mrp: 40 },
  { id: 's9',  category: 'snacks',     emoji: '🎂', name: 'Dark Fantasy',   weight: '75 g',   price: 35,  mrp: 40 },
  { id: 's10', category: 'snacks',     emoji: '🌰', name: 'Parle-G Biscuits', weight: '800 g', price: 50, mrp: 55 },

  // Beverages (10)
  { id: 'b1',  category: 'beverages',  emoji: '🥤', name: 'Coca-Cola',      weight: '750 ml', price: 45,  mrp: 45,  tag: 'POPULAR' },
  { id: 'b2',  category: 'beverages',  emoji: '🥤', name: 'Pepsi',          weight: '750 ml', price: 40,  mrp: 40 },
  { id: 'b3',  category: 'beverages',  emoji: '🧃', name: 'Real Juice Mixed', weight: '1 L',  price: 99,  mrp: 120 },
  { id: 'b4',  category: 'beverages',  emoji: '🍊', name: 'Tropicana Orange', weight: '1 L',  price: 105, mrp: 130 },
  { id: 'b5',  category: 'beverages',  emoji: '⚡', name: 'Red Bull Energy', weight: '250 ml', price: 125, mrp: 135, tag: 'NEW' },
  { id: 'b6',  category: 'beverages',  emoji: '💚', name: 'Sprite',         weight: '750 ml', price: 40,  mrp: 40 },
  { id: 'b7',  category: 'beverages',  emoji: '🟡', name: 'Mountain Dew',   weight: '750 ml', price: 40,  mrp: 40 },
  { id: 'b8',  category: 'beverages',  emoji: '☕', name: 'Nescafé Gold',   weight: '200 g',  price: 320, mrp: 380 },
  { id: 'b9',  category: 'beverages',  emoji: '🍫', name: 'Bournvita',      weight: '500 g',  price: 230, mrp: 265 },
  { id: 'b10', category: 'beverages',  emoji: '🍵', name: 'Tetley Green Tea', weight: '25 bags', price: 180, mrp: 210 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function pct(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100);
}

type CartMap = Record<string, number>;

function ProductCard({ product, qty, onAdd, onInc, onDec }: {
  product: Product;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}) {
  const discount = pct(product.price, product.mrp);
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '10px 8px', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
      {discount > 0 && (
        <div style={{ position: 'absolute', top: 8, left: 8, background: '#E8F5E9', color: '#1a8c2a', fontSize: 8.5, fontWeight: 700, borderRadius: 4, padding: '2px 5px' }}>
          {discount}% OFF
        </div>
      )}
      {product.tag && (
        <div style={{ position: 'absolute', top: 8, right: 8, background: '#FFF8E1', color: '#e65100', fontSize: 7.5, fontWeight: 700, borderRadius: 4, padding: '2px 4px' }}>
          {product.tag}
        </div>
      )}
      <div style={{ fontSize: 38, textAlign: 'center', marginTop: 14, marginBottom: 4 }}>{product.emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>{product.name}</div>
      <div style={{ fontSize: 9.5, color: '#888' }}>{product.weight}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>₹{product.price}</div>
          {product.mrp > product.price && (
            <div style={{ fontSize: 9.5, color: '#aaa', textDecoration: 'line-through' }}>₹{product.mrp}</div>
          )}
        </div>
        {qty === 0 ? (
          <button
            onClick={onAdd}
            style={{ background: '#fff', border: '1.5px solid #0C831F', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0C831F' }}>ADD</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#0C831F', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={onDec} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <button onClick={onInc} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CartSheet({ cart, onClose, onInc, onDec }: {
  cart: CartMap;
  onClose: () => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) {
  const items = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0);
  const total = items.reduce((s, p) => s + p.price * cart[p.id], 0);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: '20px 20px 0 0', maxHeight: '78%', display: 'flex', flexDirection: 'column' }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#ddd' }} />
        </div>
        <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>My Cart</div>
          <div style={{ fontSize: 12, color: '#0C831F', fontWeight: 600 }}>⚡ Delivery in 8 mins</div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {items.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #f8f8f8' }}>
              <div style={{ fontSize: 28 }}>{p.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{p.weight}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: '#0C831F', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => onDec(p.id)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}>−</button>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', minWidth: 20, textAlign: 'center' }}>{cart[p.id]}</span>
                <button onClick={() => onInc(p.id)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, padding: '4px 8px', cursor: 'pointer', lineHeight: 1 }}>+</button>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', minWidth: 44, textAlign: 'right' }}>₹{p.price * cart[p.id]}</div>
            </div>
          ))}
        </div>
        {/* Bill summary */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Items total</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#555' }}>Delivery fee</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0C831F' }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 8, marginTop: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>To Pay</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>₹{total}</span>
          </div>
        </div>
        {/* Checkout button */}
        <div style={{ padding: '10px 16px 20px' }}>
          <button style={{ width: '100%', background: '#0C831F', borderRadius: 12, border: 'none', padding: '14px', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Proceed to Pay · ₹{total}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function BlinkitApp() {
  const [activeCat, setActiveCat] = useState('vegetables');
  const [cart, setCart] = useState<CartMap>({});
  const [showCart, setShowCart] = useState(false);
  const [searchText, setSearchText] = useState('');

  const totalQty = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalPrice = PRODUCTS.filter((p) => cart[p.id]).reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0);

  function add(id: string) { setCart((c) => ({ ...c, [id]: 1 })); }
  function inc(id: string) { setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })); }
  function dec(id: string) {
    setCart((c) => {
      const next = { ...c };
      if ((next[id] ?? 0) <= 1) delete next[id]; else next[id]--;
      return next;
    });
  }

  const visibleProducts = PRODUCTS.filter((p) => {
    const matchesCat = p.category === activeCat;
    const matchesSearch = searchText
      ? p.name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ width: '100%', height: '100%', background: '#f2f2f2', fontFamily: "'Nunito', system-ui, sans-serif", display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Status bar spacer */}
      <div style={{ height: 46, background: '#0C831F', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ background: '#0C831F', padding: '0 14px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, background: '#F8C22C', borderRadius: 5, padding: '2px 6px', color: '#000', letterSpacing: 0.3 }}>⚡ 8 MINS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>📍 Sector 15, Gurugram</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>▾</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 1 }}>Haryana 122001</div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 19, cursor: 'pointer' }}>🔍</span>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => totalQty > 0 && setShowCart(true)}>
              <span style={{ fontSize: 21 }}>🛒</span>
              {totalQty > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, background: '#F8C22C', borderRadius: '50%', fontSize: 8.5, fontWeight: 700, color: '#000', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalQty}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Search bar */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#888' }}>🔍</span>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder='Search "atta, chips, milk…"'
            style={{ border: 'none', outline: 'none', fontSize: 12, color: '#333', background: 'transparent', flex: 1, fontFamily: 'inherit' }}
          />
          {searchText && (
            <span onClick={() => setSearchText('')} style={{ fontSize: 13, color: '#aaa', cursor: 'pointer' }}>✕</span>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); setSearchText(''); }}
            style={{
              flex: '0 0 auto',
              padding: '10px 14px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderBottom: activeCat === cat.id ? '2.5px solid #0C831F' : '2.5px solid transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{ fontSize: 18 }}>{cat.emoji}</span>
            <span style={{ fontSize: 9.5, fontWeight: activeCat === cat.id ? 700 : 500, color: activeCat === cat.id ? '#0C831F' : '#555', whiteSpace: 'nowrap' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Category header */}
      <div style={{ padding: '10px 12px 4px', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
          {CATEGORIES.find((c) => c.id === activeCat)?.emoji}&nbsp;
          {CATEGORIES.find((c) => c.id === activeCat)?.label}
        </div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{visibleProducts.length} items</div>
      </div>

      {/* Product grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px', paddingBottom: totalQty > 0 ? 72 : 10, scrollbarWidth: 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] ?? 0}
              onAdd={() => add(p.id)}
              onInc={() => inc(p.id)}
              onDec={() => dec(p.id)}
            />
          ))}
        </div>
      </div>

      {/* Cart bar */}
      {totalQty > 0 && (
        <div
          onClick={() => setShowCart(true)}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0C831F', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', zIndex: 20 }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{totalQty} item{totalQty !== 1 ? 's' : ''}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>₹{totalPrice}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F8C22C' }}>View Cart</span>
            <span style={{ fontSize: 14, color: '#F8C22C' }}>→</span>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      {showCart && (
        <CartSheet
          cart={cart}
          onClose={() => setShowCart(false)}
          onInc={inc}
          onDec={dec}
        />
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function MvpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 select-none">
      <p className="text-sm text-muted-foreground mb-6 tracking-wide uppercase font-medium">
        Blinkit — Interactive Prototype
      </p>

      <div style={{ width: 375, filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))' }}>
        <div
          style={{
            width: 375,
            height: 760,
            borderRadius: 52,
            background: '#0f0f0f',
            padding: 10,
            border: '1.5px solid rgba(255,255,255,0.08)',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          {/* Side buttons */}
          <div style={{ position: 'absolute', left: -3, top: 130, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 178, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', right: -3, top: 160, width: 3, height: 60, background: '#222', borderRadius: '0 3px 3px 0' }} />

          {/* Screen */}
          <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: '#f2f2f2', position: 'relative' }}>
            {/* Dynamic Island */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#0f0f0f', borderRadius: 20, zIndex: 30 }} />
            <BlinkitApp />
          </div>
        </div>
      </div>
    </div>
  );
}
