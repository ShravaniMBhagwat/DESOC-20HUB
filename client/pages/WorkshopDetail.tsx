import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, Calendar, Clock, Users, Star, DollarSign, Award, 
  Play, BookOpen, CheckCircle, Heart, Share2, MessageSquare,
  ChevronDown, ChevronUp, ThumbsUp, Code, Trophy, FileText
} from 'lucide-react';
import { workshopsData, Workshop, Review } from '@/data/workshops';

export default function WorkshopDetail() {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Load workshop data
    const foundWorkshop = workshopsData.find(w => w.id === id);
    if (foundWorkshop) {
      setWorkshop(foundWorkshop);
    }

    // Check authentication
    const savedUser = localStorage.getItem('workshopUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData.id);
      setIsAuthenticated(true);
      
      // Check if registered
      const registrations = localStorage.getItem(`registrations_${userData.id}`);
      if (registrations) {
        const userRegistrations = JSON.parse(registrations);
        setIsRegistered(userRegistrations.some((r: any) => r.workshopId === id));
      }
    }
  }, [id]);

  const handleRegister = () => {
    if (!isAuthenticated) {
      // Redirect to auth
      return;
    }
    
    if (workshop && currentUser) {
      const newRegistration = {
        workshopId: workshop.id,
        workshopName: workshop.name,
        registeredAt: new Date()
      };
      
      const existing = localStorage.getItem(`registrations_${currentUser}`);
      const registrations = existing ? JSON.parse(existing) : [];
      registrations.push(newRegistration);
      
      localStorage.setItem(`registrations_${currentUser}`, JSON.stringify(registrations));
      setIsRegistered(true);
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim() || !isAuthenticated || !workshop) return;
    
    const review: Review = {
      id: `review_${Date.now()}`,
      userId: currentUser!,
      userName: `User ${currentUser?.slice(-4)}`,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date(),
      helpful: 0
    };
    
    // In a real app, this would be saved to a database
    setNewReview({ rating: 5, comment: '' });
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRate && onRate(index + 1)}
      />
    ));
  };

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Workshop not found</h2>
            <p className="text-gray-600 mb-4">The workshop you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableSlots = workshop.capacity - workshop.registeredUsers.length;
  const isFull = availableSlots <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workshops
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workshop Header */}
            <Card className="professional-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <img 
                    src={workshop.imageUrl} 
                    alt={workshop.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-brand text-white">{workshop.category}</Badge>
                      <Badge variant="outline">{workshop.level}</Badge>
                      {workshop.featured && (
                        <Badge className="bg-warning text-warning-foreground">Featured</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{workshop.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{workshop.shortDescription}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(workshop.rating)}
                        <span className="font-semibold ml-2">{workshop.rating}</span>
                        <span className="text-gray-500">({workshop.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          Wishlist
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={workshop.instructorImage} />
                        <AvatarFallback>
                          {workshop.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{workshop.instructor}</p>
                        <p className="text-sm text-gray-600">Workshop Instructor</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workshop Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 text-brand mx-auto mb-1" />
                    <p className="text-sm font-medium">{workshop.date}</p>
                    <p className="text-xs text-gray-600">Date</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-brand mx-auto mb-1" />
                    <p className="text-sm font-medium">{workshop.duration}</p>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 text-brand mx-auto mb-1" />
                    <p className="text-sm font-medium">{availableSlots} / {workshop.capacity}</p>
                    <p className="text-xs text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-6 h-6 text-brand mx-auto mb-1" />
                    <p className="text-sm font-medium">{workshop.certificate ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-gray-600">Certificate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>About This Workshop</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{workshop.fullDescription}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">What You'll Learn</h4>
                      <ul className="space-y-2">
                        {workshop.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Prerequisites</h4>
                      <ul className="space-y-2">
                        {workshop.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Materials Included</h4>
                      <ul className="space-y-2">
                        {workshop.materials.map((material, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{material}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {workshop.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>Workshop Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workshop.challenges?.map((challenge, index) => (
                        <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Challenge {index + 1}: {challenge.title}</h4>
                            <Badge 
                              variant={challenge.difficulty === 'Easy' ? 'default' : 
                                      challenge.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                            >
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{challenge.problemStatement}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              {challenge.language}
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {challenge.difficulty}
                            </span>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-600">Detailed curriculum will be shared upon registration.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                <Card className="professional-card">
                  <CardHeader>
                    <CardTitle>Meet Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 mb-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={workshop.instructorImage} />
                        <AvatarFallback className="text-lg">
                          {workshop.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{workshop.instructor}</h3>
                        <p className="text-gray-600 mb-4">{workshop.instructorBio}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-brand mb-2">{workshop.rating}</div>
                          <div className="flex items-center justify-center mb-2">
                            {renderStars(workshop.rating)}
                          </div>
                          <p className="text-gray-600">{workshop.reviewCount} reviews</p>
                        </div>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm w-8">{stars}★</span>
                              <Progress value={stars === 5 ? 70 : stars === 4 ? 20 : 5} className="flex-1" />
                              <span className="text-sm w-8">{stars === 5 ? '70%' : stars === 4 ? '20%' : '5%'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Add Review */}
                  {isAuthenticated && isRegistered && (
                    <Card className="professional-card">
                      <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Rating</label>
                            <div className="flex items-center gap-1">
                              {renderStars(newReview.rating, true, (rating) => 
                                setNewReview(prev => ({ ...prev, rating }))
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Review</label>
                            <Textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="Share your experience with this workshop..."
                              rows={4}
                            />
                          </div>
                          <Button onClick={handleSubmitReview} className="bg-brand hover:bg-brand/90">
                            Submit Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <Card className="professional-card">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {workshop.reviews.slice(0, showAllReviews ? undefined : 3).map((review) => (
                          <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                  {review.userName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{review.userName}</span>
                                  <div className="flex items-center">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {review.date.toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-3">{review.comment}</p>
                                <div className="flex items-center gap-4">
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {workshop.reviews.length > 3 && (
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="w-full"
                          >
                            {showAllReviews ? (
                              <>Show Less <ChevronUp className="w-4 h-4 ml-2" /></>
                            ) : (
                              <>Show All {workshop.reviews.length} Reviews <ChevronDown className="w-4 h-4 ml-2" /></>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Registration Card */}
              <Card className="professional-card">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-brand mb-2">${workshop.price}</div>
                    <p className="text-gray-600">One-time payment</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">
                        {workshop.isLive && workshop.isRecorded ? 'Live + Recorded' : 
                         workshop.isLive ? 'Live Only' : 'Recorded Only'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{workshop.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Certificate:</span>
                      <span className="font-medium">{workshop.certificate ? 'Included' : 'Not included'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">English</span>
                    </div>
                  </div>

                  {isRegistered ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-success-50 border border-success-200 rounded-lg text-center">
                        <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                        <p className="text-success-700 font-medium">You're registered!</p>
                      </div>
                      <Button variant="outline" className="w-full">
                        View in Dashboard
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleRegister}
                        disabled={isFull || !isAuthenticated}
                        className="w-full bg-brand hover:bg-brand/90"
                      >
                        {isFull ? 'Workshop Full' : 'Register Now'}
                      </Button>
                      {!isAuthenticated && (
                        <p className="text-xs text-gray-600 text-center">
                          Please sign in to register
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{workshop.registeredUsers.length} students registered</span>
                      <span>{availableSlots} spots left</span>
                    </div>
                    <Progress value={(workshop.registeredUsers.length / workshop.capacity) * 100} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Workshop Features */}
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Play, text: 'Live interactive sessions' },
                    { icon: BookOpen, text: 'Course materials & resources' },
                    { icon: Code, text: 'Hands-on coding exercises' },
                    { icon: Award, text: 'Certificate of completion' },
                    { icon: MessageSquare, text: 'Q&A with instructor' },
                    { icon: Users, text: 'Peer networking opportunities' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-brand" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
