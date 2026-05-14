/**
 * ADMOB — Ad system for monetization
 *
 * AdManager (singleton) handles:
 *   - Rewarded ads    → Watch ad = get coins (real on Android, simulated on web)
 *   - Interstitial ads → Full-screen ad every 2 levels
 *   - Banner ads      → Small ad at bottom of screen
 *   - 3-second cooldown between ads
 *
 * Ad IDs: ca-app-pub-6439599735010649
 * Used by: page.tsx (handles neon-show-rewarded-ad, neon-show-interstitial-ad, etc.)
 */

export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-6439599735010649~1983422275',
  rewardedAdId: 'ca-app-pub-6439599735010649/4027131683',
  interstitialAdId: 'ca-app-pub-6439599735010649/8990244364',
  bannerAdId: 'ca-app-pub-6439599735010649/7774805003',
};

export type RewardedAdResult = {
  rewarded: boolean;
  reason?: string;
  durationMs: number;
};

export type AdProgressCallback = (progress: number, elapsedMs: number) => void;
export type AdState = 'idle' | 'loading' | 'showing' | 'completed' | 'error';

export class AdManager {
  private static instance: AdManager;
  private levelsCompleted = 0;
  private readonly INTERSTITIAL_INTERVAL = 2;
  private bannerVisible = false;
  private lastAdTime = 0;
  private readonly AD_COOLDOWN_MS = 3000;
  private isNative = false;
  private admobPlugin: any = null;

  private constructor() {
    this.isNative = typeof window !== 'undefined' && 
      !!(window as any).Capacitor?.isNativePlatform?.();
  }

  static getInstance(): AdManager {
    if (!AdManager.instance) AdManager.instance = new AdManager();
    return AdManager.instance;
  }

  // Initialize AdMob - on native, the plugin is auto-registered by Capacitor
  async initialize(): Promise<void> {
    if (!this.isNative) {
      console.log('[AdMob] Web platform - using simulated fallback');
      return;
    }

    // On native, Capacitor plugins are registered on window.Capacitor.Plugins
    try {
      const Capacitor = (window as any).Capacitor;
      if (Capacitor?.Plugins?.AdMob) {
        this.admobPlugin = Capacitor.Plugins.AdMob;
        await this.admobPlugin.initialize({
          testingDevices: [],
          initializeForTesting: false,
        });
        console.log('[AdMob] Native plugin initialized');
      } else {
        console.warn('[AdMob] Native plugin not found, using fallback');
        this.isNative = false;
      }
    } catch (err) {
      console.warn('[AdMob] Init failed, using fallback:', err);
      this.isNative = false;
    }
  }

  async showBannerAd(): Promise<void> {
    if (this.isNative && this.admobPlugin) {
      try {
        await this.admobPlugin.BannerAd.show({
          adId: ADMOB_CONFIG.bannerAdId,
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        });
        this.bannerVisible = true;
        return;
      } catch (err) {
        console.warn('[AdMob] Banner failed:', err);
      }
    }
    this.bannerVisible = true;
  }

  async hideBannerAd(): Promise<void> {
    if (this.isNative && this.admobPlugin) {
      try {
        await this.admobPlugin.BannerAd.hide();
      } catch {}
    }
    this.bannerVisible = false;
  }

  isBannerVisible(): boolean {
    return this.bannerVisible;
  }

  async showInterstitialAd(onProgress?: AdProgressCallback): Promise<void> {
    if (Date.now() - this.lastAdTime < this.AD_COOLDOWN_MS) return;
    this.lastAdTime = Date.now();

    if (this.isNative && this.admobPlugin) {
      try {
        await this.admobPlugin.InterstitialAd.load({
          adId: ADMOB_CONFIG.interstitialAdId,
        });
        await this.admobPlugin.InterstitialAd.show();
        return;
      } catch (err) {
        console.warn('[AdMob] Interstitial failed:', err);
      }
    }

    // Web fallback
    const durationMs = 5000;
    const startTime = Date.now();
    return new Promise<void>((resolve) => {
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / durationMs) * 100);
        if (onProgress) onProgress(progress, elapsed);
        if (elapsed >= durationMs) {
          clearInterval(progressInterval);
          resolve();
        }
      }, 50);
    });
  }

  async showRewardedAd(onProgress?: AdProgressCallback): Promise<RewardedAdResult> {
    if (Date.now() - this.lastAdTime < this.AD_COOLDOWN_MS) {
      return { rewarded: false, reason: 'cooldown', durationMs: 0 };
    }
    this.lastAdTime = Date.now();

    if (this.isNative && this.admobPlugin) {
      try {
        await this.admobPlugin.RewardedAd.load({
          adId: ADMOB_CONFIG.rewardedAdId,
        });
        const result = await this.admobPlugin.RewardedAd.show();
        return {
          rewarded: result?.type === 'earned' || true,
          durationMs: Date.now() - this.lastAdTime,
        };
      } catch (err) {
        console.warn('[AdMob] Rewarded failed:', err);
      }
    }

    // Web fallback
    const durationMs = 5000 + Math.random() * 10000;
    const startTime = Date.now();
    return new Promise<RewardedAdResult>((resolve) => {
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / durationMs) * 100);
        if (onProgress) onProgress(progress, elapsed);
        if (elapsed >= durationMs) {
          clearInterval(progressInterval);
          resolve({ rewarded: true, durationMs: elapsed });
        }
      }, 50);
    });
  }

  onLevelComplete(): boolean {
    this.levelsCompleted++;
    return this.levelsCompleted % this.INTERSTITIAL_INTERVAL === 0;
  }

  getLevelsCompleted(): number {
    return this.levelsCompleted;
  }

  reset(): void {
    this.levelsCompleted = 0;
  }

  async showRewardedAdWithCallbacks(
    onReward: () => void,
    onSkipped?: (reason: string) => void,
    onProgress?: AdProgressCallback,
  ): Promise<void> {
    const result = await this.showRewardedAd(onProgress);
    if (result.rewarded) onReward();
    else if (onSkipped && result.reason) onSkipped(result.reason);
  }
}
