import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'gps-tracker-app',
  webDir: 'www'
};

// capacitor.config.ts
export default {
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // How long the splash screen is shown (in milliseconds)
      launchAutoHide: false, // Whether the splash screen automatically hides after the duration
      backgroundColor: '#ffffff', // Background color of the splash screen
      androidSplashResourceName: 'splash', // Splash image name for Android
      iosSplashResourceName: 'splash', // Splash image name for iOS
    }
  }
};
