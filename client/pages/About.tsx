import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Award, Users, Target, TrendingUp, BookOpen, Star } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DESOC Hub
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full mb-6">
            <Star className="w-4 h-4 text-brand mr-2" />
            <span className="text-sm font-medium text-gray-700">About Our Mission</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            About 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600"> DESOC </span>
            Workshop Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlocking the Universe of Knowledge through transformative learning experiences that shape the future of technology professionals worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="professional-card border-brand/20 hover:border-brand/40 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-brand flex items-center text-xl">
                <Award className="w-6 h-6 mr-3" />
                Excellence in Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We deliver world-class educational experiences through carefully curated workshops led by industry experts and thought leaders.
              </p>
            </CardContent>
          </Card>

          <Card className="professional-card border-purple-200 hover:border-purple-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center text-xl">
                <Users className="w-6 h-6 mr-3" />
                Global Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Join a vibrant community of learners, innovators, and professionals from around the world, all united by a passion for growth.
              </p>
            </CardContent>
          </Card>

          <Card className="professional-card border-green-200 hover:border-green-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center text-xl">
                <Target className="w-6 h-6 mr-3" />
                Future-Ready Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Master the technologies and methodologies that will define tomorrow's digital landscape and career opportunities.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                DESOC Workshop Hub was born from a vision to democratize access to cutting-edge technology education. 
                Founded by industry veterans who recognized the growing gap between traditional education and the 
                rapidly evolving demands of the tech industry.
              </p>
              <p>
                Our platform brings together the brightest minds in technology to share their knowledge through 
                immersive, hands-on workshops that go beyond theoretical learning to provide practical, 
                immediately applicable skills.
              </p>
              <p>
                Today, we're proud to serve a global community of over 10,000 professionals, from beginners 
                taking their first steps in tech to seasoned experts staying ahead of emerging trends.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-brand/10 to-purple-600/10 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To unlock human potential by providing access to transformative learning experiences that 
                prepare professionals for the challenges and opportunities of tomorrow's technology landscape.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-brand mb-2">10K+</div>
                <div className="text-sm text-gray-600">Active Learners</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Expert Instructors</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600">Hours Learned</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="professional-card bg-gradient-to-r from-brand/5 to-purple-600/5 border-brand/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Why Choose DESOC Workshop Hub?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert-Led Content</h4>
                <p className="text-sm text-gray-600">Learn from industry leaders and recognized experts in their fields.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Practical Focus</h4>
                <p className="text-sm text-gray-600">Hands-on workshops with real-world applications and projects.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Global Community</h4>
                <p className="text-sm text-gray-600">Connect with peers and build lasting professional relationships.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Career Growth</h4>
                <p className="text-sm text-gray-600">Advance your career with industry-recognized certifications.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already transformed their careers through DESOC Workshop Hub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-brand to-blue-600 hover:from-brand/90 hover:to-blue-600/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Explore Workshops
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300">
              Contact Us
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
