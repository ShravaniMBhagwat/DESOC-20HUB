import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Orbit, Wifi, Zap } from 'lucide-react';

interface SciFiHeaderProps {
  isAuthenticated: boolean;
  currentUser: string | null;
  onConnect: () => void;
  onLogout: () => void;
}

export function SciFiHeader({ isAuthenticated, currentUser, onConnect, onLogout }: SciFiHeaderProps) {
  return (
    <header className="border-b border-neon-blue-500/30 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Orbit className="w-8 h-8 text-neon-blue-400 animate-spin" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-400 to-neon-purple-400">
                NEXUS WORKSHOP HUB
              </h1>
            </div>
            <Badge variant="outline" className="border-cyber-green-500 text-cyber-green-400 bg-cyber-green-500/10">
              <Wifi className="w-3 h-3 mr-1" />
              NETWORK ACTIVE
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Badge variant="secondary" className="bg-neon-blue-500/20 text-neon-blue-400 border-neon-blue-500/50">
                  Agent {currentUser?.slice(-4)}
                </Badge>
                <Button 
                  onClick={onLogout}
                  variant="outline" 
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  DISCONNECT
                </Button>
              </>
            ) : (
              <Button 
                onClick={onConnect}
                className="bg-neon-blue-500 hover:bg-neon-blue-600 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                CONNECT
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
