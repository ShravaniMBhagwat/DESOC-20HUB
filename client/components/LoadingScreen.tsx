import { Cpu } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <Cpu className="w-16 h-16 text-neon-blue-400 animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 bg-neon-blue-400 rounded-full opacity-20 animate-ping mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neon-blue-400 animate-pulse">SYSTEM INITIALIZING</h2>
          <p className="text-slate-300 font-mono">Establishing secure connection...</p>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-neon-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-neon-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-neon-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
