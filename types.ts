export interface AppConfig {
  // Step 1: Basic Info
  url: string;
  appName: string;
  packageName: string;
  contactEmail: string;

  // Step 2: Branding
  iconUrl: string | null; // For preview purposes (blob URL)
  iconFile: File | null;
  splashUrl: string | null;
  splashFile: File | null;
  primaryColor: string;

  // Step 3: Features
  offlineMode: boolean;
  pushNotifications: boolean;
  fcmKey: string;
  privacyPolicyUrl: string;
}

export const INITIAL_CONFIG: AppConfig = {
  url: '',
  appName: '',
  packageName: '',
  contactEmail: '',
  iconUrl: null,
  iconFile: null,
  splashUrl: null,
  splashFile: null,
  primaryColor: '#4f46e5', // Indigo-600
  offlineMode: false,
  pushNotifications: false,
  fcmKey: '',
  privacyPolicyUrl: '',
};

export type Step = 'info' | 'branding' | 'features' | 'build';