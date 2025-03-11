import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Simple feedback practice component
const Feedback: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{
    scenario: string;
    choice: string;
    wasCorrect: boolean;
    explanation: string;
  }>>([]);

  const feedbackRef = useRef<HTMLDivElement>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Simplified scenarios with clear options
  const scenarios = [
    {
      situation: "Junior vývojář opakovaně odevzdává kód bez unit testů",
      context: "Máte v týmu juniora, který je technicky zdatný a píše dobrý kód. Nicméně i přes předchozí upozornění stále neodevzdává unit testy ke svému kódu, což komplikuje review process a zvyšuje riziko bugů v produkci.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
      options: [
        {
          id: "1a",
          text: "Tohle už je poněkolikáté. Příště bez testů kód nepřijmu do review.",
          type: "directive",
          feedback: "Tento přístup je příliš konfrontační a může vyvolat odpor. Navíc nepomáhá juniorovi pochopit hodnotu testování.",
          explanation: "Efektivní zpětná vazba by měla zahrnovat vysvětlení PROČ jsou testy důležité a nabídnout podporu při jejich implementaci.",
          isCorrect: false
        },
        {
          id: "1b",
          text: "Všiml jsem si, že kód stále neobsahuje testy. Můžeme si společně projít, jak testy psát a jakou přidávají hodnotu? Rád ti s tím pomohu.",
          type: "constructive",
          feedback: "Výborně! Nabízíte podporu a vzdělávání místo kritiky.",
          explanation: "Tento přístup je efektivní, protože:\n1. Uznáváte problém konkrétně\n2. Nabízíte řešení a podporu\n3. Vytváříte příležitost pro učení\n4. Zachováváte pozitivní vztah",
          isCorrect: true
        },
        {
          id: "1c",
          text: "Příště prosím nezapomeň na testy, jsou důležité.",
          type: "vague",
          feedback: "Tato zpětná vazba je příliš vágní a neposkytuje konkrétní vedení nebo podporu.",
          explanation: "Chybí zde:\n1. Konkrétní důvody proč jsou testy důležité\n2. Nabídka pomoci\n3. Příležitost k diskuzi\n4. Konstruktivní řešení situace",
          isCorrect: false
        }
      ],
      bestPractice: "Při poskytování zpětné vazby juniorům je klíčové kombinovat jasné očekávání s podporou a mentoringem. Vysvětlení 'proč' je stejně důležité jako 'co' a 'jak'."
    },
    {
      situation: "Seniorní kolega má konfliktní komunikaci v code reviews",
      context: "Váš seniorní vývojář má hluboké technické znalosti, ale jeho komentáře v code reviews jsou často sarkastické a někdy až agresivní. Několik členů týmu se již zmínilo, že se bojí commitovat kód kvůli jeho reakcím.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      options: [
        {
          id: "2a",
          text: "Vaše technické znalosti jsou pro tým velmi cenné, ale způsob, jakým komunikujete v code reviews, má negativní dopad na tým. Můžeme probrat, jak poskytovat konstruktivnější feedback?",
          type: "constructive",
          feedback: "Výborně! Uznáváte hodnotu kolegy a zároveň adresujete problém přímo a konstruktivně.",
          explanation: "Tento přístup je efektivní, protože:\n1. Začínáte pozitivním uznáním\n2. Jasně pojmenováváte problém\n3. Vysvětlujete dopad na tým\n4. Nabízíte společné hledání řešení",
          isCorrect: true
        },
        {
          id: "2b",
          text: "Tým si stěžuje na tvoje code reviews. Musíš změnit svůj přístup.",
          type: "directive",
          feedback: "Tento přístup je příliš konfrontační a může vést k defenzivní reakci.",
          explanation: "Chybí zde:\n1. Uznání pozitivních přínosů\n2. Konkrétní příklady problému\n3. Vysvětlení dopadu\n4. Konstruktivní návrh řešení",
          isCorrect: false
        },
        {
          id: "2c",
          text: "Mohl bys být prosím v code reviews mírnější? Lidé se bojí commitovat.",
          type: "vague",
          feedback: "Tato zpětná vazba je příliš měkká a neadresuje jádro problému.",
          explanation: "Tento přístup není optimální, protože:\n1. Nespecifikuje konkrétní problémové chování\n2. Neposkytuje jasná očekávání\n3. Nezmiňuje hodnotu technických znalostí\n4. Může být snadno odmítnut",
          isCorrect: false
        }
      ],
      bestPractice: "Při poskytování zpětné vazby seniorním kolegům je důležité uznat jejich expertizu a přínos, ale zároveň jasně komunikovat dopady jejich chování na tým."
    },
    {
      situation: "Člen týmu pravidelně chodí pozdě na stand-upy",
      context: "Jeden z vašich vývojářů opakovaně chodí pozdě na ranní stand-upy, což narušuje plynulost meetingů a zdržuje ostatní členy týmu. Jeho práce je jinak kvalitní a termíny plní včas.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      options: [
        {
          id: "3a",
          text: "Všímám si, že často chodíš pozdě na stand-upy. Oceňuji kvalitu tvé práce, ale pozdní příchody narušují plynulost meetingů. Co ti brání přijít včas?",
          type: "constructive",
          feedback: "Výborně! Kombinujete uznání pozitivního s adresováním problému a hledáním příčin.",
          explanation: "Tento přístup je efektivní, protože:\n1. Konkrétně pojmenováváte problém\n2. Uznáváte silné stránky\n3. Vysvětlujete dopad na tým\n4. Ptáte se na příčiny a hledáte řešení",
          isCorrect: true
        },
        {
          id: "3b",
          text: "Buď prosím příště včas na stand-upu.",
          type: "directive",
          feedback: "Tato zpětná vazba je příliš strohá a neposkytuje prostor pro dialog.",
          explanation: "Chybí zde:\n1. Uznání dobré práce\n2. Vysvětlení dopadu na tým\n3. Snaha pochopit příčiny\n4. Prostor pro společné řešení",
          isCorrect: false
        },
        {
          id: "3c",
          text: "Vím, že odvádíš skvělou práci, ale měl bys chodit včas na meetingy.",
          type: "sandwich",
          feedback: "Sendvičová metoda zde není optimální, protože neřeší příčiny problému.",
          explanation: "Tento přístup není nejlepší, protože:\n1. Změkčuje důležitost problému\n2. Neposkytuje konkrétní feedback\n3. Neotevírá prostor pro dialog\n4. Neřeší skutečné příčiny",
          isCorrect: false
        }
      ],
      bestPractice: "Efektivní zpětná vazba by měla být konkrétní, vyvážená a zaměřená na hledání řešení. Je důležité uznat silné stránky, ale zároveň jasně komunikovat problémy a jejich dopady."
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    
    const selectedOptionData = scenarios[currentScenario].options.find(
      (option) => option.id === optionId
    );

    if (!selectedOptionData) return;

    setSelectedOption(optionId);
    setShowFeedback(true);

    setFeedbackHistory(prev => [...prev, {
      scenario: scenarios[currentScenario].situation,
      choice: selectedOptionData.text,
      wasCorrect: selectedOptionData.isCorrect,
      explanation: selectedOptionData.explanation
    }]);

    if (selectedOptionData.isCorrect) {
      setScore(prev => prev + 1);
    }

    // Scroll to feedback after a short delay to ensure the content is rendered
    setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setShowExplanation(false);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsComplete(true);
    }
  };

  const resetExercise = () => {
    setCurrentScenario(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setIsComplete(false);
    setFeedbackHistory([]);
    setShowExplanation(false);
  };

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'constructive': return '🎯';
      case 'directive': return '⚠️';
      case 'sandwich': return '🥪';
      case 'vague': return '❓';
      default: return '';
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case 'constructive': return 'Konstruktivní zpětná vazba';
      case 'directive': return 'Direktivní přístup';
      case 'sandwich': return 'Sendvičová metoda';
      case 'vague': return 'Vágní zpětná vazba';
      default: return '';
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'constructive': return 'bg-green-100 text-green-800';
      case 'directive': return 'bg-red-100 text-red-800';
      case 'sandwich': return 'bg-yellow-100 text-yellow-800';
      case 'vague': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / scenarios.length) * 100;
    
    if (percentage >= 80) {
      return {
        title: 'Výborně!',
        message: 'Máte skvělé porozumění principům efektivní zpětné vazby.',
        icon: '🏆',
        color: 'text-green-600'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Dobrý základ!',
        message: 'Rozumíte základním principům zpětné vazby, ale je zde prostor pro zlepšení.',
        icon: '👍',
        color: 'text-yellow-600'
      };
    } else {
      return {
        title: 'Prostor pro zlepšení',
        message: 'Zkuste se zaměřit na konkrétnost a konstruktivnost ve vaší zpětné vazbě.',
        icon: '📚',
        color: 'text-red-600'
      };
    }
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
      <div className="card max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
        </div>
        
        {!isComplete ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[#321C3D]">Poskytování zpětné vazby</h1>
              <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                {currentScenario + 1} / {scenarios.length}
              </div>
            </div>
            
            <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
              <img 
                src={currentScenarioData.image} 
                alt={currentScenarioData.situation} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h2 className="text-xl font-bold text-white p-4">{currentScenarioData.situation}</h2>
              </div>
            </div>
            
            <div className="bg-[#321C3D] text-white p-4 rounded-xl mb-6">
              <div className="text-lg font-medium mb-2">Situace:</div>
              <p className="text-white/90">{currentScenarioData.context}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Vyberte nejefektivnější způsob poskytnutí zpětné vazby:</h3>
              
              <div className="space-y-4">
                {currentScenarioData.options.map(option => (
                  <div 
                    key={option.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedOption === option.id 
                        ? option.isCorrect 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-[#18B48E] hover:shadow'
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <p className="text-gray-800">{option.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {showFeedback && (
              <div ref={feedbackRef} className="mt-6 space-y-4">
                <div className={`p-4 rounded-lg ${
                  selectedOption && scenarios[currentScenario].options.find(o => o.id === selectedOption)?.isCorrect
                    ? 'bg-green-100'
                    : 'bg-yellow-100'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {selectedOption && scenarios[currentScenario].options.find(o => o.id === selectedOption)?.isCorrect ? (
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium mb-2 ${
                        selectedOption && scenarios[currentScenario].options.find(o => o.id === selectedOption)?.isCorrect
                          ? 'text-green-800'
                          : 'text-yellow-800'
                      }`}>
                        {selectedOption && scenarios[currentScenario].options.find(o => o.id === selectedOption)?.feedback}
                      </p>
                      <div className="text-sm whitespace-pre-line text-gray-700">
                        {selectedOption && scenarios[currentScenario].options.find(o => o.id === selectedOption)?.explanation}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-800 mb-2">Nejlepší praxe:</h4>
                  <p className="text-blue-800">{currentScenarioData.bestPractice}</p>
                </div>

                <div className="flex justify-end mt-4">
                  <button 
                    className="px-6 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90 transition-colors"
                    onClick={handleNextScenario}
                  >
                    {currentScenario < scenarios.length - 1 ? 'Další situace' : 'Zobrazit výsledky'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className={`p-6 rounded-xl mb-6 bg-opacity-10 ${getScoreMessage().color}`}>
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-6">{getScoreMessage().icon}</div>
                <div>
                  <h2 className={`text-3xl font-bold mb-2 ${getScoreMessage().color}`}>
                    {getScoreMessage().title}
                  </h2>
                  <p className="text-gray-700">{getScoreMessage().message}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Přehled vašich odpovědí</h3>
                <div className="space-y-4">
                  {feedbackHistory.map((entry, index) => (
                    <div key={index} className={`p-4 rounded-lg ${
                      entry.wasCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className="font-medium mb-2">{entry.scenario}</div>
                      <p className="text-sm mb-2">Vaše odpověď:</p>
                      <p className="text-gray-700 mb-3 pl-4 border-l-2 border-gray-300">
                        {entry.choice}
                      </p>
                      <div className={`text-sm ${
                        entry.wasCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {entry.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <h4 className="font-bold text-blue-800 mb-2">Klíčové principy efektivní zpětné vazby:</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Buďte konkrétní - popište situaci a její dopad</li>
                <li>Zaměřte se na chování, ne na osobnost</li>
                <li>Nabídněte konstruktivní řešení a podporu</li>
                <li>Vytvořte bezpečný prostor pro dialog</li>
                <li>Poskytujte zpětnou vazbu včas a v soukromí</li>
                <li>Vysvětlete důvody a kontext</li>
                <li>Buďte empatičtí a profesionální</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-6 py-3 bg-white text-[#18B48E] border border-[#18B48E] rounded-lg hover:bg-[#18B48E]/5 transition-colors"
                onClick={resetExercise}
              >
                Zkusit znovu
              </button>
              
              <Link 
                to="/exercises" 
                className="px-6 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90 transition-colors"
              >
                Dokončit cvičení
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback; 