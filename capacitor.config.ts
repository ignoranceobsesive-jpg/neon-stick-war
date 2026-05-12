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
