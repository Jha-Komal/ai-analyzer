function BlinkitApp() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f2f2f2', fontFamily: 'system-ui, sans-serif', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Status bar spacer (dynamic island area) */}
      <div style={{ height: 52, background: '#0C831F', flexShrink: 0 }} />

      {/* Header */}
      <div style={{ background: '#0C831F', padding: '0 14px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, background: '#F8C22C', borderRadius: 4, padding: '1px 5px', color: '#000' }}>⚡ 8 mins</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>📍 Sector 15, Gurugram</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>▾</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>🔔</span>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 20 }}>🛒</span>
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#F8C22C', borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#000', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>
          </div>
        </div>
        {/* Search */}
        <div style={{ background: '#fff', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#888' }}>🔍</span>
          <span style={{ fontSize: 13, color: '#aaa' }}>Search for "atta, chips, milk…"</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 60 }}>

        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg, #F8C22C 0%, #f5a623 100%)', margin: '10px 10px 0', borderRadius: 14, padding: '16px 16px 12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 72, opacity: 0.18 }}>🛍️</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#a05c00', textTransform: 'uppercase', letterSpacing: 1 }}>Limited Time Offer</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2, marginTop: 3 }}>Fresh Groceries<br />at Your Door</div>
          <div style={{ fontSize: 12, color: '#5a3a00', marginTop: 4 }}>Flat 20% off on first order</div>
          <div style={{ marginTop: 10, background: '#0C831F', borderRadius: 8, padding: '7px 14px', display: 'inline-block' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Shop Now →</span>
          </div>
        </div>

        {/* Secondary banners row */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 10px 0' }}>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #e8f4fd, #c8e6f9)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>🥛</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#1565c0', marginTop: 3 }}>Dairy & Eggs</div>
            <div style={{ fontSize: 9, color: '#555' }}>Up to 15% off</div>
          </div>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #fef3e2, #fde0b0)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>🍎</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#e65100', marginTop: 3 }}>Fresh Fruits</div>
            <div style={{ fontSize: 9, color: '#555' }}>From ₹29</div>
          </div>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #f1f8e9, #dcedc8)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>🥦</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#2e7d32', marginTop: 3 }}>Vegetables</div>
            <div style={{ fontSize: 9, color: '#555' }}>Farm fresh</div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '14px 10px 6px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Shop by Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {[
              { emoji: '🥬', label: 'Veggies' },
              { emoji: '🍌', label: 'Fruits' },
              { emoji: '🥛', label: 'Dairy' },
              { emoji: '🍫', label: 'Snacks' },
              { emoji: '🧴', label: 'Beauty' },
              { emoji: '🧹', label: 'Cleaning' },
              { emoji: '🍜', label: 'Instant' },
              { emoji: '🐾', label: 'Pet Care' },
              { emoji: '💊', label: 'Pharma' },
              { emoji: '🍼', label: 'Baby' },
            ].map((c) => (
              <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: '8px 4px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 20 }}>{c.emoji}</div>
                <div style={{ fontSize: 8.5, color: '#444', marginTop: 3, fontWeight: 500 }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div style={{ padding: '10px 10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>🔥 Best Sellers</div>
            <div style={{ fontSize: 11, color: '#0C831F', fontWeight: 600 }}>See all →</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { emoji: '🥛', name: 'Amul Taza Milk', weight: '1 L', price: 68, mrp: 75, tag: 'BESTSELLER' },
              { emoji: '🍞', name: 'Britannia Bread', weight: '400 g', price: 42, mrp: 45, tag: null },
              { emoji: '🥚', name: 'Farm Eggs', weight: '12 pcs', price: 89, mrp: 99, tag: '10% OFF' },
              { emoji: '🧀', name: 'Amul Butter', weight: '200 g', price: 112, mrp: 120, tag: null },
            ].map((p) => (
              <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                {p.tag && (
                  <div style={{ background: p.tag === 'BESTSELLER' ? '#fff3e0' : '#e8f5e9', color: p.tag === 'BESTSELLER' ? '#e65100' : '#2e7d32', fontSize: 8, fontWeight: 700, borderRadius: 4, padding: '2px 5px', display: 'inline-block', marginBottom: 6 }}>
                    {p.tag}
                  </div>
                )}
                <div style={{ fontSize: 36, textAlign: 'center', margin: '4px 0 8px' }}>{p.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>{p.weight}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>₹{p.price}</span>
                    <span style={{ fontSize: 10, color: '#aaa', textDecoration: 'line-through', marginLeft: 4 }}>₹{p.mrp}</span>
                  </div>
                  <div style={{ background: '#0C831F', borderRadius: 8, padding: '5px 10px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>+ ADD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals section */}
        <div style={{ padding: '14px 10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>⚡ Deals of the Day</div>
            <div style={{ fontSize: 11, color: '#0C831F', fontWeight: 600 }}>See all →</div>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { emoji: '🍿', name: 'Lay\'s Chips', sub: '52g × 3', price: 60, off: '25%' },
              { emoji: '🧃', name: 'Real Juice', sub: 'Mixed Fruit 1L', price: 99, off: '15%' },
              { emoji: '🍜', name: 'Maggi Noodles', sub: '4 × 70g', price: 72, off: '10%' },
              { emoji: '☕', name: 'Nescafé Gold', sub: '200g', price: 320, off: '20%' },
            ].map((p) => (
              <div key={p.name} style={{ background: '#fff', borderRadius: 12, padding: 10, minWidth: 120, flexShrink: 0, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', fontSize: 8, fontWeight: 700, borderRadius: 4, padding: '2px 5px', display: 'inline-block', marginBottom: 6 }}>{p.off} OFF</div>
                <div style={{ fontSize: 30, textAlign: 'center', margin: '2px 0 6px' }}>{p.emoji}</div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>{p.sub}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>₹{p.price}</span>
                  <div style={{ background: '#0C831F', borderRadius: 6, padding: '4px 8px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>+ADD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-around', padding: '8px 0 14px', zIndex: 20 }}>
        {[
          { emoji: '🏠', label: 'Home', active: true },
          { emoji: '🔍', label: 'Search', active: false },
          { emoji: '🛒', label: 'Cart', active: false },
          { emoji: '👤', label: 'Profile', active: false },
        ].map((n) => (
          <div key={n.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 20 }}>{n.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: n.active ? 700 : 400, color: n.active ? '#0C831F' : '#888' }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MvpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 select-none">
      <p className="text-sm text-muted-foreground mb-6 tracking-wide uppercase font-medium">
        Blinkit — App Prototype
      </p>

      <div
        style={{
          width: 375,
          filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))',
        }}
      >
        {/* Outer frame */}
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
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 44,
              overflow: 'hidden',
              background: '#f2f2f2',
              position: 'relative',
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 120,
                height: 34,
                background: '#0f0f0f',
                borderRadius: 20,
                zIndex: 30,
              }}
            />
            <BlinkitApp />
          </div>
        </div>
      </div>
    </div>
  );
}
