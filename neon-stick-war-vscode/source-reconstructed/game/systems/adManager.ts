/**
 * Ad Manager - Handles ad display for both native (Capacitor/AdMob) and web platforms
 * 
 * On native platforms (Android/iOS), uses the Capacitor AdMob plugin for real ads.
 * On web platforms, provides simulated ad experiences with progress callbacks.
 * Implements the Singleton pattern for global access.
 */

/** Progress callback for simulated ads - receives (percentComplete, elapsedMs) */
export type AdProgressCallback = (percent: number, elapsedMs: number) => void;

/** Result of a rewarded ad attempt */
export interface RewardedAdResult {
  /** Whether the user earned the reward */
  rewarded: boolean;
  /** Reason for failure if not rewarded */
  reason?: "cooldown" | "closed_early" | "error";
  /** Duration of the ad experience in milliseconds */
  durationMs: number;
}

/** AdMob unit IDs for the application */
const AD_IDS = {
  /** Interstitial ad unit ID */
  interstitial: "ca-app-pub-6439599735010649/8990244364",
  /** Rewarded video ad unit ID */
  rewarded: "ca-app-pub-6439599735010649/4027131683",
  /** Banner ad unit ID */
  banner: "ca-app-pub-6439599735010649/7774805003",
} as const;

/** Minimum milliseconds between interstitial ad displays */
const INTERSTITIAL_COOLDOWN_MS = 60000;

/** Minimum milliseconds between rewarded ad displays */
const REWARDED_COOLDOWN_MS = 3000;

/** Duration of simulated interstitial ads on web (ms) */
const SIMULATED_INTERSTITIAL_DURATION = 2000;

/** Duration range for simulated rewarded ads on web (ms) */
const SIMULATED_REWARDED_MIN_DURATION = 3000;
const SIMULATED_REWARDED_MAX_DURATION = 5000;

/** How often to show interstitial ads (every N completed levels) */
const INTERSTITIAL_LEVEL_INTERVAL = 2;

/**
 * AdManager - Manages ad display for monetization.
 * 
 * On Capacitor native platforms, integrates with AdMob for real ads.
 * On web platforms, provides simulated ad experiences with progress callbacks
 * for UI integration.
 * 
 * Usage:
 * ```typescript
 * const adManager = AdManager.getInstance();
 * await adManager.initialize();
 * 
 * // Show interstitial after levels
 * if (adManager.onLevelComplete()) {
 *   await adManager.showInterstitial(onProgress);
 * }
 * 
 * // Show rewarded ad for in-game rewards
 * const result = await adManager.showRewardedAd(onProgress);
 * if (result.rewarded) {
 *   // Grant reward
 * }
 * ```
 */
class AdManager {
  /** Singleton instance */
  private static instance: AdManager | null = null;

  /** Number of levels completed since last interstitial */
  private levelsCompleted = 0;

  /** Whether a banner ad is currently visible */
  private bannerVisible = false;

  /** Timestamp of last rewarded ad display */
  private lastAdTime = 0;

  /** Timestamp of last interstitial ad display */
  private lastInterstitialTime = 0;

  /** Total number of ads watched across all types */
  private adsWatchedCount = 0;

  /** Whether AdMob native plugin is ready */
  private admobReady = false;

  /** Whether running in test mode */
  private isTesting = false;

  private constructor() {}

  /**
   * Gets the singleton instance of AdManager.
   * Creates one if it doesn't exist yet.
   */
  static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Checks if the app is running on a native Capacitor platform.
   * 
   * @returns True if running on Android/iOS via Capacitor
   */
  private isNativePlatform(): boolean {
    return !!window.Capacitor?.isNativePlatform?.();
  }

  /**
   * Initializes the AdMob SDK on native platforms.
   * On web platforms, logs that simulated ads will be used.
   * Must be called before any ad display methods.
   */
  async initialize(): Promise<void> {
    if (!this.isNativePlatform()) {
      console.log("[AdManager] Web mode - using simulated ads");
      this.admobReady = false;
      return;
    }

    try {
      const { AdMob } = await import("@capacitor-community/admob");
      await AdMob.initialize({
        initializeForTesting: this.isTesting,
      });
      this.admobReady = true;
      console.log("[AdManager] Native AdMob initialized");
    } catch (error) {
      console.error("[AdManager] Native AdMob init failed; using fallback ads:", error);
      this.admobReady = false;
    }
  }

  /**
   * Tracks level completion and determines if an interstitial should be shown.
   * Interstitials are shown every INTERSTITIAL_LEVEL_INTERVAL levels.
   * 
   * @returns True if an interstitial ad should be shown now
   */
  onLevelComplete(): boolean {
    this.levelsCompleted++;
    return this.levelsCompleted % INTERSTITIAL_LEVEL_INTERVAL === 0;
  }

  /**
   * Checks if enough time has passed since the last interstitial
   * to show another one (respects the cooldown period).
   * 
   * @returns True if an interstitial can be shown
   */
  canShowInterstitial(): boolean {
    return Date.now() - this.lastInterstitialTime > INTERSTITIAL_COOLDOWN_MS;
  }

  /**
   * Shows an interstitial ad.
   * On native platforms, uses AdMob interstitial ads.
   * On web, simulates a 2-second ad with progress callbacks.
   * 
   * @param onProgress - Optional callback receiving (percentComplete, elapsedMs)
   * @returns True if the ad was shown successfully
   */
  async showInterstitial(onProgress?: AdProgressCallback): Promise<boolean> {
    if (!this.canShowInterstitial()) return false;

    this.lastInterstitialTime = Date.now();
    this.adsWatchedCount++;

    // Native AdMob path
    if (this.isNativePlatform() && this.admobReady) {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.prepareInterstitial({
          adId: AD_IDS.interstitial,
          isTesting: this.isTesting,
        });
        await AdMob.showInterstitial();
        return true;
      } catch (error) {
        console.error("[AdManager] Interstitial failed:", error);
        return false;
      }
    }

    // Web simulated ad path
    return new Promise<boolean>((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min(100, (elapsed / SIMULATED_INTERSTITIAL_DURATION) * 100);
        onProgress?.(percent, elapsed);

        if (elapsed >= SIMULATED_INTERSTITIAL_DURATION) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
    });
  }

  /**
   * Shows a rewarded video ad.
   * On native platforms, uses AdMob rewarded video ads.
   * On web, simulates a 3-5 second ad with progress callbacks.
   * 
   * @param onProgress - Optional callback receiving (percentComplete, elapsedMs)
   * @returns Result indicating whether the user earned the reward
   */
  async showRewardedAd(onProgress?: AdProgressCallback): Promise<RewardedAdResult> {
    // Cooldown check
    if (Date.now() - this.lastAdTime < REWARDED_COOLDOWN_MS) {
      return { rewarded: false, reason: "cooldown", durationMs: 0 };
    }

    this.lastAdTime = Date.now();
    this.adsWatchedCount++;

    // Native AdMob path
    if (this.isNativePlatform() && this.admobReady) {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.prepareRewardVideoAd({
          adId: AD_IDS.rewarded,
          isTesting: this.isTesting,
        });
        const result = await AdMob.showRewardVideoAd();

        if (result.type === "earned") {
          return { rewarded: true, durationMs: 0 };
        }
        return { rewarded: false, reason: "closed_early", durationMs: 0 };
      } catch (error) {
        console.error("[AdManager] Rewarded ad failed:", error);
        return { rewarded: false, reason: "error", durationMs: 0 };
      }
    }

    // Web simulated ad path - random duration between 3-5 seconds
    const adDuration =
      SIMULATED_REWARDED_MIN_DURATION +
      SIMULATED_REWARDED_MAX_DURATION * Math.random();
    const startTime = Date.now();

    return new Promise<RewardedAdResult>((resolve) => {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min(100, (elapsed / adDuration) * 100);
        onProgress?.(percent, elapsed);

        if (elapsed >= adDuration) {
          clearInterval(interval);
          resolve({ rewarded: true, durationMs: elapsed });
        }
      }, 50);
    });
  }

  /**
   * Shows a rewarded ad with success/failure callbacks.
   * Convenience method that wraps showRewardedAd().
   * 
   * @param onSuccess - Called if the user earned the reward
   * @param onFailure - Called if the user did not earn the reward (receives reason)
   * @param onProgress - Optional progress callback
   */
  async showRewardedAdWithCallbacks(
    onSuccess: () => void,
    onFailure?: (reason: string) => void,
    onProgress?: AdProgressCallback
  ): Promise<void> {
    const result = await this.showRewardedAd(onProgress);
    if (result.rewarded) {
      onSuccess();
    } else if (onFailure && result.reason) {
      onFailure(result.reason);
    }
  }

  /**
   * Shows a banner ad at the bottom of the screen.
   * On native platforms, uses AdMob adaptive banners.
   * 
   * @returns Promise that resolves when the banner is shown (or fails silently on web)
   */
  async showBannerAd(): Promise<void> {
    this.bannerVisible = true;

    if (this.isNativePlatform() && this.admobReady) {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.prepareBanner({
          adId: AD_IDS.banner,
          isTesting: this.isTesting,
          position: "BOTTOM_CENTER",
          adSize: "ADAPTIVE_BANNER",
        });
        await AdMob.showBanner();
      } catch (error) {
        console.error("[AdManager] Banner failed:", error);
      }
    }
  }

  /**
   * Hides the currently visible banner ad.
   * On native platforms, uses the AdMob hide method.
   */
  async hideBannerAd(): Promise<void> {
    this.bannerVisible = false;

    if (this.isNativePlatform() && this.admobReady) {
      try {
        const { AdMob } = await import("@capacitor-community/admob");
        await AdMob.hideBanner();
      } catch (error) {
        console.error("[AdManager] Hide banner failed:", error);
      }
    }
  }

  /**
   * Checks if a banner ad is currently visible.
   * 
   * @returns True if a banner is being displayed
   */
  isBannerVisible(): boolean {
    return this.bannerVisible;
  }

  /**
   * Gets the number of levels completed since the last reset.
   * Used for interstitial ad scheduling.
   * 
   * @returns Number of completed levels
   */
  getLevelsCompleted(): number {
    return this.levelsCompleted;
  }

  /**
   * Gets the total number of ads watched across all sessions.
   * 
   * @returns Total ad watch count
   */
  getAdsWatched(): number {
    return this.adsWatchedCount;
  }

  /**
   * Resets all tracking counters.
   * Typically called when starting a new game session.
   */
  reset(): void {
    this.levelsCompleted = 0;
    this.adsWatchedCount = 0;
    this.lastInterstitialTime = 0;
  }
}

/** Exported singleton instance for global use */
export const adManager = AdManager.getInstance();

export default AdManager;
