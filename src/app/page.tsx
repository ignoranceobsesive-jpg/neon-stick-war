'use client'

export default function Home() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#050510]"
      style={{ width: '100vw', height: '100dvh' }}
    >
      <iframe
        src="/game/index.html"
        className="absolute inset-0 border-0"
        style={{ width: '100%', height: '100%' }}
        title="Neon Stickman: Stick War"
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}
