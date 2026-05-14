import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neonstickwar.game',
  appName: 'Neon Stick War',
  webDir: 'public/game',
  server: {
    androidScheme: 'https',
    url: undefined,
    cleartext: true
  },
  plugins: {
    ScreenOrientation: {
      orientation: 'landscape'
    },
    AdMob: {
      appId: 'ca-app-pub-6439599735010649~1983422275',
      bannerAdId: 'ca-app-pub-6439599735010649/7774805003',
      interstitialAdId: 'ca-app-pub-6439599735010649/8990244364',
      rewardedAdId: 'ca-app-pub-6439599735010649/4027131683',
      isTesting: false,
    }
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: '/home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks',
      keystoreAlias: 'neonstickwar',
      keystorePassword: 'NeonStickWar2026!',
      keystoreAliasPassword: 'NeonStickWar2026!',
      signingType: 'apksigner'
    }
  }
};

export default config;
