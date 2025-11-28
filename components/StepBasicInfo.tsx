import React from 'react';
import { AppConfig } from '../types';
import { Globe, Smartphone, Package, Mail } from 'lucide-react';

interface Props {
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  onNext: () => void;
}

const StepBasicInfo: React.FC<Props> = ({ config, onChange, onNext }) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ url: val });
    
    // Auto-fill package name if empty and domain is present
    if (!config.packageName && val.includes('.')) {
      try {
        const hostname = new URL(val).hostname;
        const parts = hostname.split('.').reverse();
        const pkg = `com.${parts[0]}.${parts[1] || 'app'}`;
        onChange({ packageName: pkg });
      } catch (err) {
        // invalid url, ignore
      }
    }
  };

  const isFormValid = config.url && config.appName && config.packageName && config.contactEmail;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Basic Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                https://
              </span>
              <input
                type="url"
                value={config.url}
                onChange={handleUrlChange}
                placeholder="yoursite.com"
                className="w-full pl-20 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Must be HTTPS for Trusted Web Activity support.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">App Name</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={config.appName}
                onChange={(e) => onChange({ appName: e.target.value })}
                placeholder="My Awesome App"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
              <div className="relative">
                <Package className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={config.packageName}
                  onChange={(e) => onChange({ packageName: e.target.value })}
                  placeholder="com.company.app"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={config.contactEmail}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                  placeholder="support@company.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            isFormValid 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next Step: Branding
        </button>
      </div>
    </div>
  );
};

export default StepBasicInfo;