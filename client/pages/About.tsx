import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap, Cpu, Database } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      <ParticleBackground />
      <div className="relative z-10">
        <header className="border-b border-neon-blue-500/30 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link to="/">
              <Button variant="outline" className="border-neon-blue-500/50 text-neon-blue-400 hover:bg-neon-blue-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hub
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-400 to-neon-purple-400 mb-4">
              ABOUT NEXUS HUB
            </h1>
            <p className="text-xl text-slate-300 font-mono">
              Advanced Learning Platform for Future Technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="glass border-neon-blue-500/30">
              <CardHeader>
                <CardTitle className="text-neon-blue-400 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quantum Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Experience education through quantum-enhanced learning protocols that adapt to your neural patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-neon-purple-500/30">
              <CardHeader>
                <CardTitle className="text-neon-purple-400 flex items-center">
                  <Cpu className="w-5 h-5 mr-2" />
                  Neural Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Direct knowledge transfer through advanced neural interfaces and cognitive enhancement systems.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-cyber-green-500/30">
              <CardHeader>
                <CardTitle className="text-cyber-green-400 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Synthesis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Real-time knowledge synthesis from multiple dimensional sources and quantum databases.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="glass border-neon-blue-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-neon-blue-400">Mission Protocol</CardTitle>
              <CardDescription className="text-slate-400">
                Advancing Human-AI Collaboration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-300">
              <p>
                The Nexus Workshop Hub serves as a bridge between current human knowledge and future technological capabilities. 
                Our advanced learning protocols are designed to prepare agents for the challenges of tomorrow's technological landscape.
              </p>
              <p>
                Through immersive workshop experiences, participants gain access to cutting-edge technologies including quantum computing, 
                neural networks, space exploration systems, and advanced cybersecurity protocols.
              </p>
              <p className="text-neon-blue-400 font-mono">
                "The future belongs to those who can interface with both quantum and classical systems seamlessly."
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
