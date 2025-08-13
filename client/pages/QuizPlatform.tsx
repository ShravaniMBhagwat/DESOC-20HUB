import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import {
  Clock, Trophy, CheckCircle, XCircle, Brain, Target, 
  Play, Pause, RotateCcw, Award, BookOpen, Timer,
  TrendingUp, Calendar, Users, Star
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  bestScore: number;
  thumbnail: string;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'upcoming' | 'active' | 'completed';
  scheduledDate: string;
  instructor: string;
}

const sampleQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'React Fundamentals',
    description: 'Test your knowledge of React basics including components, props, and state management.',
    timeLimit: 30,
    category: 'Frontend Development',
    difficulty: 'Easy',
    attempts: 12,
    bestScore: 85,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    questions: [
      {
        id: 'q1',
        question: 'What is the virtual DOM in React?',
        options: [
          'A copy of the real DOM kept in memory',
          'A new browser API',
          'A React component',
          'A CSS framework'
        ],
        correct: 0,
        explanation: 'The virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM.',
        difficulty: 'Easy',
        topic: 'React Basics'
      },
      {
        id: 'q2',
        question: 'Which hook is used for side effects in React?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correct: 1,
        explanation: 'useEffect is the hook used for performing side effects in functional components.',
        difficulty: 'Medium',
        topic: 'React Hooks'
      }
    ]
  },
  {
    id: 'quiz2',
    title: 'JavaScript ES6+',
    description: 'Advanced JavaScript concepts including async/await, destructuring, and arrow functions.',
    timeLimit: 45,
    category: 'Programming',
    difficulty: 'Medium',
    attempts: 8,
    bestScore: 92,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=200&fit=crop',
    questions: []
  },
  {
    id: 'quiz3',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive test on arrays, linked lists, trees, and sorting algorithms.',
    timeLimit: 60,
    category: 'Computer Science',
    difficulty: 'Hard',
    attempts: 3,
    bestScore: 78,
    thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop',
    questions: []
  }
];

const sampleExams: Exam[] = [
  {
    id: 'exam1',
    title: 'Full Stack Developer Certification',
    description: 'Comprehensive exam covering frontend, backend, and database technologies.',
    duration: 120,
    totalQuestions: 80,
    passingScore: 75,
    category: 'Certification',
    difficulty: 'Hard',
    status: 'upcoming',
    scheduledDate: '2025-02-15T10:00:00Z',
    instructor: 'Dr. Sarah Chen'
  },
  {
    id: 'exam2',
    title: 'Python Programming Assessment',
    description: 'Test your Python skills with practical coding challenges and theory questions.',
    duration: 90,
    totalQuestions: 50,
    passingScore: 70,
    category: 'Programming',
    difficulty: 'Medium',
    status: 'active',
    scheduledDate: '2025-01-28T14:00:00Z',
    instructor: 'Prof. Alex Kumar'
  },
  {
    id: 'exam3',
    title: 'Machine Learning Fundamentals',
    description: 'Evaluate your understanding of ML algorithms, data preprocessing, and model evaluation.',
    duration: 100,
    totalQuestions: 60,
    passingScore: 80,
    category: 'AI/ML',
    difficulty: 'Hard',
    status: 'completed',
    scheduledDate: '2025-01-15T09:00:00Z',
    instructor: 'Dr. Maya Patel'
  }
];

export default function QuizPlatform() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState('user_12345');

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setQuizCompleted(true);
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeRemaining, quizCompleted]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeRemaining(quiz.timeLimit * 60);
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(0);
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizCompleted) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (selectedQuiz && currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      calculateScore();
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return;
    
    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correct++;
      }
    });
    
    const percentage = Math.round((correct / selectedQuiz.questions.length) * 100);
    setScore(percentage);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(0);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-brand-50/30 to-accent-50/20">
      <Navigation
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowAuth={() => {}}
        onShowNotifications={() => {}}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand/15 to-accent/10 rounded-full mb-6 border border-brand/20 shadow-lg backdrop-blur-sm">
            <Brain className="w-5 h-5 text-brand mr-2" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">Knowledge Assessment Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Quiz & Exam
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent"> Platform</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Test your knowledge, track your progress, and earn certifications with our comprehensive assessment platform.
          </p>
        </div>

        {!selectedQuiz ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="quizzes">Practice Quizzes</TabsTrigger>
              <TabsTrigger value="exams">Certification Exams</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="professional-card hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img 
                        src={quiz.thumbnail} 
                        alt={quiz.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white`}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-teal-600 transition-colors">
                        {quiz.title}
                      </CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{quiz.timeLimit} mins</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{quiz.attempts} attempts</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Best Score</p>
                            <p className="text-lg font-bold text-teal-600">{quiz.bestScore}%</p>
                          </div>
                          <Button 
                            onClick={() => startQuiz(quiz)}
                            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="exams" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sampleExams.map((exam) => (
                  <Card key={exam.id} className="professional-card hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{exam.title}</CardTitle>
                        <Badge className={`${getStatusColor(exam.status)} text-white capitalize`}>
                          {exam.status}
                        </Badge>
                      </div>
                      <CardDescription>{exam.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{exam.duration} minutes</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{exam.totalQuestions} questions</span>
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{exam.passingScore}% to pass</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="w-8 h-8 mr-2">
                              <AvatarFallback>{exam.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{exam.instructor}</span>
                          </div>
                          
                          <Button 
                            variant={exam.status === 'active' ? 'default' : 'outline'}
                            disabled={exam.status === 'completed'}
                            className={exam.status === 'active' ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700' : ''}
                          >
                            {exam.status === 'upcoming' && 'Register'}
                            {exam.status === 'active' && 'Take Exam'}
                            {exam.status === 'completed' && 'View Results'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          // Quiz Interface
          <div className="max-w-4xl mx-auto">
            {!quizCompleted ? (
              <Card className="professional-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedQuiz.title}</CardTitle>
                      <CardDescription>
                        Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-teal-600">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeRemaining)}
                      </div>
                      <Progress 
                        value={(currentQuestionIndex / selectedQuiz.questions.length) * 100} 
                        className="w-32 mt-2"
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {selectedQuiz.questions.length > 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">
                          {selectedQuiz.questions[currentQuestionIndex]?.question}
                        </h3>
                        
                        <div className="space-y-3">
                          {selectedQuiz.questions[currentQuestionIndex]?.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => selectAnswer(index)}
                              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                userAnswers[currentQuestionIndex] === index
                                  ? 'border-teal-500 bg-teal-50 text-teal-900'
                                  : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={resetQuiz}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Exit Quiz
                        </Button>
                        
                        <Button 
                          onClick={nextQuestion}
                          disabled={userAnswers[currentQuestionIndex] === -1}
                          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                        >
                          {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Quiz Results
              <Card className="professional-card text-center">
                <CardContent className="p-12">
                  <div className="mb-6">
                    {score >= 80 ? (
                      <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    ) : score >= 60 ? (
                      <Award className="w-20 h-20 text-blue-500 mx-auto mb-4" />
                    ) : (
                      <Target className="w-20 h-20 text-gray-500 mx-auto mb-4" />
                    )}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                  <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-4">
                    {score}%
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {userAnswers.filter((answer, index) => answer === selectedQuiz.questions[index]?.correct).length}
                      </p>
                      <p className="text-sm text-gray-600">Correct</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {userAnswers.filter((answer, index) => answer !== -1 && answer !== selectedQuiz.questions[index]?.correct).length}
                      </p>
                      <p className="text-sm text-gray-600">Incorrect</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">
                        {userAnswers.filter(answer => answer === -1).length}
                      </p>
                      <p className="text-sm text-gray-600">Skipped</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => startQuiz(selectedQuiz)} className="bg-gradient-to-r from-teal-600 to-blue-600">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                    <Button variant="outline" onClick={resetQuiz}>
                      Back to Quizzes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
