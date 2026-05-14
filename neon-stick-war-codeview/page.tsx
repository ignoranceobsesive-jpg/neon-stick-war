/**
 * ============================================================================
 * NEON STICK WAR — MAIN GAME WRAPPER
 * ============================================================================
 *
 * This is the ONLY page in the app. It loads the game inside an iframe and
 * provides all the "native" features the game can't do on its own:
 *
 *   1. ADS — Game requests ads via postMessage, we show real AdMob ads
 *   2. AUTH — Auto anonymous Firebase sign-in for cloud saves
 *   3. CLOUD SAVES — Upload/download game progress via Firebase Firestore
 *   4. MATCHMAKING — Online 1v1 opponent search overlay
 *   5. MOBILE STABILITY — Pause audio, reset inputs when app goes to background
 *
 * COMMUNICATION: Game (iframe) ←→ This page (parent) via window.postMessage()
 *   Game sends:  neon-show-rewarded-ad, neon-cloud-save, neon-search-match, etc.
 *   We send:    ad-rewarded, cloud-save-loaded, match-found, etc.
 *
 * GAME FILE: public/game/index.html → loads 0cf1o-rq41zxz.js (the entire game)
 * ============================================================================
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { matchmakingBridge, type MatchmakingState } from '@/lib/matchmaking-bridge'
import { autoSignIn, handleRedirectResult, onAuthChange } from '@/lib/firebase-auth'
import { downloadSaveFromCloud } from '@/lib/firebase-firestore'
import { AdManager } from '@/lib/admob'
import { logAnalyticsEvent } from '@/lib/firebase'

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [matchState, setMatchState] = useState<MatchmakingState>('idle')
  const [matchInfo, setMatchInfo] = useState<any>(null)
  const adManagerRef = useRef<AdManager | null>(null)

  // Initialize services
  useEffect(() => {
    // Init AdMob
    const adManager = AdManager.getInstance();
    adManager.initialize();
    adManagerRef.current = adManager;

    // Init Firebase Auth - auto sign in and cloud save sync
    handleRedirectResult();
    autoSignIn();
    
    let cloudFetchDone = false;
    const unsub = onAuthChange(async (state) => {
      if (state.user && !cloudFetchDone) {
        cloudFetchDone = true;
        try {
          const cloudData = await downloadSaveFromCloud();
          if (cloudData && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'cloud-save-loaded',
              data: cloudData,
            }, '*');
          }
        } catch {
          // Cloud fetch failure is non-critical
        }
      }
    });

    // Log app open
    logAnalyticsEvent('app_open', { platform: typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.() ? 'android' : 'web' });

    // Matchmaking state listener
    const unsubMatch = matchmakingBridge.onStateChange((state, data) => {
      setMatchState(state);
      if (data) setMatchInfo(data);
    });

    return () => {
      unsub();
      unsubMatch();
    };
  }, [])

  // Mobile stability: audio pause on screen off + input reset
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && iframeRef.current?.contentWindow) {
        try {
          const win = iframeRef.current.contentWindow as any
          if (win.__resetAllInputs) win.__resetAllInputs()
          if (win.__neonWarriorControls?.stopMove) win.__neonWarriorControls.stopMove()
          if (win.__neonAudioManager?.pauseAll) win.__neonAudioManager.pauseAll()
          if (win.__gameAudioCtx?.state === 'running') win.__gameAudioCtx.suspend()
        } catch {}
      }
      if (!document.hidden && iframeRef.current?.contentWindow) {
        try {
          const win = iframeRef.current.contentWindow as any
          if (win.__neonAudioManager?.resumeAll) win.__neonAudioManager.resumeAll()
          if (win.__gameAudioCtx?.state === 'suspended') win.__gameAudioCtx.resume()
        } catch {}
      }
    }

    const handleBlur = () => {
      if (iframeRef.current?.contentWindow) {
        try {
          const win = iframeRef.current.contentWindow as any
          if (win.__resetAllInputs) win.__resetAllInputs()
          if (win.__neonWarriorControls?.stopMove) win.__neonWarriorControls.stopMove()
          if (win.__neonWarriorControls?.stopShoot) win.__neonWarriorControls.stopShoot()
          if (win.__neonAudioManager?.pauseAll) win.__neonAudioManager.pauseAll()
          if (win.__gameAudioCtx?.state === 'running') win.__gameAudioCtx.suspend()
        } catch {}
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('pagehide', handleBlur)

    const preventDefaults = (e: TouchEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', preventDefaults, { passive: false });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('pagehide', handleBlur)
      document.removeEventListener('touchmove', preventDefaults);
    }
  }, [])

  // Listen for messages from game iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const { type, data } = event.data || {};
      if (!type) return;

      switch (type) {
        case 'neon-show-rewarded-ad':
          if (adManagerRef.current) {
            const result = await adManagerRef.current.showRewardedAd(
              data?.onProgress ? (p: number) => {
                iframeRef.current?.contentWindow?.postMessage({
                  type: 'ad-progress', data: { progress: p }
                }, '*');
              } : undefined
            );
            if (result.rewarded) {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'ad-rewarded', data: { amount: data?.rewardAmount || 200 }
              }, '*');
              logAnalyticsEvent('ad_rewarded', { type: 'rewarded', amount: data?.rewardAmount });
            }
          }
          break;

        case 'neon-show-interstitial-ad':
          if (adManagerRef.current) {
            await adManagerRef.current.showInterstitialAd();
            logAnalyticsEvent('ad_interstitial', { type: 'interstitial' });
          }
          break;

        case 'neon-show-banner-ad':
          if (adManagerRef.current) {
            await adManagerRef.current.showBannerAd();
          }
          break;

        case 'neon-hide-banner-ad':
          if (adManagerRef.current) {
            await adManagerRef.current.hideBannerAd();
          }
          break;

        case 'neon-level-complete':
          if (adManagerRef.current) {
            const shouldShowAd = adManagerRef.current.onLevelComplete();
            if (shouldShowAd) {
              await adManagerRef.current.showInterstitialAd();
              logAnalyticsEvent('ad_interstitial_level', { level: data?.level });
            }
          }
          logAnalyticsEvent('level_complete', { level: data?.level, score: data?.score });
          break;

        case 'neon-cloud-save':
          try {
            const { uploadSaveToCloud } = await import('@/lib/firebase-firestore');
            const success = await uploadSaveToCloud(data);
            if (success) {
              logAnalyticsEvent('cloud_save', { level: data?.highestLevel });
            }
          } catch {}
          break;

        case 'neon-cloud-load':
          try {
            const { downloadSaveFromCloud } = await import('@/lib/firebase-firestore');
            const cloudData = await downloadSaveFromCloud();
            if (cloudData) {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'cloud-save-loaded', data: cloudData
              }, '*');
            }
          } catch {}
          break;

        case 'neon-analytics':
          logAnalyticsEvent(data?.event || 'custom', data?.params || {});
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCancelSearch = useCallback(() => {
    matchmakingBridge.cancelSearch();
  }, []);

  const showMatchmakingOverlay = matchState === 'searching' || matchState === 'found';

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
      
      {showMatchmakingOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto"
          style={{ backgroundColor: 'rgba(5,5,16,0.9)' }}
        >
          <div className="text-center p-6 max-w-sm">
            {matchState === 'searching' && (
              <>
                <div className="text-4xl mb-4 animate-pulse">🌐</div>
                <h2 className="text-xl font-bold font-mono mb-2"
                  style={{ color: '#00ffff', textShadow: '0 0 15px #00ffff' }}>
                  SEARCHING FOR OPPONENT
                </h2>
                <div className="w-48 h-1 mx-auto rounded-full overflow-hidden"
                  style={{ backgroundColor: '#222' }}>
                  <div className="h-full rounded-full animate-pulse"
                    style={{ backgroundColor: '#00ffff', width: '60%' }} />
                </div>
                <p className="text-xs font-mono mt-3" style={{ color: '#666' }}>
                  ELO: {matchInfo?.queueSize ? `Queue: ${matchInfo.queueSize}` : 'Waiting...'}
                </p>
                <button onClick={handleCancelSearch}
                  className="mt-4 px-6 py-2 text-sm font-bold font-mono rounded"
                  style={{ backgroundColor: 'rgba(255,0,0,0.15)', border: '1px solid #ff3333', color: '#ff3333' }}>
                  CANCEL
                </button>
              </>
            )}
            {matchState === 'found' && (
              <>
                <div className="text-4xl mb-4">⚔️</div>
                <h2 className="text-xl font-bold font-mono mb-3"
                  style={{ color: '#ffd700', textShadow: '0 0 15px #ffd700' }}>
                  MATCH FOUND!
                </h2>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono"
                      style={{ color: '#00ff66' }}>
                      {matchInfo?.player1?.username || 'Player 1'}
                    </div>
                    <div className="text-xs font-mono" style={{ color: '#666' }}>
                      ELO: {matchInfo?.player1?.elo || 1000}
                    </div>
                  </div>
                  <div className="text-lg font-bold font-mono" style={{ color: '#ff6600' }}>VS</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono"
                      style={{ color: '#ccff00' }}>
                      {matchInfo?.player2?.username || 'Player 2'}
                    </div>
                    <div className="text-xs font-mono" style={{ color: '#666' }}>
                      ELO: {matchInfo?.player2?.elo || 1000}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-mono animate-pulse"
                  style={{ color: '#00ffff' }}>
                  Starting in 3...
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
