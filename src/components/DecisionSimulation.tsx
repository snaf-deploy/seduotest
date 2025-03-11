import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

// Interactive decision-making simulation
const DecisionSimulation: React.FC = () => {
  // Get the markExerciseCompleted function from context
  const { markExerciseCompleted } = useContext(UserProgressContext);
  
  // Game state
  const [currentStage, setCurrentStage] = useState(0);
  const [metrics, setMetrics] = useState({
    team: 70,
    client: 70,
    budget: 70,
    timeline: 70
  });
  const [decisions, setDecisions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [impact, setImpact] = useState<{
    team: number;
    client: number;
    budget: number;
    timeline: number;
  } | null>(null);
  const [animation, setAnimation] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Add confetti animations to the document
  useEffect(() => {
    // Add keyframes to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes confettiDrop {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(1000px) rotate(720deg);
          opacity: 0;
        }
      }
      
      @keyframes confettiSway {
        0% {
          transform: translateX(calc(-1 * var(--horizontal-movement)));
        }
        100% {
          transform: translateX(var(--horizontal-movement));
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Project stages
  const stages = [
    {
      title: "Začátek projektu",
      description: "Váš tým dostal nový projekt pro důležitého klienta. Máte omezený rozpočet a čas.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      options: [
        {
          text: "Začít okamžitě s vývojem, abychom ušetřili čas",
          impact: { team: -10, client: -5, budget: 0, timeline: +15 }
        },
        {
          text: "Provést důkladnou analýzu požadavků a plánování",
          impact: { team: +5, client: +10, budget: -5, timeline: -10 }
        },
        {
          text: "Vytvořit rychlý prototyp a získat zpětnou vazbu",
          impact: { team: +5, client: +5, budget: -5, timeline: 0 }
        }
      ]
    },
    {
      title: "Nejasné požadavky",
      description: "Během vývoje zjistíte, že některé požadavky klienta jsou nejasné a mohou být interpretovány různými způsoby.",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      options: [
        {
          text: "Pokračovat podle vašeho nejlepšího odhadu, abyste neztratili čas",
          impact: { team: 0, client: -15, budget: +5, timeline: +10 }
        },
        {
          text: "Svolat schůzku s klientem a vyjasnit všechny nejasnosti",
          impact: { team: +5, client: +10, budget: 0, timeline: -10 }
        },
        {
          text: "Poslat email s dotazy a pokračovat v práci na jiných částech",
          impact: { team: 0, client: 0, budget: 0, timeline: -5 }
        }
      ]
    },
    {
      title: "Problémy v týmu",
      description: "Dva klíčoví členové týmu mají konflikt ohledně technického řešení, což zpomaluje práci.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      options: [
        {
          text: "Autoritativně rozhodnout a ukončit debatu",
          impact: { team: -15, client: 0, budget: +5, timeline: +5 }
        },
        {
          text: "Uspořádat moderovanou diskuzi a najít kompromis",
          impact: { team: +10, client: 0, budget: -5, timeline: -5 }
        },
        {
          text: "Nechat je vyřešit konflikt mezi sebou",
          impact: { team: -5, client: 0, budget: 0, timeline: -10 }
        }
      ]
    },
    {
      title: "Nečekaný technický problém",
      description: "Uprostřed projektu narazíte na závažný technický problém, který nikdo nepředvídal.",
      image: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      options: [
        {
          text: "Přidat další vývojáře, aby problém rychle vyřešili",
          impact: { team: -5, client: +5, budget: -15, timeline: +5 }
        },
        {
          text: "Informovat klienta a požádat o prodloužení termínu",
          impact: { team: +5, client: -10, budget: +5, timeline: -15 }
        },
        {
          text: "Pracovat přesčas a o víkendech, abyste dodrželi termín",
          impact: { team: -15, client: +10, budget: -5, timeline: +10 }
        }
      ]
    },
    {
      title: "Blížící se deadline",
      description: "Blíží se termín odevzdání, ale ještě zbývá dokončit několik funkcí. Kvalita kódu začíná trpět.",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80",
      options: [
        {
          text: "Snížit rozsah projektu a dodat jen klíčové funkce",
          impact: { team: +5, client: -10, budget: +10, timeline: +15 }
        },
        {
          text: "Dodat vše, ale s nižší kvalitou kódu, který opravíte později",
          impact: { team: -10, client: +5, budget: -5, timeline: +10 }
        },
        {
          text: "Najmout externí vývojáře na dokončení projektu včas",
          impact: { team: -5, client: +10, budget: -20, timeline: +5 }
        }
      ]
    }
  ];

  // Reset game
  const resetGame = () => {
    setCurrentStage(0);
    setMetrics({
      team: 70,
      client: 70,
      budget: 70,
      timeline: 70
    });
    setDecisions([]);
    setShowResults(false);
    setShowImpact(false);
    setImpact(null);
    setAnimation('');
    setGameOver(false);
    setShowTutorial(true);
  };

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    const selectedOption = stages[currentStage].options[optionIndex];
    
    // Save decision
    setDecisions([...decisions, selectedOption.text]);
    
    // Show impact animation
    setImpact(selectedOption.impact);
    setShowImpact(true);
    
    // Apply impact after animation
    setTimeout(() => {
      setMetrics({
        team: Math.max(0, Math.min(100, metrics.team + selectedOption.impact.team)),
        client: Math.max(0, Math.min(100, metrics.client + selectedOption.impact.client)),
        budget: Math.max(0, Math.min(100, metrics.budget + selectedOption.impact.budget)),
        timeline: Math.max(0, Math.min(100, metrics.timeline + selectedOption.impact.timeline))
      });
      
      // Move to next stage or show results
      setTimeout(() => {
        setShowImpact(false);
        
        if (currentStage < stages.length - 1) {
          setCurrentStage(currentStage + 1);
        } else {
          setShowResults(true);
          setGameOver(true);
          setAnimation('confetti');
        }
      }, 1500);
    }, 1500);
  };

  // Get color based on metric value
  const getMetricColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get bar color based on metric value
  const getBarColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get impact color (positive or negative)
  const getImpactColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get impact icon (up, down, or neutral)
  const getImpactIcon = (value: number) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  // Get final result message
  const getFinalResult = () => {
    const totalScore = metrics.team + metrics.client + metrics.budget + metrics.timeline;
    const maxScore = 400; // 4 metrics * 100 max value
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage >= 80) {
      // Mark exercise as completed if score is high enough
      markExerciseCompleted('project-management');
      
      return {
        title: "Výborně!",
        message: "Projekt byl velmi úspěšný. Váš tým je spokojený, klient je nadšený, rozpočet a časový plán byly dodrženy.",
        icon: "🏆"
      };
    } else if (percentage >= 60) {
      // Mark exercise as completed if score is good enough
      markExerciseCompleted('project-management');
      
      return {
        title: "Dobrá práce!",
        message: "Projekt byl úspěšný, i když s několika výzvami. Většina metrik je v dobrém stavu.",
        icon: "👍"
      };
    } else if (percentage >= 40) {
      return {
        title: "Přijatelný výsledek",
        message: "Projekt byl dokončen, ale s významnými problémy. Některé metriky jsou v kritickém stavu.",
        icon: "😐"
      };
    } else {
      return {
        title: "Projekt selhal",
        message: "Projekt se potýkal s vážnými problémy. Většina metrik je v kritickém stavu.",
        icon: "😞"
      };
    }
  };

  // Generate random confetti pieces
  const generateConfetti = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -5,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      rotation: Math.random() * 360,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      horizontalMovement: Math.random() * 15 - 7.5
    }));
  };

  const confetti = generateConfetti();

  return (
    <div className="min-h-screen bg-[#F5F6F7] p-4 md:p-6 flex flex-col">
      {animation === 'confetti' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {confetti.map((piece) => (
              <div
                key={piece.id}
                className="absolute"
                style={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  background: piece.color,
                  borderRadius: '50%',
                  transform: `rotate(${piece.rotation}deg)`,
                  animation: `confettiDrop ${piece.duration}s ease-in-out forwards, confettiSway ${piece.duration * 0.5}s ease-in-out infinite alternate`,
                  animationDelay: `${piece.delay}s`,
                  '--horizontal-movement': `${piece.horizontalMovement}px`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
      
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Vítejte v simulaci projektového řízení</h3>
            <p className="mb-4">
              V této simulaci budete činit rozhodnutí jako projektový manažer. Každé rozhodnutí ovlivní čtyři klíčové metriky:
            </p>
            <ul className="mb-4 space-y-2">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <strong>Tým</strong> - spokojenost a produktivita vašeho týmu
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <strong>Klient</strong> - spokojenost klienta s projektem
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <strong>Rozpočet</strong> - jak dobře dodržujete rozpočet
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                <strong>Časový plán</strong> - jak dobře dodržujete časový plán
              </li>
            </ul>
            <p className="mb-4">
              Všechny metriky začínají na 70%. Vaším cílem je udržet je co nejvyšší po celou dobu projektu.
            </p>
            <div className="flex justify-end">
              <button 
                className="btn-primary"
                onClick={() => setShowTutorial(false)}
              >
                Začít simulaci
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
          
          {!gameOver && (
            <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
              {currentStage + 1} / {stages.length}
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold mb-1 text-[#321C3D]">Projektový manažer</h1>
        <p className="text-gray-600 text-sm mb-3">Rozhodujte jako projektový manažer a sledujte dopad vašich rozhodnutí</p>
        
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="card p-2 text-center">
            <div className="text-xs font-medium">Tým</div>
            <div className={`text-lg font-bold ${getMetricColor(metrics.team)}`}>{metrics.team}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(metrics.team)}`} 
                style={{ width: `${metrics.team}%` }}
              ></div>
            </div>
            {showImpact && impact && (
              <div className={`text-xs mt-1 ${getImpactColor(impact.team)}`}>
                {getImpactIcon(impact.team)} {impact.team > 0 ? '+' : ''}{impact.team}%
              </div>
            )}
          </div>
          
          <div className="card p-2 text-center">
            <div className="text-xs font-medium">Klient</div>
            <div className={`text-lg font-bold ${getMetricColor(metrics.client)}`}>{metrics.client}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(metrics.client)}`} 
                style={{ width: `${metrics.client}%` }}
              ></div>
            </div>
            {showImpact && impact && (
              <div className={`text-xs mt-1 ${getImpactColor(impact.client)}`}>
                {getImpactIcon(impact.client)} {impact.client > 0 ? '+' : ''}{impact.client}%
              </div>
            )}
          </div>
          
          <div className="card p-2 text-center">
            <div className="text-xs font-medium">Rozpočet</div>
            <div className={`text-lg font-bold ${getMetricColor(metrics.budget)}`}>{metrics.budget}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(metrics.budget)}`} 
                style={{ width: `${metrics.budget}%` }}
              ></div>
            </div>
            {showImpact && impact && (
              <div className={`text-xs mt-1 ${getImpactColor(impact.budget)}`}>
                {getImpactIcon(impact.budget)} {impact.budget > 0 ? '+' : ''}{impact.budget}%
              </div>
            )}
          </div>
          
          <div className="card p-2 text-center">
            <div className="text-xs font-medium">Časový plán</div>
            <div className={`text-lg font-bold ${getMetricColor(metrics.timeline)}`}>{metrics.timeline}%</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className={`h-1.5 rounded-full ${getBarColor(metrics.timeline)}`} 
                style={{ width: `${metrics.timeline}%` }}
              ></div>
            </div>
            {showImpact && impact && (
              <div className={`text-xs mt-1 ${getImpactColor(impact.timeline)}`}>
                {getImpactIcon(impact.timeline)} {impact.timeline > 0 ? '+' : ''}{impact.timeline}%
              </div>
            )}
          </div>
        </div>
        
        {!showResults ? (
          <div className="card flex-1 flex flex-col">
            <div className="relative h-32 mb-3 rounded-xl overflow-hidden">
              <img 
                src={stages[currentStage].image} 
                alt={stages[currentStage].title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h2 className="text-lg font-bold text-white p-3">{stages[currentStage].title}</h2>
              </div>
            </div>
            
            <p className="text-base mb-3">{stages[currentStage].description}</p>
            
            <h3 className="text-base font-medium mb-2">Jak se rozhodnete?</h3>
            
            <div className="space-y-2 flex-1 overflow-auto">
              {stages[currentStage].options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-left transition-all hover:border-[#18B48E] hover:bg-[#18B48E]/5 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onClick={() => handleOptionSelect(index)}
                  disabled={showImpact}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="card flex-1 overflow-auto">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{getFinalResult().icon}</div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-[#18B48E]">{getFinalResult().title}</h2>
                <p className="text-gray-700 text-sm">{getFinalResult().message}</p>
              </div>
            </div>
            
            <h3 className="text-base font-medium mb-3">Konečné metriky projektu:</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <div className="text-xs font-medium">Tým</div>
                <div className={`text-lg font-bold ${getMetricColor(metrics.team)}`}>{metrics.team}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${getBarColor(metrics.team)}`} 
                    style={{ width: `${metrics.team}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <div className="text-xs font-medium">Klient</div>
                <div className={`text-lg font-bold ${getMetricColor(metrics.client)}`}>{metrics.client}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${getBarColor(metrics.client)}`} 
                    style={{ width: `${metrics.client}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <div className="text-xs font-medium">Rozpočet</div>
                <div className={`text-lg font-bold ${getMetricColor(metrics.budget)}`}>{metrics.budget}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${getBarColor(metrics.budget)}`} 
                    style={{ width: `${metrics.budget}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
                <div className="text-xs font-medium">Časový plán</div>
                <div className={`text-lg font-bold ${getMetricColor(metrics.timeline)}`}>{metrics.timeline}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${getBarColor(metrics.timeline)}`} 
                    style={{ width: `${metrics.timeline}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <h3 className="text-base font-medium mb-2">Vaše rozhodnutí:</h3>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-auto">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {decisions.map((decision, index) => (
                  <li key={index} className="text-gray-700">{decision}</li>
                ))}
              </ol>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4 text-sm">
              <h3 className="font-bold text-blue-800 mb-1">Klíčové principy projektového řízení:</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li><strong>Komunikace:</strong> Jasná a častá komunikace s týmem a klientem</li>
                <li><strong>Plánování:</strong> Důkladné plánování před zahájením práce</li>
                <li><strong>Flexibilita:</strong> Schopnost přizpůsobit se změnám a nečekaným problémům</li>
                <li><strong>Rovnováha:</strong> Vyvážení potřeb týmu, klienta, rozpočtu a časového plánu</li>
                <li><strong>Řešení konfliktů:</strong> Efektivní řešení konfliktů v týmu</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn-primary bg-white text-[#18B48E] border border-[#18B48E] hover:bg-[#18B48E]/5"
                onClick={resetGame}
              >
                Zkusit znovu
              </button>
              
              <Link to="/exercises" className="btn-primary">
                Dokončit cvičení
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionSimulation; 