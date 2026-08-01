export function MvpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 select-none">
      {/* Label */}
      <p className="text-sm text-muted-foreground mb-6 tracking-wide uppercase font-medium">
        Blinkit — Live App
      </p>

      {/* Phone shell */}
      <div
        className="relative flex flex-col items-center"
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
          {/* Side buttons - volume up */}
          <div style={{ position: 'absolute', left: -3, top: 130, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 178, width: 3, height: 36, background: '#222', borderRadius: '3px 0 0 3px' }} />
          {/* Side button - power */}
          <div style={{ position: 'absolute', right: -3, top: 160, width: 3, height: 60, background: '#222', borderRadius: '0 3px 3px 0' }} />

          {/* Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 44,
              overflow: 'hidden',
              background: '#fff',
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
                zIndex: 10,
              }}
            />

            {/* iframe */}
            <iframe
              src="https://blinkit.com"
              title="Blinkit"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              allow="geolocation"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/50 mt-6">
        If the app doesn't load, Blinkit may block external embedding.
      </p>
    </div>
  );
}
