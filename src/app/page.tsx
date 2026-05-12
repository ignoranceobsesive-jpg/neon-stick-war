'use client'

export default function Home() {
  return (
    <div className="w-screen h-[100dvh] overflow-hidden bg-[#050510] relative">
      <iframe
        src="/game/index.html"
        className="absolute inset-0 w-full h-full border-0"
        title="Neon Stickman: Stick War"
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}
