import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.owlsnake-studios.ritual',
  appName: 'ritual',
  webDir: 'dist/ritual-app/browser',
  plugins: {
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: true,
        twitter: false
      }
    }
  },
  server: {
    hostname: 'ritual.co.uk',
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
