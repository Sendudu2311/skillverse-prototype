import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Brain, Target, Briefcase, Book, Award, Star, ArrowRight,
  BookOpen, Globe, DollarSign, ChevronRight, Clock, Lightbulb, Zap, TrendingUp, Code, 
  BarChart3, Users
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MeowlGuide from '../../components/MeowlGuide';
import '../../styles/ChatbotPage.css';

interface RecommendationSection {
  title: string;
  items: string[];
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  resources: string[];
  completed?: boolean;
}

interface LearningRoadmap {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  difficulty: string;
  steps: RoadmapStep[];
  prerequisites?: string[];
  careerOutcomes?: string[];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  recommendations?: RecommendationSection[];
  resources?: Resource[];
  nextSteps?: string[];
  roadmap?: LearningRoadmap;
}

interface CourseRecommendation {
  type: 'course';
  title: string;
  provider: string;
  duration: string;
  rating: number;
  students: number;
  price: string;
  image: string;
}

interface JobRecommendation {
  type: 'job';
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  image: string;
}

interface SkillRecommendation {
  type: 'skill';
  title: string;
  category: string;
  difficulty: string;
  timeToLearn: string;
  demand: string;
  image: string;
}

type Recommendation = CourseRecommendation | JobRecommendation | SkillRecommendation;

interface Resource {
  title: string;
  link: string;
  description: string;
}

interface AIResponse {
  text: string;
  recommendations?: {
    title: string;
    items: string[];
  }[];
  resources?: Resource[];
  nextSteps?: string[];
  roadmap?: LearningRoadmap;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

interface PromptCategory {
  title: string;
  icon: React.ElementType;
  color: string;
  prompts: string[];
}

const ChatbotPage = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Xin chào! Tôi là trợ lý AI của SkillVerse. Tôi có thể giúp bạn:\n• 🎯 Lập kế hoạch nghề nghiệp\n• 📚 Tư vấn khóa học phù hợp\n• 💼 Phân tích thị trường việc làm\n• �️ Tạo lộ trình học tương tác cho từng ngôn ngữ lập trình\n• �🚀 Phát triển kỹ năng\n\nThử hỏi: "Tạo lộ trình học JavaScript" hoặc "Lộ trình học Python"!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      icon: Brain,
      title: 'Lộ Trình Học Cá Nhân Hóa',
      description: 'Nhận đề xuất khóa học được tùy chỉnh dựa trên mục tiêu và kỹ năng hiện tại của bạn',
      color: 'blue'
    },
    {
      icon: Target,
      title: 'Quy Hoạch Nghề Nghiệp',
      description: 'Khám phá cơ hội nghề nghiệp và kỹ năng cần thiết cho công việc mơ ước',
      color: 'green'
    },
    {
      icon: Briefcase,
      title: 'Thông Tin Thị Trường Việc Làm',
      description: 'Cập nhật xu hướng ngành và kỹ năng được yêu cầu cao',
      color: 'purple'
    },
    {
      icon: Book,
      title: 'Đề Xuất Khóa Học',
      description: 'Tìm khóa học tốt nhất để đạt được mục tiêu nghề nghiệp',
      color: 'orange'
    }
  ];

  const promptCategories: PromptCategory[] = [
    {
      title: 'Lộ Trình Học Tập',
      icon: Briefcase,
      color: 'blue',
      prompts: [
        'Tạo lộ trình học JavaScript',
        'Lộ trình học Python từ cơ bản',
        'Roadmap học React.js',
        'Lộ trình trở thành Full-stack Developer',
        'Kế hoạch học AI/Machine Learning'
      ]
    },
    {
      title: 'Phát Triển Kỹ Năng',
      icon: BookOpen,
      color: 'green',
      prompts: [
        'Nên học ngôn ngữ lập trình nào?',
        'Cân bằng kỹ năng cứng và mềm?',
        'Lộ trình học cloud computing?',
        'Học UI/UX design từ đâu?',
        'Kỹ năng thiết yếu cho data scientist?'
      ]
    },
    {
      title: 'Tư Vấn Nghề Nghiệp',
      icon: Target,
      color: 'purple',
      prompts: [
        'Xu hướng nghề nghiệp công nghệ 2024?',
        'Mẹo xây dựng portfolio mạnh',
        'CV developer nên có gì?',
        'Thương lượng lương trong công nghệ?',
        'Ứng tuyển việc làm từ xa hiệu quả?'
      ]
    },
    {
      title: 'Thông Tin Thị Trường',
      icon: Globe,
      color: 'orange',
      prompts: [
        'Cơ hội việc làm phù hợp với tôi',
        'Tương lai của AI và machine learning?',
        'Ngành công nghiệp đang phát triển?',
        'Tác động blockchain đến việc làm?',
        'Vai trò mới trong cybersecurity?'
      ]
    }
  ];

  const quickPrompts = [
    'Xu hướng nghề nghiệp công nghệ 2024?',
    'Tạo lộ trình học JavaScript',
    'Lộ trình học Python từ cơ bản',
    'Tạo roadmap học React.js',
    'Cơ hội việc làm phù hợp với tôi'
  ];

  // Sample roadmap data
  const roadmapTemplates = {
    javascript: {
      id: 'js-roadmap',
      title: 'Lộ Trình Học JavaScript Toàn Diện',
      description: 'Từ cơ bản đến nâng cao, trở thành JavaScript Developer chuyên nghiệp',
      totalDuration: '4-6 tháng',
      difficulty: 'Beginner to Advanced',
      prerequisites: ['Hiểu biết cơ bản về máy tính', 'Kiên nhẫn và đam mê học hỏi'],
      careerOutcomes: ['Frontend Developer', 'Backend Developer', 'Full-stack Developer', 'Mobile Developer'],
      steps: [
        {
          id: 'step1',
          title: 'Nền Tảng Web Development',
          description: 'Học HTML, CSS cơ bản để hiểu cấu trúc và styling web',
          duration: '2-3 tuần',
          difficulty: 'Beginner' as const,
          skills: ['HTML5 semantic', 'CSS3 và Flexbox/Grid', 'Responsive design'],
          resources: ['freeCodeCamp HTML/CSS', 'MDN Web Docs', 'CSS Tricks']
        },
        {
          id: 'step2',
          title: 'JavaScript Cơ Bản',
          description: 'Nắm vững cú pháp và khái niệm cơ bản của JavaScript',
          duration: '3-4 tuần',
          difficulty: 'Beginner' as const,
          skills: ['Variables & Data Types', 'Functions & Scope', 'Arrays & Objects', 'Control Flow'],
          resources: ['JavaScript.info', 'Eloquent JavaScript', 'Codecademy JS']
        },
        {
          id: 'step3',
          title: 'DOM Manipulation & Events',
          description: 'Học cách tương tác với trang web động',
          duration: '2-3 tuần',
          difficulty: 'Intermediate' as const,
          skills: ['DOM Selection', 'Event Handling', 'Dynamic Content', 'Form Validation'],
          resources: ['Vanilla JS Projects', 'DOM Challenges', 'Event Listener Tutorials']
        },
        {
          id: 'step4',
          title: 'ES6+ & Modern JavaScript',
          description: 'Học các tính năng hiện đại của JavaScript',
          duration: '2-3 tuần',
          difficulty: 'Intermediate' as const,
          skills: ['Arrow Functions', 'Destructuring', 'Modules', 'Async/Await', 'Promises'],
          resources: ['ES6 Features Guide', 'Async JS Course', 'Module Patterns']
        },
        {
          id: 'step5',
          title: 'API & AJAX',
          description: 'Kết nối với backend và xử lý dữ liệu',
          duration: '2 tuần',
          difficulty: 'Intermediate' as const,
          skills: ['Fetch API', 'JSON Handling', 'REST APIs', 'Error Handling'],
          resources: ['API Tutorial', 'JSON Server', 'Public APIs List']
        },
        {
          id: 'step6',
          title: 'Framework (React/Vue)',
          description: 'Học framework phổ biến để xây dựng ứng dụng phức tạp',
          duration: '4-6 tuần',
          difficulty: 'Advanced' as const,
          skills: ['Components', 'State Management', 'Routing', 'Hooks/Composition API'],
          resources: ['React Official Docs', 'Vue.js Guide', 'Framework Tutorials']
        },
        {
          id: 'step7',
          title: 'Tools & Deployment',
          description: 'Học công cụ phát triển và triển khai ứng dụng',
          duration: '2-3 tuần',
          difficulty: 'Advanced' as const,
          skills: ['Git/GitHub', 'npm/webpack', 'VS Code', 'Netlify/Vercel'],
          resources: ['Git Tutorial', 'Webpack Guide', 'Deployment Platforms']
        }
      ]
    },
    python: {
      id: 'python-roadmap',
      title: 'Lộ Trình Học Python Toàn Diện',
      description: 'Từ cơ bản đến ứng dụng thực tế, trở thành Python Developer',
      totalDuration: '3-5 tháng',
      difficulty: 'Beginner to Advanced',
      prerequisites: ['Logic tư duy cơ bản', 'Kiên nhẫn và thực hành nhiều'],
      careerOutcomes: ['Backend Developer', 'Data Scientist', 'AI/ML Engineer', 'DevOps Engineer'],
      steps: [
        {
          id: 'step1',
          title: 'Python Cơ Bản',
          description: 'Học cú pháp và cấu trúc cơ bản của Python',
          duration: '2-3 tuần',
          difficulty: 'Beginner' as const,
          skills: ['Variables & Data Types', 'Control Structures', 'Functions', 'Lists & Dictionaries'],
          resources: ['Python.org Tutorial', 'Automate the Boring Stuff', 'Python Crash Course']
        },
        {
          id: 'step2',
          title: 'OOP & Modules',
          description: 'Lập trình hướng đối tượng và sử dụng modules',
          duration: '2-3 tuần',
          difficulty: 'Intermediate' as const,
          skills: ['Classes & Objects', 'Inheritance', 'Modules & Packages', 'Exception Handling'],
          resources: ['OOP Python Guide', 'Real Python OOP', 'Python Module Tutorial']
        },
        {
          id: 'step3',
          title: 'Libraries & Frameworks',
          description: 'Chuyên sâu theo hướng: Web, Data, hoặc AI',
          duration: '4-6 tuần',
          difficulty: 'Intermediate' as const,
          skills: ['Django/Flask (Web)', 'Pandas/NumPy (Data)', 'TensorFlow (AI)'],
          resources: ['Django Tutorial', 'Pandas Documentation', 'TensorFlow Guide']
        },
        {
          id: 'step4',
          title: 'Projects & Portfolio',
          description: 'Xây dựng dự án thực tế và portfolio',
          duration: '3-4 tuần',
          difficulty: 'Advanced' as const,
          skills: ['Project Planning', 'Code Organization', 'Testing', 'Documentation'],
          resources: ['GitHub Projects', 'Portfolio Examples', 'Project Ideas']
        }
      ]
    }
  };

  // Enhanced AI Response Database
  const aiResponses = {
    // Career Planning Responses
    careerTrends: {
      text: `🚀 **Xu hướng nghề nghiệp công nghệ 2024:**

Các lĩnh vực đang bùng nổ:
• **AI/Machine Learning Engineer** - Tăng trưởng 40%/năm, lương TB 150K$/năm
• **Cloud Solutions Architect** - Tăng trưởng 35%, lương TB 140K$/năm  
• **DevOps/Platform Engineer** - Tăng trưởng 30%, lương TB 130K$/năm
• **Cybersecurity Specialist** - Tăng trưởng 25%, lương TB 125K$/năm
• **Data Scientist** - Tăng trưởng 20%, lương TB 135K$/năng

Các vai trò mới nổi:
• **Web3/Blockchain Developer** - Nhu cầu cao trong DeFi và NFT
• **AR/VR Experience Designer** - Thiết yếu cho metaverse
• **Edge Computing Engineer** - Quan trọng cho IoT và 5G
• **AI Ethics Officer** - Cần thiết cho AI có trách nhiệm`,
      recommendations: [
        {
          title: "Lĩnh vực tăng trưởng cao",
          items: [
            "AI/ML Engineers (40% tăng trưởng/năm, $150K lương TB)",
            "Cloud Solutions Architects (35% tăng trưởng, $140K lương TB)",
            "DevOps Engineers (30% tăng trưởng, $130K lương TB)",
            "Cybersecurity Specialists (25% tăng trưởng, $125K lương TB)"
          ]
        }
      ],
      nextSteps: [
        "Làm bài kiểm tra định hướng nghề nghiệp",
        "Khám phá lộ trình học chi tiết cho từng vai trò",
        "Tham gia cộng đồng công nghệ",
        "Đặt lịch tư vấn với chuyên gia nghề nghiệp"
      ]
    },

    programmingLanguages: {
      text: `💻 **Ngôn ngữ lập trình nên học 2024:**

**Top 5 ngôn ngữ cần thiết:**
• **Python** - Đa năng, dễ học, nhu cầu cao (AI/ML, Web, Data)
• **JavaScript/TypeScript** - Thiết yếu cho web development
• **SQL** - Cơ sở dữ liệu, luôn cần thiết
• **Java** - Enterprise, Android, backend mạnh mẽ
• **Go** - Backend hiện đại, hiệu suất cao

**Theo từng lĩnh vực:**
• **Web Frontend:** JavaScript, TypeScript, React, Vue.js
• **Backend:** Python, Java, Go, Node.js
• **Mobile:** Swift (iOS), Kotlin (Android), Flutter/Dart
• **AI/ML:** Python, R, Julia
• **DevOps:** Shell/Bash, Python, Go`,
      recommendations: [
        {
          title: "Ngôn ngữ thiết yếu",
          items: [
            "Python - Đa năng, dễ học, nhu cầu cao",
            "JavaScript - Thiết yếu cho web development",
            "SQL - Cơ sở dữ liệu, luôn cần thiết",
            "TypeScript - JavaScript an toàn kiểu",
            "Go - Backend hiện đại, hiệu suất cao"
          ]
        }
      ],
      nextSteps: [
        "Chọn ngôn ngữ lập trình đầu tiên",
        "Thiết lập môi trường phát triển",
        "Hoàn thành tutorial cơ bản",
        "Xây dựng dự án đầu tiên"
      ]
    },

    learningResources: {
      text: `📚 **Tài liệu học tập được đề xuất:**

**Nền tảng học trực tuyến:**
• **SkillVerse** - Khóa học tiếng Việt chất lượng cao
• **Coursera** - Khóa học từ đại học top thế giới
• **Udemy** - Đa dạng khóa học thực hành
• **freeCodeCamp** - Miễn phí, cộng đồng mạnh
• **Pluralsight** - Tech skills chuyên sâu

**Tài liệu miễn phí:**
• **MDN Web Docs** - Tài liệu web development
• **Python.org** - Tài liệu Python chính thức
• **w3schools** - Tutorial cơ bản, dễ hiểu
• **GitHub** - Mã nguồn mở để học hỏi

**Sách hay:**
• "Clean Code" - Robert Martin
• "You Don't Know JS" - Kyle Simpson
• "Automate the Boring Stuff" - Al Sweigart`,
      resources: [
        {
          title: "Khóa học lập trình cơ bản",
          link: "/courses/programming-basics",
          description: "Học cơ bản lập trình với thực hành"
        },
        {
          title: "Lộ trình Web Development",
          link: "/paths/web-development",
          description: "Lộ trình hoàn chỉnh từ cơ bản đến chuyên nghiệp"
        }
      ],
      nextSteps: [
        "Chọn nền tảng học phù hợp",
        "Đăng ký khóa học cơ bản",
        "Tham gia cộng đồng học tập",
        "Thực hành hàng ngày"
      ]
    },

    learningPlan: {
      text: `📝 **Kế hoạch học tập được cá nhân hóa:**

**Giai đoạn 1: Nền tảng (2-3 tháng)**
• Lập trình cơ bản (biến, vòng lặp, hàm)
• Cấu trúc dữ liệu và thuật toán
• Version control với Git/GitHub
• Command line và terminal
• Khái niệm khoa học máy tính cơ bản

**Giai đoạn 2: Chuyên môn (3-4 tháng)**
• Chọn focus: Frontend hoặc Backend
• Học framework liên quan
• Thành thạo công cụ phát triển
• Thực hành với dự án thực tế
• Xây dựng portfolio

**Giai đoạn 3: Nâng cao (2-3 tháng)**
• Học advanced concepts
• System design và architecture
• Testing và deployment
• Soft skills và teamwork`,
      recommendations: [
        {
          title: "Giai đoạn nền tảng",
          items: [
            "Lập trình cơ bản (biến, vòng lặp, hàm)",
            "Cấu trúc dữ liệu và thuật toán",
            "Version control với Git",
            "Sử dụng command line",
            "Khái niệm khoa học máy tính"
          ]
        }
      ],
      nextSteps: [
        "Hoàn thành đánh giá kỹ năng",
        "Đặt mục tiêu học tập",
        "Tạo lịch học",
        "Tham gia nhóm học tập"
      ]
    },

    jobOpportunities: {
      text: `💼 **Cơ hội việc làm phù hợp:**

**Việc làm Frontend Developer:**
• **React Developer** - 50-80 triệu/tháng
• **Vue.js Developer** - 45-70 triệu/tháng  
• **Angular Developer** - 55-85 triệu/tháng
• **UI/UX Developer** - 40-65 triệu/tháng

**Việc làm Backend Developer:**
• **Node.js Developer** - 60-90 triệu/tháng
• **Python Developer** - 55-85 triệu/tháng
• **Java Developer** - 65-95 triệu/tháng
• **Go Developer** - 70-100 triệu/tháng

**Việc làm Full-stack:**
• **MERN Stack** - 70-110 triệu/tháng
• **Django + React** - 65-100 triệu/tháng

**Xu hướng remote work:**
• 80% công ty cho phép làm việc từ xa
• Cơ hội làm việc cho công ty quốc tế`,
      recommendations: [
        {
          title: "Việc làm hot nhất",
          items: [
            "React Developer - 50-80 triệu/tháng",
            "Node.js Developer - 60-90 triệu/tháng",
            "Python Developer - 55-85 triệu/tháng",
            "Full-stack MERN - 70-110 triệu/tháng"
          ]
        }
      ],
      nextSteps: [
        "Cập nhật CV và portfolio",
        "Luyện tập coding interview",
        "Tìm hiểu về công ty mục tiêu",
        "Chuẩn bị câu hỏi phỏng vấn"
      ]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const response = getBotResponse(inputMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.text,
        timestamp: new Date(),
        recommendations: response.recommendations,
        resources: response.resources,
        nextSteps: response.nextSteps,
        roadmap: response.roadmap
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message: string): AIResponse => {
    const lowerMessage = message.toLowerCase();
    
    // Roadmap requests - check first for specific language roadmaps
    if ((lowerMessage.includes('lộ trình') || lowerMessage.includes('roadmap') || lowerMessage.includes('tạo')) && 
        (lowerMessage.includes('javascript') || lowerMessage.includes('js'))) {
      return {
        text: `🗺️ **Lộ Trình Học JavaScript Toàn Diện**

Tôi đã tạo cho bạn một lộ trình học JavaScript chi tiết từ cơ bản đến nâng cao. Lộ trình này được thiết kế dành cho người mới bắt đầu và sẽ giúp bạn trở thành JavaScript Developer chuyên nghiệp trong 4-6 tháng.

**Tổng quan:**
• ⏱️ Thời gian: 4-6 tháng
• 📚 7 giai đoạn học tập
• 🎯 Mục tiêu: Frontend/Backend Developer
• 💼 Mức lương: 40-80 triệu/tháng

Bạn có thể theo dõi tiến độ học tập và đánh dấu hoàn thành từng bước trong lộ trình bên dưới!`,
        roadmap: roadmapTemplates.javascript,
        nextSteps: [
          "Bắt đầu với Giai đoạn 1: HTML/CSS",
          "Cài đặt VS Code và browser",
          "Tham gia cộng đồng JavaScript Vietnam",
          "Đặt mục tiêu học 1-2 giờ/ngày"
        ]
      };
    }

    if ((lowerMessage.includes('lộ trình') || lowerMessage.includes('roadmap') || lowerMessage.includes('tạo')) && 
        lowerMessage.includes('python')) {
      return {
        text: `🐍 **Lộ Trình Học Python Toàn Diện**

Tôi đã tạo cho bạn một lộ trình học Python chi tiết, phù hợp cho người mới bắt đầu. Python là ngôn ngữ đa năng, dễ học và có nhiều cơ hội nghề nghiệp.

**Tổng quan:**
• ⏱️ Thời gian: 3-5 tháng
• 📚 4 giai đoạn chính
• 🎯 Mục tiêu: Backend/Data/AI Developer
• 💼 Mức lương: 50-90 triệu/tháng

Lộ trình này bao gồm từ cú pháp cơ bản đến ứng dụng thực tế trong Web, Data Science, hoặc AI!`,
        roadmap: roadmapTemplates.python,
        nextSteps: [
          "Cài đặt Python và PyCharm/VS Code",
          "Bắt đầu với Python cơ bản",
          "Chọn hướng chuyên sâu (Web/Data/AI)",
          "Thực hành coding hàng ngày"
        ]
      };
    }

    // General roadmap request
    if (lowerMessage.includes('lộ trình') || lowerMessage.includes('roadmap') || lowerMessage.includes('kế hoạch học')) {
      return {
        text: `🗺️ **Tạo Lộ Trình Học Cá Nhân Hóa**

Tôi có thể tạo lộ trình học chi tiết cho các ngôn ngữ lập trình phổ biến:

**Lộ trình có sẵn:**
• 🟨 **JavaScript** - Frontend/Backend development
• 🐍 **Python** - Backend/Data Science/AI
• ⚛️ **React** - Frontend framework
• 🌐 **Web Development** - Full-stack
• 📊 **Data Science** - Python + ML
• 🤖 **AI/Machine Learning** - Deep learning

**Để tạo lộ trình phù hợp, hãy cho tôi biết:**
• Ngôn ngữ/công nghệ bạn muốn học
• Mục tiêu nghề nghiệp của bạn
• Thời gian có thể dành để học
• Kinh nghiệm hiện tại của bạn

Ví dụ: "Tạo lộ trình học JavaScript" hoặc "Lộ trình học Python cho Data Science"`,
        nextSteps: [
          "Chọn ngôn ngữ lập trình muốn học",
          "Xác định mục tiêu nghề nghiệp",
          "Đánh giá thời gian có thể học",
          "Yêu cầu tạo lộ trình cụ thể"
        ]
      };
    }
    
    // Greeting responses
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('hello')) {
      return {
        text: `Xin chào! 👋 Tôi là trợ lý AI của SkillVerse. 

Tôi có thể giúp bạn:
🎯 **Lập kế hoạch nghề nghiệp** - Tư vấn định hướng và lộ trình phát triển
📚 **Đề xuất khóa học** - Tìm khóa học phù hợp với mục tiêu
💼 **Phân tích thị trường việc làm** - Cơ hội và xu hướng tuyển dụng  
🚀 **Phát triển kỹ năng** - Lộ trình học từ cơ bản đến nâng cao

Bạn quan tâm đến lĩnh vực nào? Hãy chia sẻ mục tiêu của bạn để tôi có thể tư vấn tốt nhất!`
      };
    }

    // Career trends
    if (lowerMessage.includes('xu hướng') || lowerMessage.includes('nghề nghiệp') || lowerMessage.includes('career') || lowerMessage.includes('trends')) {
      return aiResponses.careerTrends;
    }

    // Programming languages
    if (lowerMessage.includes('ngôn ngữ lập trình') || lowerMessage.includes('nên học') || lowerMessage.includes('programming language')) {
      return aiResponses.programmingLanguages;
    }

    // Learning resources
    if (lowerMessage.includes('tài liệu') || lowerMessage.includes('học tập') || lowerMessage.includes('resources') || lowerMessage.includes('đề xuất')) {
      return aiResponses.learningResources;
    }

    // Learning plan
    if (lowerMessage.includes('kế hoạch') || lowerMessage.includes('lộ trình') || lowerMessage.includes('plan') || lowerMessage.includes('roadmap')) {
      return aiResponses.learningPlan;
    }

    // Job opportunities
    if (lowerMessage.includes('việc làm') || lowerMessage.includes('cơ hội') || lowerMessage.includes('job') || lowerMessage.includes('career opportunity')) {
      return aiResponses.jobOpportunities;
    }

    // Specific tech topics
    if (lowerMessage.includes('react')) {
      return {
        text: `⚛️ **React - Thư viện Frontend hàng đầu**

**Tại sao nên học React:**
• Được sử dụng bởi Facebook, Netflix, Airbnb
• Cộng đồng lớn và tài liệu phong phú
• Ecosystem mạnh mẽ với Redux, Next.js
• Cơ hội việc làm cao (50-80 triệu/tháng)

**Lộ trình học React:**
1. **Cơ bản:** HTML, CSS, JavaScript ES6+
2. **React cơ bản:** Components, Props, State
3. **React Hooks:** useState, useEffect, custom hooks
4. **State Management:** Context API, Redux
5. **Routing:** React Router
6. **Testing:** Jest, React Testing Library

**Dự án thực hành:**
• Todo App với hooks
• E-commerce website
• Social media dashboard`,
        nextSteps: [
          "Học JavaScript ES6+ trước",
          "Bắt đầu với Create React App",
          "Thực hành với dự án nhỏ",
          "Tham gia cộng đồng React Vietnam"
        ]
      };
    }

    if (lowerMessage.includes('python')) {
      return {
        text: `🐍 **Python - Ngôn ngữ đa năng số 1**

**Ưu điểm của Python:**
• Cú pháp đơn giản, dễ học
• Ứng dụng đa dạng: Web, AI/ML, Data Science
• Thư viện phong phú
• Cộng đồng lớn và hỗ trợ tốt
• Lương cao (55-85 triệu/tháng)

**Lĩnh vực ứng dụng:**
• **Web Development:** Django, Flask, FastAPI
• **Data Science:** Pandas, NumPy, Matplotlib
• **AI/Machine Learning:** TensorFlow, PyTorch, scikit-learn
• **Automation:** Selenium, requests, BeautifulSoup
• **Desktop Apps:** tkinter, PyQt

**Lộ trình học Python:**
1. Cú pháp cơ bản và OOP
2. Chọn chuyên ngành (Web/Data/AI)
3. Học framework tương ứng
4. Xây dựng dự án thực tế`,
        nextSteps: [
          "Cài đặt Python và IDE",
          "Học cú pháp cơ bản",
          "Chọn lĩnh vực chuyên sâu",
          "Xây dựng dự án đầu tiên"
        ]
      };
    }

    if (lowerMessage.includes('frontend') || lowerMessage.includes('front-end')) {
      return {
        text: `🎨 **Frontend Development - Xây dựng giao diện người dùng**

**Kỹ năng cần thiết:**
• **Cơ bản:** HTML5, CSS3, JavaScript ES6+
• **CSS Framework:** Bootstrap, Tailwind CSS
• **JavaScript Framework:** React, Vue.js, Angular
• **Tools:** Git, Webpack, npm/yarn
• **Design:** UI/UX principles, Figma

**Lộ trình học Frontend:**
1. **Nền tảng (2-3 tháng):** HTML, CSS, JavaScript
2. **Framework (2-3 tháng):** React hoặc Vue.js
3. **Tools & Workflow (1 tháng):** Git, build tools
4. **Advanced (2-3 tháng):** State management, testing

**Mức lương Frontend Developer:**
• Junior: 25-40 triệu/tháng
• Mid-level: 40-65 triệu/tháng  
• Senior: 65-100 triệu/tháng

**Dự án portfolio:**
• Landing page responsive
• Todo app với framework
• E-commerce frontend
• Dashboard admin`,
        recommendations: [
          {
            title: "Kỹ năng Frontend thiết yếu",
            items: [
              "HTML5, CSS3, JavaScript ES6+",
              "React hoặc Vue.js",
              "Responsive design",
              "Version control (Git)",
              "UI/UX cơ bản"
            ]
          }
        ],
        nextSteps: [
          "Học HTML, CSS cơ bản",
          "Thành thạo JavaScript",
          "Chọn React hoặc Vue.js",
          "Xây dựng portfolio"
        ]
      };
    }

    if (lowerMessage.includes('backend') || lowerMessage.includes('back-end')) {
      return {
        text: `⚙️ **Backend Development - Xây dựng logic và cơ sở dữ liệu**

**Kỹ năng cần thiết:**
• **Ngôn ngữ:** Python, Node.js, Java, Go, PHP
• **Framework:** Express.js, Django, Spring Boot
• **Database:** MySQL, PostgreSQL, MongoDB
• **API:** REST, GraphQL
• **DevOps:** Docker, AWS/GCP, CI/CD

**Lộ trình học Backend:**
1. **Chọn ngôn ngữ:** Python/Node.js (dễ bắt đầu)
2. **Framework:** Django/Flask hoặc Express.js
3. **Database:** SQL cơ bản, ORM
4. **API Development:** REST API, authentication
5. **Deployment:** Cloud services, containerization

**Mức lương Backend Developer:**
• Junior: 30-50 triệu/tháng
• Mid-level: 50-80 triệu/tháng
• Senior: 80-120 triệu/tháng

**Dự án thực hành:**
• REST API cho blog
• Authentication system
• E-commerce backend
• Real-time chat app`,
        recommendations: [
          {
            title: "Backend roadmap",
            items: [
              "Python/Django hoặc Node.js/Express",
              "SQL và database design",
              "API development",
              "Cloud deployment",
              "Security và performance"
            ]
          }
        ],
        nextSteps: [
          "Chọn ngôn ngữ backend",
          "Học SQL và database",
          "Xây dựng API đầu tiên",
          "Deploy lên cloud"
        ]
      };
    }

    // AI/ML topics
    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning') || lowerMessage.includes('ml') || lowerMessage.includes('trí tuệ nhân tạo')) {
      return {
        text: `🤖 **AI/Machine Learning - Lĩnh vực hot nhất**

**Tại sao học AI/ML:**
• Tăng trưởng việc làm 40%/năm
• Lương cao: 80-150 triệu/tháng
• Ứng dụng rộng rãi trong mọi ngành
• Tương lai của công nghệ

**Kỹ năng cần thiết:**
• **Toán học:** Statistics, Linear Algebra, Calculus
• **Programming:** Python (chính), R
• **Libraries:** NumPy, Pandas, scikit-learn, TensorFlow, PyTorch
• **Data:** Data cleaning, visualization, feature engineering
• **ML Algorithms:** Supervised, Unsupervised, Deep Learning

**Lộ trình học AI/ML:**
1. **Nền tảng (3-4 tháng):** Python, Statistics, Math
2. **Machine Learning (3-4 tháng):** Algorithms, scikit-learn
3. **Deep Learning (2-3 tháng):** Neural Networks, TensorFlow
4. **Specialization:** Computer Vision, NLP, hoặc Reinforcement Learning

**Cơ hội nghề nghiệp:**
• Machine Learning Engineer
• Data Scientist  
• AI Research Scientist
• Computer Vision Engineer
• NLP Engineer`,
        recommendations: [
          {
            title: "Lộ trình AI/ML",
            items: [
              "Python và toán học cơ bản",
              "Machine Learning với scikit-learn",
              "Deep Learning với TensorFlow/PyTorch",
              "Chuyên sâu: CV, NLP, hoặc RL",
              "Dự án thực tế và portfolio"
            ]
          }
        ],
        nextSteps: [
          "Học Python và statistics",
          "Khóa học ML cơ bản",
          "Thực hành với datasets",
          "Xây dựng dự án ML"
        ]
      };
    }

    // Default response with helpful suggestions
    return {
      text: `🤔 Tôi hiểu bạn đang tìm kiếm thông tin về "${message}". 

Để tôi có thể hỗ trợ bạn tốt hơn, bạn có thể hỏi tôi về:

🎯 **Nghề nghiệp & Định hướng:**
• "Xu hướng nghề nghiệp công nghệ 2024?"
• "Làm sao để chuyển sang lập trình?"
• "Lộ trình trở thành Full-stack Developer?"

💻 **Kỹ thuật & Lập trình:**
• "Nên học ngôn ngữ lập trình nào?"
• "React hay Vue.js tốt hơn?"
• "Lộ trình học AI/Machine Learning?"

📚 **Học tập & Phát triển:**
• "Tài liệu học lập trình miễn phí?"
• "Cách xây dựng portfolio mạnh?"
• "Kỹ năng mềm quan trọng cho developer?"

💼 **Việc làm & Thị trường:**
• "Mức lương developer tại Việt Nam?"
• "Cách chuẩn bị phỏng vấn lập trình?"
• "Làm việc remote hiệu quả?"

Hãy hỏi cụ thể hơn để tôi có thể đưa ra lời khuyên chính xác nhất!`,
      nextSteps: [
        "Hỏi về lĩnh vực cụ thể bạn quan tâm",
        "Chia sẻ mục tiêu nghề nghiệp của bạn",
        "Cho biết kinh nghiệm hiện tại",
        "Sử dụng gợi ý phía trên"
      ]
    };
  };

  const handleSuggestionClick = (example: string) => {
    setInputMessage(example);
  };

  const recommendations: Recommendation[] = [
    {
      type: 'course',
      title: 'React.js Nâng Cao',
      provider: 'SkillVerse',
      duration: '8 giờ',
      rating: 4.8,
      students: 1234,
      price: 'Miễn phí',
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      type: 'job',
      title: 'Frontend Developer',
      company: 'Công ty Công nghệ',
      location: 'Làm việc từ xa',
      salary: '50-70 triệu/tháng',
      posted: '2 ngày trước',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      type: 'skill',
      title: 'TypeScript',
      category: 'Lập trình',
      difficulty: 'Trung cấp',
      timeToLearn: '4-6 tuần',
      demand: 'Cao',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Type guard functions
  const isCourseRecommendation = (rec: Recommendation): rec is CourseRecommendation => rec.type === 'course';
  const isJobRecommendation = (rec: Recommendation): rec is JobRecommendation => rec.type === 'job';
  const isSkillRecommendation = (rec: Recommendation): rec is SkillRecommendation => rec.type === 'skill';
  return (
    <div className={`sv-chatbot-container ${theme}`} data-theme={theme}>
      <div className="sv-chatbot-content">
        {/* Header */}
        <div className="sv-chatbot-header">
          <h1 className="sv-chatbot-header__title">Trợ Lý AI SkillVerse</h1>
          <p className="sv-chatbot-header__description">
            Tư vấn nghề nghiệp và lộ trình học tập được cá nhân hóa bằng AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="sv-features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`sv-feature-card sv-feature-card--${feature.color}`}>
              <feature.icon className="sv-feature-card__icon" />
              <h3 className="sv-feature-card__title">{feature.title}</h3>
              <p className="sv-feature-card__description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="sv-quick-prompts">
          <div className="sv-quick-prompts__title">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Bắt Đầu Nhanh</span>
          </div>
          <div className="sv-quick-prompts__grid">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="sv-quick-prompt-btn"
                onClick={() => handleSuggestionClick(prompt)}
              >
                {index === 0 && <TrendingUp className="h-4 w-4" />}
                {index === 1 && <Book className="h-4 w-4" />}
                {index === 2 && <Code className="h-4 w-4" />}
                {index === 3 && <Clock className="h-4 w-4" />}
                {index === 4 && <Briefcase className="h-4 w-4" />}
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="sv-chat-messages">
          {messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`sv-chat-message ${
                msg.type === 'bot' ? 'sv-chat-message--bot' : 'sv-chat-message--user'
              }`}
            >
              <div className="sv-chat-message__avatar">
                {msg.type === 'bot' ? (
                  <Bot className="text-blue-500" />
                ) : (
                  <User className="text-purple-500" />
                )}
              </div>
              <div className="sv-chat-message__content">
                <div className="sv-chat-message__text">
                  {msg.content.split('\n').map((line: string, i: number) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                
                {/* Enhanced Message Features */}
                {msg.recommendations && (
                  <div className="sv-chat-message__text">
                    <h4>📋 Đề xuất:</h4>
                    {msg.recommendations.map((rec: RecommendationSection, i: number) => (
                      <div key={i} className="sv-message-rec-section">
                        <h5>{rec.title}:</h5>
                        <ul>
                          {rec.items.map((item: string, j: number) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {msg.resources && (
                  <div className="sv-chat-message__text">
                    <h4>📚 Tài liệu tham khảo:</h4>
                    {msg.resources.map((resource: Resource, i: number) => (
                      <div key={i} className="sv-message-resource">
                        <a href={resource.link} className="sv-resource-link">
                          {resource.title}
                        </a>
                        <p>{resource.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {msg.nextSteps && (
                  <div className="sv-chat-message__text">
                    <h4>🚀 Bước tiếp theo:</h4>
                    <ul>
                      {msg.nextSteps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Roadmap Component */}
                {msg.roadmap && (
                  <div className="sv-roadmap-container">
                    <div className="sv-roadmap-header">
                      <h3>🗺️ {msg.roadmap.title}</h3>
                      <p>{msg.roadmap.description}</p>
                      <div className="sv-roadmap-meta">
                        <span className="sv-roadmap-duration">⏱️ {msg.roadmap.totalDuration}</span>
                        <span className="sv-roadmap-difficulty">📊 {msg.roadmap.difficulty}</span>
                      </div>
                    </div>

                    {msg.roadmap.prerequisites && (
                      <div className="sv-roadmap-section">
                        <h4>📋 Điều kiện tiên quyết:</h4>
                        <ul>
                          {msg.roadmap.prerequisites.map((prereq, i) => (
                            <li key={i}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="sv-roadmap-steps">
                      <h4>📚 Các bước thực hiện:</h4>
                      {msg.roadmap.steps.map((step, index) => (
                        <div key={step.id} className={`sv-roadmap-step ${step.completed ? 'completed' : ''}`}>
                          <div className="sv-step-number">{index + 1}</div>
                          <div className="sv-step-content">
                            <div className="sv-step-header">
                              <h5>{step.title}</h5>
                              <div className="sv-step-meta">
                                <span className="sv-step-duration">{step.duration}</span>
                                <span className={`sv-step-difficulty sv-step-difficulty--${step.difficulty.toLowerCase()}`}>
                                  {step.difficulty}
                                </span>
                              </div>
                            </div>
                            <p className="sv-step-description">{step.description}</p>
                            
                            <div className="sv-step-skills">
                              <h6>🎯 Kỹ năng học được:</h6>
                              <div className="sv-skills-tags">
                                {step.skills.map((skill, i) => (
                                  <span key={i} className="sv-skill-tag">{skill}</span>
                                ))}
                              </div>
                            </div>

                            <div className="sv-step-resources">
                              <h6>📖 Tài liệu:</h6>
                              <div className="sv-resources-list">
                                {step.resources.map((resource, i) => (
                                  <span key={i} className="sv-resource-item">{resource}</span>
                                ))}
                              </div>
                            </div>

                            <button 
                              className={`sv-step-toggle ${step.completed ? 'completed' : ''}`}
                              onClick={() => {
                                // Handle step completion toggle
                                console.log(`Toggle step ${step.id} completion`);
                              }}
                            >
                              {step.completed ? '✅ Đã hoàn thành' : '⭕ Đánh dấu hoàn thành'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {msg.roadmap.careerOutcomes && (
                      <div className="sv-roadmap-section">
                        <h4>🚀 Cơ hội nghề nghiệp:</h4>
                        <div className="sv-career-outcomes">
                          {msg.roadmap.careerOutcomes.map((career, i) => (
                            <span key={i} className="sv-career-tag">{career}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="sv-roadmap-actions">
                      <button className="sv-btn sv-btn--primary">
                        📥 Lưu lộ trình
                      </button>
                      <button className="sv-btn sv-btn--outline">
                        📤 Chia sẻ
                      </button>
                      <button className="sv-btn sv-btn--outline">
                        📊 Xem tiến độ
                      </button>
                    </div>
                  </div>
                )}

                <span className="sv-chat-message__time">
                  {msg.timestamp.toLocaleTimeString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="sv-chat-message sv-chat-message--bot sv-chat-message--loading">
              <div className="sv-chat-message__avatar">
                <Bot className="text-blue-500" />
              </div>
              <div className="sv-chat-message__content">
                <div className="sv-chat-message__text">
                  <div className="sv-typing-dots">
                    <div className="sv-typing-dot"></div>
                    <div className="sv-typing-dot"></div>
                    <div className="sv-typing-dot"></div>
                  </div>
                  <div className="sv-typing-text">
                    <Sparkles className="h-4 w-4 mr-2 inline-block animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="sv-chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Hỏi tôi về nghề nghiệp, khóa học, kỹ năng hoặc bất cứ điều gì..."
            className="sv-chat-input__field"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="sv-chat-input__button"
            disabled={isTyping || !inputMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        {/* Prompt Categories */}
        <div className="sv-prompt-categories">
          {promptCategories.map((category, index) => (
            <div key={index} className={`sv-prompt-category sv-prompt-category--${category.color}`}>
              <div className="sv-prompt-category__header">
                <category.icon className="sv-prompt-category__icon" />
                <h3 className="sv-prompt-category__title">{category.title}</h3>
              </div>
              <div className="sv-prompt-category__prompts">
                {category.prompts.map((prompt, promptIndex) => (
                  <button
                    key={promptIndex}
                    className="sv-prompt-btn"
                    onClick={() => handleSuggestionClick(prompt)}
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Recommendations Section */}
        <div className="sv-ai-recommendations">
          <div className="sv-ai-recommendations__header">
            <div className="sv-ai-recommendations__title-section">
              <h2 className="sv-ai-recommendations__title">
                Đề Xuất Cá Nhân Hóa
              </h2>
              <p className="sv-ai-recommendations__description">
                Dựa trên hồ sơ và sở thích của bạn
              </p>
            </div>
          </div>

          <div className="sv-ai-recommendations__grid">
            {recommendations.map((item, index) => {
              return (
                <div key={index} className="sv-ai-recommendation-card">
                  <div className="sv-ai-recommendation-card__image-container">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="sv-ai-recommendation-card__image"
                    />
                    <div className="sv-ai-recommendation-card__badge">
                      {isCourseRecommendation(item) && <Book className="h-4 w-4" />}
                      {isJobRecommendation(item) && <Briefcase className="h-4 w-4" />}
                      {isSkillRecommendation(item) && <Award className="h-4 w-4" />}
                      <span>
                        {item.type === 'course' && 'Khóa học'}
                        {item.type === 'job' && 'Việc làm'}
                        {item.type === 'skill' && 'Kỹ năng'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="sv-ai-recommendation-card__content">
                    <h3 className="sv-ai-recommendation-card__title">{item.title}</h3>
                    
                    {isCourseRecommendation(item) && (
                      <>
                        <p className="sv-ai-recommendation-card__provider">
                          <Globe className="h-4 w-4" />
                          {item.provider}
                        </p>
                        <div className="sv-ai-recommendation-card__meta">
                          <div className="sv-meta-item">
                            <Clock className="h-4 w-4" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="sv-meta-item">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="sv-meta-item">
                            <Users className="h-4 w-4" />
                            <span>{item.students.toLocaleString()} học viên</span>
                          </div>
                        </div>
                        <div className="sv-ai-recommendation-card__footer">
                          <span className="sv-ai-recommendation-card__price">
                            <DollarSign className="h-4 w-4" />
                            {item.price}
                          </span>
                          <button className="sv-ai-recommendation-card__button">
                            <span>Xem khóa học</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                    
                    {isJobRecommendation(item) && (
                      <>
                        <p className="sv-ai-recommendation-card__company">
                          <Briefcase className="h-4 w-4" />
                          {item.company}
                        </p>
                        <div className="sv-ai-recommendation-card__meta">
                          <div className="sv-meta-item">
                            <Globe className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <div className="sv-meta-item">
                            <DollarSign className="h-4 w-4" />
                            <span>{item.salary}</span>
                          </div>
                        </div>
                        <div className="sv-ai-recommendation-card__footer">
                          <span className="sv-ai-recommendation-card__posted">
                            <Clock className="h-4 w-4" />
                            {item.posted}
                          </span>
                          <button className="sv-ai-recommendation-card__button">
                            <span>Xem việc làm</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                    
                    {isSkillRecommendation(item) && (
                      <>
                        <p className="sv-ai-recommendation-card__category">
                          <BarChart3 className="h-4 w-4" />
                          {item.category}
                        </p>
                        <div className="sv-ai-recommendation-card__meta">
                          <div className="sv-meta-item">
                            <Target className="h-4 w-4" />
                            <span>{item.difficulty}</span>
                          </div>
                          <div className="sv-meta-item">
                            <Clock className="h-4 w-4" />
                            <span>{item.timeToLearn}</span>
                          </div>
                          <div className="sv-meta-item">
                            <Zap className="h-4 w-4" />
                            <span>Nhu cầu {item.demand.toLowerCase()}</span>
                          </div>
                        </div>
                        <div className="sv-ai-recommendation-card__footer">
                          <button className="sv-ai-recommendation-card__button">
                            <span>Tìm hiểu thêm</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="sv-faq-section">
          <h2 className="sv-faq-title">
            <Lightbulb className="h-6 w-6 text-blue-500" />
            Câu Hỏi Thường Gặp
          </h2>
          <div className="sv-faq-grid">
            <div className="sv-faq-item" onClick={() => handleSuggestionClick("Làm sao để bắt đầu học lập trình?")}>
              <h3>Làm sao để bắt đầu học lập trình?</h3>
              <p>Tìm hiểu lộ trình học từ cơ bản đến nâng cao</p>
            </div>
            <div className="sv-faq-item" onClick={() => handleSuggestionClick("Ngành công nghệ nào có triển vọng nhất?")}>
              <h3>Ngành công nghệ nào có triển vọng nhất?</h3>
              <p>Khám phá xu hướng nghề nghiệp hot nhất</p>
            </div>
            <div className="sv-faq-item" onClick={() => handleSuggestionClick("Cần bao lâu để trở thành developer?")}>
              <h3>Cần bao lâu để trở thành developer?</h3>
              <p>Ước tính thời gian và kế hoạch học tập</p>
            </div>
            <div className="sv-faq-item" onClick={() => handleSuggestionClick("Lương developer tại Việt Nam như thế nào?")}>
              <h3>Lương developer tại Việt Nam như thế nào?</h3>
              <p>Thông tin mức lương theo kinh nghiệm</p>
            </div>
          </div>
        </div>

        {/* AI Stats */}
        <div className="sv-ai-stats">
          <div className="sv-ai-stats__header">
            <h3>🤖 Trợ lý AI của bạn</h3>
            <p>Được đào tạo với hàng triệu câu hỏi về nghề nghiệp và giáo dục</p>
          </div>
          <div className="sv-ai-stats__grid">
            <div className="sv-stat-item">
              <div className="sv-stat-number">24/7</div>
              <div className="sv-stat-label">Hỗ trợ</div>
            </div>
            <div className="sv-stat-item">
              <div className="sv-stat-number">1000+</div>
              <div className="sv-stat-label">Khóa học</div>
            </div>
            <div className="sv-stat-item">
              <div className="sv-stat-number">50+</div>
              <div className="sv-stat-label">Lĩnh vực</div>
            </div>
            <div className="sv-stat-item">
              <div className="sv-stat-number">95%</div>
              <div className="sv-stat-label">Chính xác</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meowl Guide */}
      <MeowlGuide currentPage="chatbot" />
    </div>
  );
};

export default ChatbotPage;