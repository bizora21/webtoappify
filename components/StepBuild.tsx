import React, { useEffect, useState, useRef } from 'react';
import { AppConfig } from '../types';
import { Terminal, CheckCircle, Download, Smartphone, AlertTriangle } from 'lucide-react';

interface Props {
  config: AppConfig;
  onReset: () => void;
}

const StepBuild: React.FC<Props> = ({ config, onReset }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [status, setStatus] = useState<'idle' | 'building' | 'success' | 'failed'>('idle');
  const [buildId, setBuildId] = useState<string | null>(null);
  const [downloadUrls, setDownloadUrls] = useState<{ aab?: string; apk?: string }>({});
  const logEndRef = useRef<HTMLDivElement>(null);

  // Polling effect
  useEffect(() => {
    if (!buildId) return;
    const interval = setInterval(async () => {
      try {
        const buildData = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/build/${buildId}`).then(r => r.json());
        setProgress(buildData.progress);
        setLogs(buildData.logs);
        setStatus(buildData.status);

        if (buildData.status === 'success') {
          setIsComplete(true);
          setDownloadUrls({ aab: buildData.aabUrl, apk: buildData.apkUrl });
          clearInterval(interval);
        } else if (buildData.status === 'failed') {
          setIsComplete(true);
          clearInterval(interval);
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [buildId]);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleStart = async () => {
    try {
      const formData = new FormData();
      formData.append('config', JSON.stringify(config));

      if (config.iconFile) {
        formData.append('icon', config.iconFile);
      }
      if (config.splashFile) {
        formData.append('splash', config.splashFile);
      }

      const res = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/build`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setBuildId(data.id);
      setLogs(['Build queued...']);
    } catch (e) {
      console.error('Start build error', e);
      setLogs(prev => [...prev, 'Error starting build: ' + e.message]);
    }
  };

  const handleDownload = (type: 'aab' | 'apk') => {
    const url = downloadUrls[type];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${config.packageName || 'app'}-release.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };





  // Start build on component mount
  useEffect(() => {
    handleStart();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 text-slate-200 p-6 rounded-xl shadow-lg border border-slate-700 font-mono text-sm">
        <div className="flex items-center gap-2 border-b border-slate-700 pb-4 mb-4">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="font-semibold">Build Console</span>
        </div>

        <div className="h-64 overflow-y-auto space-y-2 scrollbar-hide">
          {logs.map((log, i) => (
            <div key={i} className="animate-fade-in">{log}</div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="mb-4 flex justify-between items-center">
          <span className="font-medium text-slate-700">Progress</span>
          <span className="font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isComplete && status === 'success' && (
        <div className="animate-scale-in bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-800">Build Successful!</h3>
            <p className="text-green-700 max-w-md mx-auto mt-2">
              Your app has been compiled and signed. Download the files below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => handleDownload('aab')}
              className="flex flex-col items-center justify-center gap-2 bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download .AAB</span>
              </div>
              <span className="text-[10px] opacity-80 font-normal">For Google Play Store</span>
            </button>

            <button
              onClick={() => handleDownload('apk')}
              className="flex flex-col items-center justify-center gap-2 bg-white text-indigo-700 border border-indigo-200 p-4 rounded-xl font-bold hover:bg-indigo-50 shadow-md transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>Download .APK</span>
              </div>
              <span className="text-[10px] opacity-70 font-normal">For Direct Testing</span>
            </button>
          </div>

          <div className="pt-4 border-t border-green-200/50">
            <button
              onClick={onReset}
              className="px-6 py-2 rounded-lg font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 transition-colors"
            >
              Start New Project
            </button>
          </div>
        </div>
      )}

      {isComplete && status === 'failed' && (
        <div className="animate-scale-in bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-800">Build Failed</h3>
            <p className="text-red-700 max-w-md mx-auto mt-2">
              Something went wrong during the build process. Check the logs above for details.
            </p>
          </div>

          <div className="pt-4 border-t border-red-200/50">
            <button
              onClick={onReset}
              className="px-6 py-2 rounded-lg font-medium text-red-600 hover:text-red-800 hover:bg-red-100/50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepBuild;