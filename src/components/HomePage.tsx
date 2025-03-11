import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  // User data
  const userName = "Nikol";
  
  // Course data
  const featuredCourses = [
    {
      id: 'gamifikace',
      title: 'GAMIFIKACE V BYZNYSU',
      duration: '1 h 45 min',
      image: 'https://video-thumbnails.seduo.com/courses/521510033_1920_1080_1630330715.jpg',
      path: '/gamifikace'
    },
    {
      id: 'change-management',
      title: 'CHANGE MANAGEMENT',
      duration: '1 h 22 min',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      background: 'bg-gray-700',
      path: '/change-management'
    },
    {
      id: 'zvladani-zmen',
      title: 'Odvaha jít vlastní cestou',
      duration: '14:00 min',
      date: '10. 2. 2022',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      background: 'bg-gray-900',
      isWebinar: true,
      path: '/zvladani-zmen'
    }
  ];
  
  const recommendedCourses = [
    {
      id: 'asertivni-komunikace',
      title: 'Sebevědomá a asertivní komunikace',
      author: 'Eva Marková',
      rating: 89,
      duration: '45 min',
      lessons: 11,
      image: 'https://randomuser.me/api/portraits/women/42.jpg',
      recommendedBy: {
        name: 'Petr Novák',
        text: 'vám doporučuje tento kurz k vystudování'
      }
    },
    {
      id: 'nastaveni-mysli',
      title: 'NASTAVENÍ MYSLI: Jak změnit svoje myšlení?',
      author: 'GrowJOB a Petr Ludwig',
      rating: 96,
      duration: '1h 25m',
      lessons: 19,
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      isNew: true,
      recommendedBy: {
        text: 'Protože máte ráda kurzy od Pavla Morice'
      }
    },
    {
      id: 'reseni-konfliktu',
      title: 'Řešení konfliktů - taktiky a strategie',
      author: 'Eva Marková',
      rating: 91,
      duration: '50 min',
      lessons: 15,
      image: 'https://randomuser.me/api/portraits/women/43.jpg',
      recommendedBy: {
        text: 'Protože máte ráda marketing a osobní rozvoj'
      }
    },
    {
      id: 'zpetna-vazba',
      title: 'Motivující zpětná vazba, aneb zapomeňte na "sendvič"',
      author: 'Renata Novotná',
      rating: 92,
      duration: '48 min',
      lessons: 15,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      recommendedBy: {
        text: 'Od vašeho oblíbeného lektora'
      }
    }
  ];
  
  // Tab state
  const tabs = [
    { id: 'recommended', label: 'Přiřazené kurzy' },
    { id: 'in-progress', label: 'To už dokončíte' },
    { id: 'completed', label: 'Uložené kurzy' }
  ];
  const [activeTab, setActiveTab] = React.useState(tabs[0].id);
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .stats-card {
        padding: 1rem;
        border-radius: 0.75rem;
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
      }

      .stats-icon {
        display: flex;
        align-items: center;
        justify-center: center;
        margin-bottom: 0.5rem;
      }

      .progress-circle {
        transform: rotate(-90deg);
        transition: stroke-dashoffset 0.5s;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {featuredCourses.map((course, index) => (
          <Link to={course.path} key={course.id} className={`relative overflow-hidden rounded-xl ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
            <div className="aspect-video w-full h-full flex flex-col justify-end p-6 relative">
              {course.isWebinar && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                  Online webinář
                </div>
              )}
              
              <img 
                src={course.image}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                style={course.id === 'change-management' ? {
                  backgroundImage: 'url(https://video-thumbnails.seduo.com/courses/515393537_1920_1080_1630330715.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : course.id === 'zvladani-zmen' ? {
                  backgroundImage: 'url(https://video-thumbnails.seduo.com/courses/056b34c1-14cf-429e-800a-6fe517f3199a_1920_1080_1665483655.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : undefined}
              ></div>
              
              <div className="relative z-10">
                <h3 className="text-white font-bold text-xl md:text-2xl mb-2">{course.title}</h3>
                <div className="flex items-center text-white/80 text-sm">
                  {course.date && <span className="mr-4">{course.date}</span>}
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Course tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#FF9E1B] text-[#3A1E5B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full aspect-video object-cover"
              />
              {course.isNew && (
                <div className="absolute top-2 left-2 bg-[#FF9E1B] text-white text-xs font-semibold px-2 py-1 rounded-sm">
                  NOVINKA
                </div>
              )}
              <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-[#3A1E5B] mb-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{course.author}</p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center text-yellow-500 mr-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{course.rating}%</span>
                
                <div className="flex items-center ml-4">
                  <span className="text-sm text-gray-500">{course.duration}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{course.lessons} lekcí</span>
                </div>
              </div>
              
              {course.recommendedBy && (
                <div className="flex items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  {course.recommendedBy.name && (
                    <>
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                        {course.recommendedBy.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{course.recommendedBy.name}</span>
                    </>
                  )}
                  <span className={course.recommendedBy.name ? 'ml-1' : ''}>
                    {course.recommendedBy.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage; 