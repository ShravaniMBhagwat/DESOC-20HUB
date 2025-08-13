import { Badge } from '@/components/ui/badge';
import { Orbit, Zap, Users, Database } from 'lucide-react';

export function SciFiFooter() {
  return (
    <footer className="mt-16 border-t border-neon-blue-500/30 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* System Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neon-blue-400 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              SYSTEM STATUS
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Network Uptime</span>
                <Badge className="bg-cyber-green-500/20 text-cyber-green-400 border-cyber-green-500/50">
                  99.9%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Protocols</span>
                <Badge className="bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500/50">
                  8 ONLINE
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Security Level</span>
                <Badge className="bg-neon-purple-500/20 text-neon-purple-400 border-neon-purple-500/50">
                  MAXIMUM
                </Badge>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neon-blue-400 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              NETWORK STATS
            </h3>
            <div className="space-y-2 text-slate-400">
              <p>Total Agents: <span className="text-neon-blue-400 font-mono">1,247</span></p>
              <p>Active Sessions: <span className="text-cyber-green-400 font-mono">89</span></p>
              <p>Data Processed: <span className="text-neon-purple-400 font-mono">2.4TB</span></p>
              <p>Quantum Entanglements: <span className="text-yellow-400 font-mono">∞</span></p>
            </div>
          </div>

          {/* Nexus Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neon-blue-400 flex items-center">
              <Orbit className="w-5 h-5 mr-2 animate-spin" />
              NEXUS HUB
            </h3>
            <div className="space-y-2 text-slate-400">
              <p>Powered by quantum computing networks and advanced neural interfaces.</p>
              <p className="text-xs opacity-75">© 2025 Nexus Workshop Hub. All protocols secured.</p>
              <div className="flex items-center space-x-2 pt-2">
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-xs text-yellow-400 font-mono">REAL-TIME SYNC ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-neon-blue-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Orbit className="w-4 h-4 text-neon-blue-400 animate-spin" />
            <span className="text-slate-400 text-sm font-mono">NEXUS-HUB-v2.5.1</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <span>API Status: ONLINE</span>
            <span>•</span>
            <span>Quantum Sync: ACTIVE</span>
            <span>•</span>
            <span>Neural Interface: STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
