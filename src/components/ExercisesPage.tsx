import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ExerciseCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  type: 'chat' | 'drag-drop' | 'quiz' | 'interactive';
}

interface ExerciseCategory {
  id: string;
  title: string;
  description: string;
  exercises: ExerciseCard[];
}

const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'management',
    title: 'Manažerské dovednosti',
    description: 'Procvičte si dovednosti potřebné pro efektivní vedení týmu.',
    exercises: [
      {
        id: 'salary-negotiation',
        title: 'Zvýšení mzdy',
        description: 'Jak reagovat na požadavky o zvýšení mzdy',
        icon: '💰',
        path: '/dialogue-practice',
        difficulty: 'intermediate',
        duration: '5 min',
        type: 'chat'
      },
      {
        id: 'delegation',
        title: 'Delegování úkolů',
        description: 'Efektivní delegování úkolů v týmu',
        icon: '📋',
        path: '/delegation',
        difficulty: 'intermediate',
        duration: '10 min',
        type: 'interactive'
      },
      {
        id: 'project-management',
        title: 'Projektový manažer',
        description: 'Simulace řízení projektu a rozhodování',
        icon: '📊',
        path: '/decision-simulation',
        difficulty: 'advanced',
        duration: '15 min',
        type: 'interactive'
      }
    ]
  },
  {
    id: 'communication',
    title: 'Komunikace',
    description: 'Zlepšete své komunikační dovednosti pro efektivnější spolupráci.',
    exercises: [
      {
        id: 'active-listening',
        title: 'Aktivní naslouchání',
        description: 'Techniky aktivního naslouchání',
        icon: '👂',
        path: '/active-listening',
        difficulty: 'beginner',
        duration: '5 min',
        type: 'quiz'
      },
      {
        id: 'difficult-conversations',
        title: 'Obtížné konverzace',
        description: 'Zvládání obtížných konverzací',
        icon: '😓',
        path: '/difficult-conversations',
        difficulty: 'advanced',
        duration: '10 min',
        type: 'chat'
      },
      {
        id: 'performance-review',
        title: 'Hodnotící rozhovor',
        description: 'Simulace hodnotícího rozhovoru',
        icon: '🗣️',
        path: '/role-play',
        difficulty: 'intermediate',
        duration: '10 min',
        type: 'interactive'
      }
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Rozvíjejte své vůdčí schopnosti a inspirujte svůj tým.',
    exercises: [
      {
        id: 'team-motivation',
        title: 'Motivace týmu',
        description: 'Techniky pro zvýšení motivace týmu',
        icon: '🔥',
        path: '/feedback',
        difficulty: 'intermediate',
        duration: '5 min',
        type: 'quiz'
      },
      {
        id: 'conflict-resolution',
        title: 'Řešení konfliktů',
        description: 'Efektivní řešení konfliktů v týmu',
        icon: '🤝',
        path: '/conflict-resolution',
        difficulty: 'advanced',
        duration: '10 min',
        type: 'chat'
      },
      {
        id: 'strategic-thinking',
        title: 'Strategické myšlení',
        description: 'Rozvoj strategického myšlení',
        icon: '🧠',
        path: '/strategic-thinking',
        difficulty: 'advanced',
        duration: '15 min',
        type: 'drag-drop'
      }
    ]
  },
  {
    id: 'personal-development',
    title: 'Osobní rozvoj',
    description: 'Pracujte na svých osobních dovednostech pro lepší profesní život.',
    exercises: [
      {
        id: 'time-management',
        title: 'Time management',
        description: 'Efektivní řízení času a prioritizace',
        icon: '⏰',
        path: '/time-management',
        difficulty: 'beginner',
        duration: '5 min',
        type: 'drag-drop'
      },
      {
        id: 'stress-management',
        title: 'Zvládání stresu',
        description: 'Techniky pro zvládání stresu',
        icon: '🧘',
        path: '/stress-management',
        difficulty: 'beginner',
        duration: '5 min',
        type: 'quiz'
      },
      {
        id: 'feedback-skills',
        title: 'Zpětná vazba',
        description: 'Jak poskytovat konstruktivní zpětnou vazbu',
        icon: '💬',
        path: '/feedback',
        difficulty: 'intermediate',
        duration: '10 min',
        type: 'quiz'
      }
    ]
  }
];

// Create a context for user progress
interface UserProgressContextType {
  completedExercises: string[];
  markExerciseCompleted: (exerciseId: string) => void;
}

const defaultUserProgress: UserProgressContextType = {
  completedExercises: [],
  markExerciseCompleted: () => {}
};

export const UserProgressContext = React.createContext<UserProgressContextType>(defaultUserProgress);

// Create a provider component
export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load completed exercises from localStorage
  const loadCompletedExercises = (): string[] => {
    try {
      const saved = localStorage.getItem('completedExercises');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading completed exercises:', error);
    }
    return [];
  };

  // Initialize state with saved data
  const [completedExercises, setCompletedExercises] = React.useState<string[]>(loadCompletedExercises());
  
  // Log the current completed exercises for debugging
  React.useEffect(() => {
    console.log('Current completed exercises:', completedExercises);
  }, [completedExercises]);
  
  const markExerciseCompleted = (exerciseId: string) => {
    console.log(`Attempting to mark exercise ${exerciseId} as completed`);
    
    if (!completedExercises.includes(exerciseId)) {
      const updatedExercises = [...completedExercises, exerciseId];
      setCompletedExercises(updatedExercises);
      
      // Save to localStorage
      try {
        localStorage.setItem('completedExercises', JSON.stringify(updatedExercises));
        console.log(`Exercise ${exerciseId} marked as completed and saved to localStorage`);
      } catch (error) {
        console.error('Error saving completed exercises:', error);
      }
    } else {
      console.log(`Exercise ${exerciseId} is already marked as completed`);
    }
  };
  
  return (
    <UserProgressContext.Provider value={{ completedExercises, markExerciseCompleted }}>
      {children}
    </UserProgressContext.Provider>
  );
};

const DifficultyBadge: React.FC<{ difficulty: 'beginner' | 'intermediate' | 'advanced' }> = ({ difficulty }) => {
  const getColor = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    switch (difficulty) {
      case 'beginner':
        return 'Začátečník';
      case 'intermediate':
        return 'Pokročilý';
      case 'advanced':
        return 'Expert';
      default:
        return '';
    }
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getColor()}`}>
      {getLabel()}
    </span>
  );
};

const ExerciseTypeBadge: React.FC<{ type: 'chat' | 'drag-drop' | 'quiz' | 'interactive' }> = ({ type }) => {
  const getColor = () => {
    switch (type) {
      case 'chat':
        return 'bg-purple-100 text-purple-800';
      case 'drag-drop':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-orange-100 text-orange-800';
      case 'interactive':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'chat':
        return 'Chat';
      case 'drag-drop':
        return 'Drag & Drop';
      case 'quiz':
        return 'Quiz';
      case 'interactive':
        return 'Interaktivní';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'chat':
        return '💬';
      case 'drag-drop':
        return '🔄';
      case 'quiz':
        return '❓';
      case 'interactive':
        return '🎮';
      default:
        return '';
    }
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center ${getColor()}`}>
      <span className="mr-1">{getIcon()}</span>
      {getLabel()}
    </span>
  );
};

const ExerciseCard: React.FC<{ exercise: ExerciseCard }> = ({ exercise }) => {
  const { completedExercises, markExerciseCompleted } = useContext(UserProgressContext);
  const isCompleted = completedExercises.includes(exercise.id);
  
  return (
    <Link to={exercise.path} className="block h-full">
      <div className={`exercise-card ${isCompleted ? 'completed' : ''}`}>
        <div className="exercise-icon">{exercise.icon}</div>
        {isCompleted && (
          <div className="completed-badge">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <h3 className="exercise-title">{exercise.title}</h3>
        <p className="text-gray-600 text-sm">{exercise.description}</p>
        <div className="exercise-meta">
          <DifficultyBadge difficulty={exercise.difficulty} />
          <ExerciseTypeBadge type={exercise.type} />
          {isCompleted && (
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center bg-green-100 text-green-800">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Dokončeno
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const CategoryIcon = (categoryId: string) => {
  if (categoryId === 'management') {
    return (
      <div className="stacked-images">
        <img 
          src="https://seduocz.educdn.cz/images/125508-petr-pavel-leadship-cz.jpg" 
          alt="Leadership" 
          className="stacked-image image-1" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/111458-simon-panek-hodnotovy-leadership.jpg" 
          alt="Leadership" 
          className="stacked-image image-2" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/125708-filip-kahoun-manazer-na-startovni-care-3.png" 
          alt="Leadership" 
          className="stacked-image image-3" 
        />
      </div>
    );
  }
  
  if (categoryId === 'communication') {
    return (
      <div className="stacked-images">
        <img 
          src="https://seduocz.educdn.cz/images/127388-eva-markova-maxikurz.jpg" 
          alt="Communication" 
          className="stacked-image image-1" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/125702-jan-vojtko-lepsi-vztahy-cz.jpg" 
          alt="Communication" 
          className="stacked-image image-2" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/119336-f618523f-02e9-4674-b681-cca8bb9403de.jpg" 
          alt="Communication" 
          className="stacked-image image-3" 
        />
      </div>
    );
  }
  
  if (categoryId === 'leadership') {
    return (
      <div className="stacked-images">
        <img 
          src="https://seduocz.educdn.cz/images/111502-renata-novotna-motivujici-zpetnavazba.png" 
          alt="Leadership" 
          className="stacked-image image-1" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/126760-jiri-kula-donaha.png" 
          alt="Leadership" 
          className="stacked-image image-2" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/111516-rasto-duris-efektivni-delegovani-cz.jpg" 
          alt="Leadership" 
          className="stacked-image image-3" 
        />
      </div>
    );
  }
  
  if (categoryId === 'personal-development') {
    return (
      <div className="stacked-images">
        <img 
          src="https://seduocz.educdn.cz/images/125122-moric-pohoda.png" 
          alt="Personal Development" 
          className="stacked-image image-1" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/124307-martina-viktorie-kopecka-hledani-sebe-sama-cz.png" 
          alt="Personal Development" 
          className="stacked-image image-2" 
        />
        <img 
          src="https://seduocz.educdn.cz/images/114003-radka-jarose-cesta-na-vrchol-2.jpg" 
          alt="Personal Development" 
          className="stacked-image image-3" 
        />
      </div>
    );
  }
  
  // Default case
  return '📚';
};

const ExercisesPage: React.FC = () => {
  const { completedExercises } = useContext(UserProgressContext);
  
  // Calculate total number of exercises
  const totalExercises = exerciseCategories.reduce(
    (total, category) => total + category.exercises.length,
    0
  );

  // Calculate progress percentage
  const progressPercentage = Math.round((completedExercises.length / totalExercises) * 100);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
      }

      .rocket-float {
        display: inline-block;
        animation: float 3s ease-in-out infinite;
      }

      .welcome-banner {
        background: linear-gradient(135deg, #321C3D 0%, #3A1E5B 100%);
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .stacked-images {
        position: relative;
        width: 80px;
        height: 80px;
      }
      
      .stacked-image {
        position: absolute;
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 8px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      
      .image-1 {
        top: 0;
        left: 0;
        z-index: 3;
        transform: rotate(-8deg);
      }
      
      .image-2 {
        top: 10px;
        left: 20px;
        z-index: 2;
        transform: rotate(5deg);
      }
      
      .image-3 {
        top: 20px;
        left: 40px;
        z-index: 1;
        transform: rotate(12deg);
      }
      
      .category-header:hover .stacked-image {
        transform: translateY(-5px) rotate(0);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="welcome-banner mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 flex items-center justify-center mr-6">
              <span className="rocket-float text-4xl">🚀</span>
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-3xl font-bold mb-2">Týdenní výzvy</h2>
                <span className="ml-3 px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full">Zbývají 4 dny</span>
              </div>
              <p className="text-white/80">Procvičte si nové dovednosti v týdenní sadě cvičení. Nová sada každé pondělí.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="stats-card text-center">
              <div className="stats-icon">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xl font-bold text-white">{completedExercises.length}</div>
              <div className="text-xs text-white/70">Dokončeno</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="stats-icon">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-xl font-bold text-white">{totalExercises}</div>
              <div className="text-xs text-white/70">Celkem cvičení</div>
            </div>
            
            <div className="stats-card text-center">
              <div className="stats-icon">
                <div className="relative">
                  <svg className="w-6 h-6 text-purple-400 progress-circle" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - progressPercentage} transform="rotate(-90 18 18)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-white">{progressPercentage}%</div>
              <div className="text-xs text-white/70">Týdenní pokrok</div>
            </div>
          </div>
        </div>
      </div>

      {exerciseCategories.map(category => (
        <div key={category.id} className="mb-12">
          <div className="category-header mb-6">
            <div className="category-icon">{CategoryIcon(category.id)}</div>
            <div>
              <h2 className="text-2xl font-bold text-[#3A1E5B]">{category.title}</h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          
          <div className="exercise-grid">
            {category.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExercisesPage; 