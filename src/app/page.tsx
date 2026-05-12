'use client'

import { useEffect, useRef } from 'react'

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Reset all game inputs when the page loses focus (prevents ghost inputs)
    const handleVisibilityChange = () => {
      if (document.hidden && iframeRef.current?.contentWindow) {
        try {
          const win = iframeRef.current.contentWindow as any
          if (win.__resetAllInputs) win.__resetAllInputs()
          if (win.__neonWarriorControls?.stopMove) win.__neonWarriorControls.stopMove()
        } catch {}
      }
    }

    const handleBlur = () => {
      if (iframeRef.current?.contentWindow) {
        try {
          const win = iframeRef.current.contentWindow as any
          if (win.__resetAllInputs) win.__resetAllInputs()
          if (win.__neonWarriorControls?.stopMove) win.__neonWarriorControls.stopMove()
        } catch {}
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('pagehide', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('pagehide', handleBlur)
    }
  }, [])

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-[#050510]"
      style={{ width: '100vw', height: '100dvh' }}
    >
      <iframe
        ref={iframeRef}
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
