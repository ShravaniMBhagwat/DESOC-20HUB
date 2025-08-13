export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: string;
  problemStatement: string;
  testCases: any[];
  solution?: string;
}

export interface Workshop {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  registeredUsers: string[];
  imageUrl?: string;
  instructor: string;
  instructorBio: string;
  instructorImage?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  prerequisites: string[];
  learningOutcomes: string[];
  materials: string[];
  challenges?: Challenge[];
  isLive: boolean;
  isRecorded: boolean;
  certificate: boolean;
  featured: boolean;
}

export const workshopsData: Workshop[] = [
  {
    id: 'quantum-computing',
    name: 'Quantum Computing Fundamentals',
    shortDescription: 'Master the principles of quantum computing and quantum algorithms',
    fullDescription: 'Dive deep into the quantum realm and understand the fundamental principles that make quantum computing revolutionary. This comprehensive workshop covers qubits, quantum gates, superposition, entanglement, and practical quantum algorithms including Shor\'s algorithm and Grover\'s search.',
    date: '2025-01-20',
    time: '14:00 - 16:00',
    duration: '2 hours',
    capacity: 25,
    registeredUsers: [],
    instructor: 'Dr. Sarah Chen',
    instructorBio: 'Quantum Computing Researcher at MIT with 10+ years experience in quantum algorithms and quantum machine learning.',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b2e23e84?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    tags: ['Quantum', 'Physics', 'Computing', 'Algorithms'],
    category: 'Computing',
    price: 0,
    rating: 4.8,
    reviewCount: 127,
    reviews: [
      {
        id: '1',
        userId: 'user1',
        userName: 'Alex Johnson',
        rating: 5,
        comment: 'Excellent introduction to quantum computing. Dr. Chen explains complex concepts clearly.',
        date: new Date('2024-12-15'),
        helpful: 23
      }
    ],
    prerequisites: ['Linear Algebra', 'Basic Programming', 'Complex Numbers'],
    learningOutcomes: [
      'Understand quantum bits and quantum gates',
      'Implement basic quantum algorithms',
      'Analyze quantum circuit complexity',
      'Apply quantum principles to solve problems'
    ],
    materials: ['Quantum Computing Textbook', 'Qiskit SDK', 'Jupyter Notebooks'],
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
    challenges: [
      {
        id: 'qc1',
        title: 'Quantum Teleportation',
        difficulty: 'Medium',
        language: 'Python',
        problemStatement: 'Implement quantum teleportation protocol using Qiskit',
        testCases: []
      }
    ],
    isLive: true,
    isRecorded: true,
    certificate: true,
    featured: true
  },
  {
    id: 'neural-networks',
    name: 'Deep Learning & Neural Networks',
    shortDescription: 'Build and train neural networks from scratch',
    fullDescription: 'Comprehensive deep dive into neural network architectures, from basic perceptrons to advanced deep learning models. Learn to implement, train, and optimize neural networks for real-world applications.',
    date: '2025-01-25',
    time: '10:00 - 12:00',
    duration: '2 hours',
    capacity: 30,
    registeredUsers: [],
    instructor: 'Prof. Alex Rodriguez',
    instructorBio: 'AI Research Director with expertise in deep learning and neural architecture search.',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
    category: 'Artificial Intelligence',
    price: 0,
    rating: 4.9,
    reviewCount: 89,
    reviews: [],
    prerequisites: ['Python Programming', 'Calculus', 'Linear Algebra', 'Statistics'],
    learningOutcomes: [
      'Design neural network architectures',
      'Implement backpropagation algorithm',
      'Train deep learning models',
      'Apply transfer learning techniques'
    ],
    materials: ['TensorFlow Documentation', 'Neural Networks Course Materials', 'GPU Access'],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    isLive: true,
    isRecorded: true,
    certificate: true,
    featured: true
  },
  {
    id: 'space-robotics',
    name: 'Space Robotics Engineering',
    shortDescription: 'Design robots for space exploration missions',
    fullDescription: 'Learn to design and program autonomous robots for space exploration. Cover navigation in zero gravity, sensor fusion, and mission planning for Mars rovers and space station robots.',
    date: '2025-01-30',
    time: '13:00 - 15:00',
    duration: '2 hours',
    capacity: 20,
    registeredUsers: [],
    instructor: 'Commander Lisa Park',
    instructorBio: 'Former NASA engineer with 15 years experience in space robotics and autonomous systems.',
    instructorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    level: 'Intermediate',
    tags: ['Robotics', 'Space', 'Engineering', 'Autonomous Systems'],
    category: 'Robotics',
    price: 149,
    rating: 4.7,
    reviewCount: 64,
    reviews: [],
    prerequisites: ['Basic Programming', 'Physics', 'Control Systems'],
    learningOutcomes: [
      'Design space-grade robotic systems',
      'Implement autonomous navigation',
      'Handle sensor data in space environment',
      'Plan robotic missions'
    ],
    materials: ['ROS Simulator', 'Space Environment Models', 'Robotic Hardware Kit'],
    imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop',
    isLive: true,
    isRecorded: false,
    certificate: true,
    featured: false
  },
  {
    id: 'blockchain-protocols',
    name: 'Advanced Blockchain Development',
    shortDescription: 'Master blockchain protocols and smart contracts',
    fullDescription: 'Deep dive into blockchain technology, consensus algorithms, and smart contract development. Build decentralized applications and understand cryptocurrency mechanics.',
    date: '2025-02-05',
    time: '16:00 - 18:00',
    duration: '2 hours',
    capacity: 35,
    registeredUsers: [],
    instructor: 'Dr. Marcus Webb',
    instructorBio: 'Blockchain architect with experience building enterprise blockchain solutions.',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    tags: ['Blockchain', 'Cryptography', 'Web3', 'Solidity'],
    category: 'Blockchain',
    price: 179,
    rating: 4.6,
    reviewCount: 156,
    reviews: [],
    prerequisites: ['Programming Experience', 'Cryptography Basics', 'Web Development'],
    learningOutcomes: [
      'Implement blockchain consensus algorithms',
      'Develop smart contracts',
      'Build DeFi applications',
      'Understand tokenomics'
    ],
    materials: ['Ethereum Testnet Access', 'Solidity IDE', 'Web3 Libraries'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    isLive: true,
    isRecorded: true,
    certificate: true,
    featured: false
  },
  {
    id: 'cybersecurity-hacking',
    name: 'Ethical Hacking & Penetration Testing',
    shortDescription: 'Learn ethical hacking and security assessment',
    fullDescription: 'Comprehensive course on ethical hacking methodologies, penetration testing, and vulnerability assessment. Learn to think like an attacker to better defend systems.',
    date: '2025-02-10',
    time: '09:00 - 11:00',
    duration: '2 hours',
    capacity: 15,
    registeredUsers: [],
    instructor: 'Agent Maya Singh',
    instructorBio: 'Cybersecurity expert with CISSP and CEH certifications, 12 years in information security.',
    instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    level: 'Advanced',
    tags: ['Security', 'Hacking', 'Networks', 'Penetration Testing'],
    category: 'Cybersecurity',
    price: 199,
    rating: 4.9,
    reviewCount: 203,
    reviews: [],
    prerequisites: ['Network Fundamentals', 'Linux/Unix', 'Programming'],
    learningOutcomes: [
      'Conduct penetration testing',
      'Identify security vulnerabilities',
      'Use ethical hacking tools',
      'Write security reports'
    ],
    materials: ['Kali Linux VM', 'Penetration Testing Tools', 'Virtual Lab Environment'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    isLive: true,
    isRecorded: false,
    certificate: true,
    featured: true
  },
  {
    id: 'data-science-analytics',
    name: 'Data Science & Analytics Mastery',
    shortDescription: 'Master data analysis and machine learning',
    fullDescription: 'Comprehensive data science workshop covering statistical analysis, machine learning algorithms, and data visualization techniques using Python and R.',
    date: '2025-02-15',
    time: '11:00 - 13:00',
    duration: '2 hours',
    capacity: 40,
    registeredUsers: [],
    instructor: 'Dr. Elena Vasquez',
    instructorBio: 'Senior Data Scientist with expertise in machine learning and statistical modeling.',
    instructorImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    tags: ['Data Science', 'Python', 'Machine Learning', 'Statistics'],
    category: 'Data Science',
    price: 89,
    rating: 4.5,
    reviewCount: 312,
    reviews: [],
    prerequisites: ['Basic Programming', 'Statistics Fundamentals'],
    learningOutcomes: [
      'Perform exploratory data analysis',
      'Build predictive models',
      'Create data visualizations',
      'Apply statistical methods'
    ],
    materials: ['Python/R Environment', 'Datasets', 'Jupyter Notebooks'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    isLive: true,
    isRecorded: true,
    certificate: true,
    featured: false
  }
];

export const categories = [
  'All Categories',
  'Computing',
  'Artificial Intelligence',
  'Robotics',
  'Blockchain',
  'Cybersecurity',
  'Data Science'
];

export const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
export const sortOptions = ['Featured', 'Newest', 'Highest Rated', 'Price: Low to High', 'Price: High to Low'];
