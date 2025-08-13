import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, CheckCircle, XCircle, Clock, Code, Terminal, 
  FileText, Award, Target, TrendingUp, Lightbulb
} from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  problemStatement: string;
  constraints: string[];
  examples: TestCase[];
  testCases: TestCase[];
  timeLimit: number; // in minutes
  points: number;
  tags: string[];
  hints?: string[];
  solution?: string;
  starterCode: {
    [language: string]: string;
  };
}

interface CodingChallengeProps {
  challenge: Challenge;
  onSubmit: (code: string, language: string) => Promise<{
    passed: boolean;
    testResults: { passed: boolean; input: string; expected: string; actual: string }[];
    executionTime: number;
    score: number;
  }>;
  onComplete?: (score: number) => void;
}

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'cpp', name: 'C++', extension: 'cpp' }
];

export function CodingChallenge({ challenge, onSubmit, onComplete }: CodingChallengeProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(challenge.timeLimit * 60); // in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  useEffect(() => {
    // Initialize code with starter code for selected language
    if (challenge.starterCode[selectedLanguage]) {
      setCode(challenge.starterCode[selectedLanguage]);
    }
  }, [selectedLanguage, challenge.starterCode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmit();
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    
    try {
      // Simulate running code on examples
      const exampleResults = challenge.examples.map((example, index) => ({
        passed: true, // Mock result
        input: example.input,
        expected: example.expectedOutput,
        actual: example.expectedOutput, // Mock output
        testCase: index + 1
      }));
      
      setTimeout(() => {
        setTestResults({
          type: 'run',
          results: exampleResults,
          executionTime: Math.random() * 100 + 50
        });
        setIsRunning(false);
      }, 1500);
    } catch (error) {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isTimerActive) {
      startTimer();
    }
    
    setIsRunning(true);
    setActiveTab('output');
    
    try {
      const result = await onSubmit(code, selectedLanguage);
      setTestResults({
        type: 'submit',
        ...result
      });
      
      if (result.passed && onComplete) {
        onComplete(result.score);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">{challenge.title}</h1>
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline">
              {challenge.points} points
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {isTimerActive && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span className={`font-mono ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Problem & Output */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-white border-b">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="problem" className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Problem Statement</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {challenge.problemStatement}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                  <ul className="space-y-1">
                    {challenge.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {constraint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {challenge.hints && challenge.hints.length > 0 && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHints ? 'Hide Hints' : 'Show Hints'}
                    </Button>
                    
                    {showHints && (
                      <div className="mt-4 space-y-2">
                        {challenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Hint {index + 1}:</strong> {hint}
                            </p>
                          </div>
                        ))}
                        {currentHint < challenge.hints.length - 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentHint(currentHint + 1)}
                          >
                            Show Next Hint
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {challenge.examples.map((example, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Example {index + 1}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Input:</h5>
                        <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                          {example.input}
                        </pre>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Output:</h5>
                        <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                          {example.expectedOutput}
                        </pre>
                      </div>
                      
                      {example.explanation && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-600 mb-2">Explanation:</h5>
                          <p className="text-sm text-gray-700">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 p-6 overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Running your code...</p>
                  </div>
                </div>
              ) : testResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {testResults.type === 'submit' ? 'Submission Results' : 'Run Results'}
                    </h3>
                    {testResults.executionTime && (
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {testResults.executionTime.toFixed(0)}ms
                      </Badge>
                    )}
                  </div>
                  
                  {testResults.type === 'submit' && (
                    <div className={`p-4 rounded-lg ${
                      testResults.passed 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {testResults.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                          testResults.passed ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {testResults.passed ? 'All test cases passed!' : 'Some test cases failed'}
                        </span>
                      </div>
                      {testResults.score && (
                        <p className="mt-2 text-sm">
                          Score: {testResults.score}/{challenge.points} points
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {(testResults.results || testResults.testResults || []).map((result: any, index: number) => (
                      <div key={index} className={`border rounded-lg p-4 ${
                        result.passed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="font-medium">
                            Test Case {result.testCase || index + 1}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Input:</span>
                            <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                              {result.input}
                            </pre>
                          </div>
                          
                          <div>
                            <span className="font-medium text-gray-600">Expected:</span>
                            <pre className="bg-white p-2 rounded mt-1 overflow-x-auto">
                              {result.expected}
                            </pre>
                          </div>
                          
                          <div>
                            <span className="font-medium text-gray-600">Your Output:</span>
                            <pre className={`p-2 rounded mt-1 overflow-x-auto ${
                              result.passed ? 'bg-white' : 'bg-red-100 border border-red-200'
                            }`}>
                              {result.actual}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Run your code to see output</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {LANGUAGES.find(l => l.id === selectedLanguage)?.name}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Press Ctrl+Enter to run
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm border-none resize-none focus:outline-none"
              placeholder={`// Write your ${LANGUAGES.find(l => l.id === selectedLanguage)?.name} code here...`}
              style={{ 
                fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                lineHeight: '1.5'
              }}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  e.preventDefault();
                  handleRunCode();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock challenge data
export const mockChallenge: Challenge = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  constraints: [
    '2 ≤ nums.length ≤ 10⁴',
    '-10⁹ ≤ nums[i] ≤ 10⁹',
    '-10⁹ ≤ target ≤ 10⁹',
    'Only one valid answer exists.'
  ],
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      expectedOutput: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      expectedOutput: '[1,2]'
    }
  ],
  testCases: [
    { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
    { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
    { input: '[3,3]\n6', expectedOutput: '[0,1]' }
  ],
  timeLimit: 60,
  points: 100,
  tags: ['Array', 'Hash Table'],
  hints: [
    'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
    'Think about how you can reduce the time complexity by using a hash table.',
    'While iterating through the array, check if the complement (target - current number) exists in the hash table.'
  ],
  starterCode: {
    javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
    python: `def two_sum(nums, target):
    # Write your code here
    pass`,
    java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`
  }
};
