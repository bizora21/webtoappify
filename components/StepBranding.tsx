import React from 'react';
import { AppConfig } from '../types';
import { Palette, Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  config: AppConfig;
  onChange: (updates: Partial<AppConfig>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepBranding: React.FC<Props> = ({ config, onChange, onNext, onBack }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'splash') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      if (type === 'icon') {
        onChange({ iconFile: file, iconUrl: url });
      } else {
        onChange({ splashFile: file, splashUrl: url });
      }
    }
  };

  // Allow proceeding without icon for testing flow (will use default in backend if needed)
  const isFormValid = true;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          Visual Identity
        </h2>

        <div className="space-y-6">
          {/* App Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">App Icon (512x512px recommended)</label>
            <div className="flex items-center gap-4">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed overflow-hidden bg-slate-50 ${!config.iconUrl ? 'border-slate-300' : 'border-indigo-500'}`}>
                {config.iconUrl ? (
                  <img src={config.iconUrl} alt="Icon Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Icon
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'icon')} />
                </label>
                <p className="text-xs text-slate-500 mt-2">Supports PNG, JPG. Auto-generated for all densities.</p>
              </div>
            </div>
          </div>

          {/* Splash Screen */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Splash Screen Logo (Optional)</label>
            <div className="flex items-center gap-4">
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed overflow-hidden bg-slate-50 ${!config.splashUrl ? 'border-slate-300' : 'border-indigo-500'}`}>
                {config.splashUrl ? (
                  <img src={config.splashUrl} alt="Splash Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400 text-center px-2">Auto-generated if empty</span>
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Splash
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'splash')} />
                </label>
              </div>
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Primary Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-sm"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="uppercase w-32 border border-slate-300 rounded-lg px-3 py-2 font-mono text-sm"
              />
              <p className="text-xs text-slate-500">Used for status bar and system chrome.</p>
            </div>
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
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isFormValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
        >
          Next Step: Features
        </button>
      </div>
    </div>
  );
};

export default StepBranding;