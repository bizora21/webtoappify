import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Settings, WifiOff, Bell, Shield, Sparkles } from 'lucide-react';
import { generatePrivacyPolicy } from '../services/geminiService';

interface Props {
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepFeatures: React.FC<Props> = ({ config, onChange, onNext, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);

  const handleGeneratePolicy = async () => {
    if (!config.appName || !config.url) {
      setPolicyError("Please ensure App Name and URL are set in step 1.");
      return;
    }
    
    setIsGenerating(true);
    setPolicyError(null);
    try {
      const policy = await generatePrivacyPolicy(config.appName, config.url);
      // In a real app, we'd save this to a file or CMS. Here we'll simulate a hosted URL
      // For the demo, we put the content in the field, but ideally, this field expects a URL.
      // We'll mock a URL for now to pass validation.
      onChange({ privacyPolicyUrl: "https://generated-policy.com/view?id=123" });
      alert("Policy Generated! (Simulated)\n\n" + policy.substring(0, 150) + "...");
    } catch (err) {
      setPolicyError("Failed to generate policy. Please try again or enter manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = !!config.privacyPolicyUrl;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          App Features
        </h2>

        <div className="space-y-6">
          {/* Offline Mode */}
          <div className="flex items-start gap-3 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="pt-1">
              <input
                type="checkbox"
                checked={config.offlineMode}
                onChange={(e) => onChange({ offlineMode: e.target.checked })}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-slate-600" />
                <label className="font-medium text-slate-800">Offline Support</label>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Enables caching so the app opens even without internet. Requires PWA Service Worker on your site.
              </p>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-3 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={config.pushNotifications}
                  onChange={(e) => onChange({ pushNotifications: e.target.checked })}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <label className="font-medium text-slate-800">Push Notifications</label>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Integrate with Firebase Cloud Messaging (FCM).
                </p>
              </div>
            </div>
            
            {config.pushNotifications && (
              <div className="ml-8 mt-2 animate-fade-in">
                <label className="block text-xs font-medium text-slate-700 mb-1">FCM Server Key (Legacy) or JSON Config</label>
                <input
                  type="text"
                  value={config.fcmKey}
                  onChange={(e) => onChange({ fcmKey: e.target.value })}
                  placeholder="Paste your Firebase key here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
                />
              </div>
            )}
          </div>

          {/* Privacy Policy */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Privacy Policy URL (Required for Play Store)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={config.privacyPolicyUrl}
                onChange={(e) => onChange({ privacyPolicyUrl: e.target.value })}
                placeholder="https://yoursite.com/privacy"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleGeneratePolicy}
                disabled={isGenerating}
                className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                   <span className="animate-pulse">Writing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            {policyError && <p className="text-xs text-red-500 mt-1">{policyError}</p>}
            <p className="text-xs text-slate-500 mt-2">
              Google requires a valid privacy policy link. If you don't have one, use our AI generator to create a draft.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isFormValid 
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Generate App Bundle
        </button>
      </div>
    </div>
  );
};

export default StepFeatures;