import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar, Clock, MapPin, Users, Trophy, Zap, Globe,
  Star, ArrowRight, ExternalLink, CheckCircle, Heart,
  Target, Lightbulb, Code, Rocket, Brain
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: 'GENESIS' | 'Unleash' | 'TECHSABHA';
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  maxCapacity: number;
  price: number;
  highlights: string[];
  speakers: Array<{
    name: string;
    role: string;
    company: string;
    image: string;
  }>;
  prizes: string[];
  requirements: string[];
  agenda: Array<{
    time: string;
    activity: string;
    speaker?: string;
  }>;
  thumbnail: string;
  tags: string[];
}

const desocEvents: Event[] = [
  {
    id: 'genesis-2025',
    name: 'GENESIS',
    title: 'Genesis 2025: The Beginning of Innovation',
    description: 'Annual flagship event featuring cutting-edge technology presentations, startup showcases, and networking opportunities.',
    longDescription: 'GENESIS is DESOC\'s premier annual event that brings together the brightest minds in technology, innovation, and entrepreneurship. Experience groundbreaking presentations, participate in hands-on workshops, and connect with industry leaders who are shaping the future.',
    date: '2025-03-15',
    time: '09:00 AM',
    duration: '3 days',
    location: 'DESOC Innovation Campus, San Francisco',
    type: 'GENESIS',
    status: 'upcoming',
    registrations: 450,
    maxCapacity: 500,
    price: 299,
    highlights: [
      'Keynote from Tech Industry Leaders',
      'Startup Pitch Competition',
      'Innovation Showcase',
      'Networking Opportunities',
      'Hands-on Tech Workshops'
    ],
    speakers: [
      {
        name: 'Dr. Elena Rodriguez',
        role: 'Chief Technology Officer',
        company: 'Future Tech Inc.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b2e23e84?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Marcus Chen',
        role: 'AI Research Director',
        company: 'Quantum Labs',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Sarah Kim',
        role: 'Venture Partner',
        company: 'Innovation Capital',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ],
    prizes: ['$50,000 Grand Prize', '$25,000 Runner-up', '$10,000 Innovation Award'],
    requirements: ['Student ID or Professional Badge', 'Laptop for Workshops', 'Innovation Mindset'],
    agenda: [
      { time: '09:00 AM', activity: 'Registration & Welcome Coffee' },
      { time: '10:00 AM', activity: 'Opening Keynote: Future of Technology', speaker: 'Dr. Elena Rodriguez' },
      { time: '11:30 AM', activity: 'Panel Discussion: AI & Ethics' },
      { time: '01:00 PM', activity: 'Lunch & Networking' },
      { time: '02:30 PM', activity: 'Startup Pitch Competition' },
      { time: '04:00 PM', activity: 'Innovation Workshops' },
      { time: '06:00 PM', activity: 'Closing Ceremony & Awards' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop',
    tags: ['Innovation', 'Technology', 'Startups', 'Networking', 'Competition']
  },
  {
    id: 'unleash-2025',
    name: 'Unleash',
    title: 'Unleash 2025: Unlock Your Potential',
    description: 'A dynamic event focused on personal development, skill building, and unleashing creative potential through interactive sessions.',
    longDescription: 'Unleash is designed to help participants break barriers and unlock their full potential. Through intensive workshops, mentorship sessions, and collaborative projects, attendees will discover new skills and gain confidence to tackle any challenge.',
    date: '2025-02-20',
    time: '10:00 AM',
    duration: '2 days',
    location: 'DESOC Learning Center, Austin',
    type: 'Unleash',
    status: 'upcoming',
    registrations: 280,
    maxCapacity: 300,
    price: 199,
    highlights: [
      'Personal Development Workshops',
      'Skill-building Sessions',
      'Mentorship Opportunities',
      'Creative Challenges',
      'Collaborative Projects'
    ],
    speakers: [
      {
        name: 'Alex Thompson',
        role: 'Leadership Coach',
        company: 'Growth Dynamics',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Maya Patel',
        role: 'Innovation Strategist',
        company: 'Creative Solutions',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face'
      }
    ],
    prizes: ['Mentorship Program', 'Skill Certification', 'Project Funding'],
    requirements: ['Open Mind', 'Willingness to Learn', 'Collaborative Spirit'],
    agenda: [
      { time: '10:00 AM', activity: 'Welcome & Icebreakers' },
      { time: '11:00 AM', activity: 'Keynote: Unlocking Your Potential', speaker: 'Alex Thompson' },
      { time: '12:30 PM', activity: 'Skill Assessment Workshop' },
      { time: '02:00 PM', activity: 'Lunch & Peer Networking' },
      { time: '03:30 PM', activity: 'Creative Challenge Sessions' },
      { time: '05:00 PM', activity: 'Project Showcase & Feedback' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=300&fit=crop',
    tags: ['Personal Development', 'Skills', 'Creativity', 'Mentorship', 'Growth']
  },
  {
    id: 'techsabha-2025',
    name: 'TECHSABHA',
    title: 'TechSabha 2025: Technical Excellence Assembly',
    description: 'Technical symposium bringing together developers, engineers, and tech enthusiasts for deep-dive sessions and collaborative learning.',
    longDescription: 'TechSabha is DESOC\'s premier technical gathering where code meets creativity. Dive deep into the latest technologies, participate in coding challenges, attend technical workshops, and collaborate with fellow developers on cutting-edge projects.',
    date: '2025-04-10',
    time: '08:30 AM',
    duration: '2 days',
    location: 'DESOC Tech Hub, Seattle',
    type: 'TECHSABHA',
    status: 'upcoming',
    registrations: 380,
    maxCapacity: 400,
    price: 249,
    highlights: [
      'Deep-dive Technical Sessions',
      'Live Coding Challenges',
      'Open Source Contributions',
      'Tech Stack Workshops',
      'Developer Community Building'
    ],
    speakers: [
      {
        name: 'David Kumar',
        role: 'Senior Software Architect',
        company: 'CloudTech Systems',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Lisa Zhang',
        role: 'DevOps Engineer',
        company: 'Scale Solutions',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Ryan Foster',
        role: 'Full Stack Developer',
        company: 'Innovation Labs',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
      }
    ],
    prizes: ['Best Technical Project', 'Innovation in Code', 'Community Contribution Award'],
    requirements: ['Programming Experience', 'Laptop with Dev Environment', 'GitHub Account'],
    agenda: [
      { time: '08:30 AM', activity: 'Coffee & Code Setup' },
      { time: '09:30 AM', activity: 'Opening: State of Modern Development', speaker: 'David Kumar' },
      { time: '11:00 AM', activity: 'Workshop: Cloud-Native Applications' },
      { time: '12:30 PM', activity: 'Lunch & Tech Talks' },
      { time: '02:00 PM', activity: 'Coding Challenge: Real-time Problem Solving' },
      { time: '04:00 PM', activity: 'Open Source Contribution Session' },
      { time: '05:30 PM', activity: 'Demo Day & Recognition' }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=300&fit=crop',
    tags: ['Programming', 'Development', 'Open Source', 'Technical', 'Coding']
  }
];

const eventIcons = {
  GENESIS: Rocket,
  Unleash: Zap,
  TECHSABHA: Code
};

const eventColors = {
  GENESIS: 'from-brand to-accent',
  Unleash: 'from-warning to-warning-600',
  TECHSABHA: 'from-success to-brand'
};

export default function DesocEvents() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-brand';
      case 'ongoing': return 'bg-success';
      case 'completed': return 'bg-neutral-500';
      default: return 'bg-neutral-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => setSelectedEvent(null)}
            className="mb-6"
          >
            ← Back to Events
          </Button>

          {/* Event Header */}
          <div className="relative mb-8">
            <div className="h-64 rounded-3xl overflow-hidden">
              <img 
                src={selectedEvent.thumbnail} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center mb-4">
                <Badge className={`bg-gradient-to-r ${eventColors[selectedEvent.type]} text-white mr-4`}>
                  {selectedEvent.name}
                </Badge>
                <Badge className={`${getStatusColor(selectedEvent.status)} text-white capitalize`}>
                  {selectedEvent.status}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-2">{selectedEvent.title}</h1>
              <p className="text-xl opacity-90">{selectedEvent.description}</p>
            </div>
          </div>

          {/* Event Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{selectedEvent.longDescription}</p>
                      
                      <h4 className="font-semibold mb-3">Event Highlights</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedEvent.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle>Prizes & Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedEvent.prizes.map((prize, index) => (
                          <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                            <p className="font-semibold text-gray-900">{prize}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                          <p className="text-sm text-gray-600">{selectedEvent.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-3" />
                        <span>{selectedEvent.duration}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-500 mr-3" />
                        <span>{selectedEvent.registrations}/{selectedEvent.maxCapacity} registered</span>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-2xl font-bold text-teal-600">${selectedEvent.price}</p>
                        <p className="text-sm text-gray-600">Registration fee</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedEvent.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agenda" className="space-y-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                  <CardDescription>Detailed timeline of activities and sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedEvent.agenda.map((item, index) => (
                      <div key={index} className="flex items-start p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200">
                        <div className="w-20 text-sm font-medium text-teal-600 mr-4">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.activity}</p>
                          {item.speaker && (
                            <p className="text-sm text-gray-600 mt-1">Speaker: {item.speaker}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="speakers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedEvent.speakers.map((speaker, index) => (
                  <Card key={index} className="professional-card text-center">
                    <CardContent className="p-6">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={speaker.image} alt={speaker.name} />
                        <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold mb-1">{speaker.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{speaker.role}</p>
                      <p className="text-sm text-teal-600">{speaker.company}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <Card className="professional-card max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Register for {selectedEvent.name}</CardTitle>
                  <CardDescription>Secure your spot at this amazing event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-teal-600 mb-2">${selectedEvent.price}</p>
                    <p className="text-gray-600">per participant</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-xl">
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedEvent.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-teal-600 mr-2" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 py-3 text-lg">
                    Register Now
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    * Registration includes all sessions, materials, and refreshments
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/15 to-pink-600/15 rounded-full mb-6 border border-purple-500/20 shadow-lg backdrop-blur-sm">
          <Globe className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">DESOC Club Events</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Exclusive DESOC
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Events</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our signature events that bring together innovators, developers, and visionaries from around the world.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {desocEvents.map((event) => {
          const IconComponent = eventIcons[event.type];
          return (
            <Card key={event.id} className="professional-card group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <div className="relative">
                <img 
                  src={event.thumbnail} 
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg"></div>
                <div className="absolute top-4 left-4">
                  <Badge className={`bg-gradient-to-r ${eventColors[event.type]} text-white`}>
                    {event.name}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(event.status)} text-white capitalize`}>
                    {event.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{event.registrations}/{event.maxCapacity}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      ${event.price}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedEvent(event)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
