import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';

interface Workshop {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  capacity: number;
  registeredUsers: string[];
  imageUrl?: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

interface WorkshopCardProps {
  workshop: Workshop;
  isRegistered: boolean;
  onRegister: (workshopId: string) => void;
  onUnregister: (workshopId: string) => void;
}

export function WorkshopCard({ workshop, isRegistered, onRegister, onUnregister }: WorkshopCardProps) {
  const availableSlots = workshop.capacity - workshop.registeredUsers.length;
  const isFull = availableSlots <= 0;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-cyber-green-500 text-cyber-green-100';
      case 'Intermediate': return 'bg-neon-blue-500 text-neon-blue-100';
      case 'Advanced': return 'bg-neon-purple-500 text-neon-purple-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <Card className="glass border-neon-blue-500/30 hover:border-neon-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue-500/20 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={workshop.imageUrl} 
          alt={workshop.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className={`absolute top-3 left-3 ${getLevelColor(workshop.level)}`}>
          {workshop.level}
        </Badge>
        {isRegistered && (
          <Badge className="absolute top-3 right-3 bg-cyber-green-500 text-cyber-green-100">
            ACTIVE
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-neon-blue-400 group-hover:text-neon-blue-300 transition-colors">
          {workshop.name}
        </CardTitle>
        <CardDescription className="text-slate-400">
          Instructor: {workshop.instructor}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm">{workshop.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {workshop.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{workshop.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{workshop.time}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">
              {availableSlots} / {workshop.capacity} slots
            </span>
          </div>
          <Badge 
            variant={isFull ? "destructive" : "secondary"}
            className={isFull ? "bg-red-500/20 text-red-400" : "bg-cyber-green-500/20 text-cyber-green-400"}
          >
            {isFull ? "FULL" : "AVAILABLE"}
          </Badge>
        </div>
        
        <Button 
          onClick={() => isRegistered ? onUnregister(workshop.id) : onRegister(workshop.id)}
          disabled={!isRegistered && isFull}
          className={`w-full ${
            isRegistered 
              ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" 
              : isFull
              ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
              : "bg-neon-blue-500 hover:bg-neon-blue-600 text-white"
          }`}
          variant={isRegistered ? "outline" : "default"}
        >
          {isRegistered ? "ABORT PROTOCOL" : isFull ? "CAPACITY REACHED" : "INITIATE PROTOCOL"}
          {!isRegistered && !isFull && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </CardContent>
    </Card>
  );
}
