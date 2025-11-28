import React from 'react';
import { AppConfig } from '../types';
import { Signal, Wifi, Battery } from 'lucide-react';

interface Props {
  config: AppConfig;
}

const PreviewPhone: React.FC<Props> = ({ config }) => {
  return (
    <div className="sticky top-8">
      <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
        <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
        <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
        <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
        <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
        
        {/* Screen Content */}
        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
          
          {/* Status Bar */}
          <div 
            className="h-8 w-full flex justify-between items-center px-6 pt-2 z-20 text-xs text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            <span className="font-medium">9:41</span>
            <div className="flex gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* Simulate App Loading / Splash or Content */}
          <div className="flex-1 relative bg-slate-50 flex flex-col">
             {/* Simple Browser Chrome (Hidden in TWA, but shown here to imply web content) */}
            <div className="bg-white border-b p-2 flex items-center justify-center shadow-sm z-10">
               <span className="text-xs text-slate-500 truncate max-w-[200px]">
                 {config.url || 'https://yoursite.com'}
               </span>
            </div>

            {/* Mock Web Content */}
            <div className="flex-1 p-4 space-y-4 overflow-hidden">
                <div className="w-full h-32 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                    <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="w-1/2 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
            </div>
            
            {/* Splash Overlay (Simulated) */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none opacity-0 hover:opacity-100 bg-white">
                <div className="w-24 h-24 rounded-2xl mb-4 overflow-hidden shadow-xl">
                    {config.iconUrl ? (
                        <img src={config.iconUrl} alt="App Icon" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-200" />
                    )}
                </div>
                 <h2 className="text-xl font-bold text-slate-800">{config.appName || 'App Name'}</h2>
                 <p className="text-slate-400 text-sm mt-2">Loading...</p>
            </div>
            
            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                 <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                    Hover to see Splash Screen
                 </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPhone;