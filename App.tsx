import React, { useState } from 'react';
import { AppConfig, INITIAL_CONFIG, Step } from './types';
import StepBasicInfo from './components/StepBasicInfo';
import StepBranding from './components/StepBranding';
import StepFeatures from './components/StepFeatures';
import StepBuild from './components/StepBuild';
import PreviewPhone from './components/PreviewPhone';
import { Layers, Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [step, setStep] = useState<Step>('info');

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const reset = () => {
    setConfig(INITIAL_CONFIG);
    setStep('info');
  };

  const renderStep = () => {
    switch (step) {
      case 'info':
        return <StepBasicInfo config={config} onChange={updateConfig} onNext={() => setStep('branding')} />;
      case 'branding':
        return <StepBranding config={config} onChange={updateConfig} onNext={() => setStep('features')} onBack={() => setStep('info')} />;
      case 'features':
        return <StepFeatures config={config} onChange={updateConfig} onNext={() => setStep('build')} onBack={() => setStep('branding')} />;
      case 'build':
        return <StepBuild config={config} onReset={reset} />;
    }
  };

  const stepsList = [
    { id: 'info', label: '1. Basic Info' },
    { id: 'branding', label: '2. Branding' },
    { id: 'features', label: '3. Features' },
    { id: 'build', label: '4. Build App' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">WebToAppify</span>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Convert any URL to Android TWA
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Progress Bar */}
        <div className="mb-8 hidden md:flex items-center justify-center gap-4">
          {stepsList.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                s.id === step 
                ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-2' 
                : step === 'build' || stepsList.findIndex(x => x.id === step) > idx
                ? 'text-green-600 bg-green-50'
                : 'text-slate-400'
              }`}>
                <span>{s.label}</span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form / Wizard */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1">
              {renderStep()}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="hidden lg:block lg:col-span-5">
             <div className="sticky top-24">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">Live Preview</h3>
                  <p className="text-sm text-slate-500">Visual changes update in real-time</p>
                </div>
                <PreviewPhone config={config} />
                
                {step === 'build' && (
                  <div className="mt-8 bg-indigo-900 text-indigo-100 p-4 rounded-lg flex items-start gap-3 text-sm">
                    <Rocket className="w-5 h-5 mt-0.5 shrink-0" />
                    <p>
                      <strong>Pro Tip:</strong> After downloading the .AAB, log in to Google Play Console, create a new release, and upload the file. We've handled the signing keys for you.
                    </p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} WebToAppify. Generated for demo purposes.
        </div>
      </footer>
    </div>
  );
};

export default App;