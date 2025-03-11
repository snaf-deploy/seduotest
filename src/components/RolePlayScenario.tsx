import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

interface DialogueOption {
  id: string;
  text: string;
  impact: {
    rapport: number;
    progress: number;
    professionalism: number;
  };
  feedback: string;
  nextDialogue?: string;
}

interface DialogueNode {
  id: string;
  speaker: 'employee' | 'you';
  text: string;
  emotion?: 'neutral' | 'angry' | 'concerned' | 'satisfied' | 'defensive';
  options?: DialogueOption[];
}

interface Scenario {
  id: string;
  title: string;
  context: string;
  objectives: string[];
  dialogueTree: { [key: string]: DialogueNode };
  startingNode: string;
}

interface DialogueHistoryEntry {
  speaker: 'employee' | 'you';
  text: string;
  emotion?: string;
}

const RolePlayScenario: React.FC = () => {
  const [currentNode, setCurrentNode] = useState<string>('');
  const [history, setHistory] = useState<DialogueHistoryEntry[]>([]);
  const [metrics, setMetrics] = useState({
    rapport: 50,
    progress: 0,
    professionalism: 50,
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const dialogueRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scenario: Scenario = {
    id: '1',
    title: 'Hodnotící rozhovor',
    context: 'Jako vedoucí týmu jste si všimli, že jeden z vašich nejzkušenějších vývojářů v posledních měsících výrazně snížil svůj výkon. Termíny nejsou dodržovány, kvalita kódu klesá a spolupráce s týmem vázne. Dříve patřil mezi nejspolehlivější členy týmu. Pozvali jste ho na osobní rozhovor, abyste situaci řešili. Je důležité zjistit příčiny problémů a najít konstruktivní řešení, které pomůže jak zaměstnanci, tak týmu.',
    objectives: [
      'Identifikovat příčiny problémů',
      'Udržet profesionální atmosféru',
      'Najít řešení situace'
    ],
    dialogueTree: {
      'start': {
        id: 'start',
        speaker: 'employee',
        text: '',
        emotion: 'neutral',
        options: [
          {
            id: '1a',
            text: 'Dobrý den, posaďte se prosím. Jak se dnes máte?',
            impact: { rapport: 5, progress: 0, professionalism: 5 },
            feedback: 'Dobrý začátek - vytváříte příjemnou atmosféru.',
            nextDialogue: 'casual'
          },
          {
            id: '1b',
            text: 'Dobrý den, pojďme rovnou k věci. Máme tu několik problémů s vaším výkonem.',
            impact: { rapport: -10, progress: 5, professionalism: -5 },
            feedback: 'Přímý přístup, ale může působit příliš konfrontačně.',
            nextDialogue: 'defensive'
          },
          {
            id: '1c',
            text: 'Dobrý den, děkuji že jste přišel. Rád bych s vámi probral vaši práci v poslední době.',
            impact: { rapport: 0, progress: 5, professionalism: 10 },
            feedback: 'Profesionální a vyvážený přístup.',
            nextDialogue: 'interested'
          }
        ]
      },
      'casual': {
        id: 'casual',
        speaker: 'employee',
        text: 'Děkuji, celkem dobře. Jen jsem trochu nervózní z tohoto setkání.',
        emotion: 'concerned',
        options: [
          {
            id: '2a',
            text: 'To je v pořádku, není důvod k nervozitě. Jsem tu od toho, abych vám pomohl.',
            impact: { rapport: 10, progress: 5, professionalism: 5 },
            feedback: 'Výborně - uklidňujete zaměstnance a vytváříte bezpečné prostředí.',
            nextDialogue: 'opening'
          },
          {
            id: '2b',
            text: 'Chápu. Pojďme tedy rovnou probrat vaše pracovní výsledky.',
            impact: { rapport: -5, progress: 10, professionalism: 0 },
            feedback: 'Mohli jste více pracovat s emocemi zaměstnance.',
            nextDialogue: 'defensive'
          }
        ]
      },
      'defensive': {
        id: 'defensive',
        speaker: 'employee',
        text: 'Já vím, že se to může zdát jako problémy, ale dělám, co můžu. Není to tak jednoduché.',
        emotion: 'defensive',
        options: [
          {
            id: '3a',
            text: 'Můžete mi prosím vysvětlit, s čím konkrétně máte potíže?',
            impact: { rapport: 5, progress: 10, professionalism: 10 },
            feedback: 'Výborně - dáváte prostor pro vysvětlení a snažíte se pochopit situaci.',
            nextDialogue: 'opening'
          },
          {
            id: '3b',
            text: 'Výsledky mluví jasně. Potřebujeme to zlepšit.',
            impact: { rapport: -10, progress: -5, professionalism: -5 },
            feedback: 'Tento přístup může vést k další defenzivě a nezlepší situaci.',
            nextDialogue: 'angry'
          }
        ]
      },
      'angry': {
        id: 'angry',
        speaker: 'employee',
        text: 'Možná bychom tento rozhovor měli odložit. Jsem teď docela naštvaný.',
        emotion: 'angry',
        options: [
          {
            id: '4a',
            text: 'Máte pravdu, dejme si chvíli pauzu a zkusme to znovu s čistou hlavou.',
            impact: { rapport: 10, progress: 5, professionalism: 10 },
            feedback: 'Výborně - respektujete emoce a dáváte prostor pro uklidnění.',
            nextDialogue: 'calming'
          },
          {
            id: '4b',
            text: 'Musíme to vyřešit teď. Je to důležité.',
            impact: { rapport: -15, progress: -10, professionalism: -10 },
            feedback: 'Tento přístup může situaci jen zhoršit.',
            nextDialogue: 'conflict'
          }
        ]
      },
      'interested': {
        id: 'interested',
        speaker: 'employee',
        text: 'Ano, vím že poslední dobou nejsou mé výsledky ideální. Mám nějaké osobní problémy, které to ovlivňují.',
        emotion: 'concerned',
        options: [
          {
            id: '5a',
            text: 'To mě mrzí. Můžeme probrat, jak vám můžeme pomoct tuto situaci zvládnout?',
            impact: { rapport: 15, progress: 10, professionalism: 10 },
            feedback: 'Výborně - projevujete empatii a nabízíte podporu.',
            nextDialogue: 'solution'
          },
          {
            id: '5b',
            text: 'Chápu, ale práce musí být na prvním místě.',
            impact: { rapport: -10, progress: -5, professionalism: -5 },
            feedback: 'Tento přístup ignoruje lidský aspekt situace.',
            nextDialogue: 'defensive'
          }
        ]
      },
      'opening': {
        id: 'opening',
        speaker: 'employee',
        text: 'Poslední měsíce jsou pro mě náročné. Mám problémy se soustředěním a organizací času.',
        emotion: 'concerned',
        options: [
          {
            id: '6a',
            text: 'Děkuji za upřímnost. Pojďme společně najít způsob, jak vám s tím pomoct.',
            impact: { rapport: 10, progress: 15, professionalism: 10 },
            feedback: 'Výborně - oceňujete otevřenost a nabízíte podporu.',
            nextDialogue: 'solution'
          },
          {
            id: '6b',
            text: 'To chápu, ale potřebujeme najít způsob, jak to zlepšit co nejdříve.',
            impact: { rapport: 0, progress: 5, professionalism: 5 },
            feedback: 'Mohli jste projevit více empatie.',
            nextDialogue: 'solution'
          }
        ]
      },
      'solution': {
        id: 'solution',
        speaker: 'employee',
        text: 'Děkuji za pochopení. Myslím, že by mi pomohlo, kdybych měl jasnější priority a možnost konzultovat složitější úkoly.',
        emotion: 'satisfied',
        options: [
          {
            id: '7a',
            text: 'To zní rozumně. Nastavíme pravidelné konzultace a vytvoříme systém priorit.',
            impact: { rapport: 10, progress: 15, professionalism: 15 },
            feedback: 'Výborně - nabízíte konkrétní řešení a podporu.',
            nextDialogue: 'final'
          },
          {
            id: '7b',
            text: 'Dobře, ale očekávám, že se výsledky rychle zlepší.',
            impact: { rapport: -5, progress: 5, professionalism: 0 },
            feedback: 'Mohli jste být více podporující.',
            nextDialogue: 'final'
          }
        ]
      },
      'final': {
        id: 'final',
        speaker: 'employee',
        text: 'Děkuji za tento rozhovor. Cítím se lépe a věřím, že společně najdeme cestu ke zlepšení.',
        emotion: 'satisfied',
        options: []
      }
    },
    startingNode: 'start'
  };

  useEffect(() => {
    setCurrentNode(scenario.startingNode);
    return () => {
      // Cleanup timeouts on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleOptionSelect = (option: DialogueOption) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setShowOptions(false);

    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);

    // Add user's choice to history immediately
    setHistory(prev => [...prev, { speaker: 'you', text: option.text }]);
    scrollToBottom();

    // Show feedback immediately
    setLastFeedback(option.feedback);
    setShowFeedback(true);

    // Update metrics
    setMetrics(prev => ({
      rapport: Math.max(0, Math.min(100, prev.rapport + option.impact.rapport)),
      progress: Math.max(0, Math.min(100, prev.progress + option.impact.progress)),
      professionalism: Math.max(0, Math.min(100, prev.professionalism + option.impact.professionalism)),
    }));

    // After a delay, show the employee's response
    timeoutRef.current = setTimeout(() => {
      if (option.nextDialogue) {
        const nextNode = scenario.dialogueTree[option.nextDialogue];
        if (nextNode && nextNode.text) {
          setHistory(prev => [...prev, {
            speaker: nextNode.speaker,
            text: nextNode.text,
            emotion: nextNode.emotion
          }]);
          setCurrentNode(option.nextDialogue!);
          
          // Check if this is the final node
          if (nextNode.id === 'final') {
            setIsComplete(true);
          }
        }
      }
      scrollToBottom();

      // After another delay, hide feedback and show new options
      feedbackTimeoutRef.current = setTimeout(() => {
        setShowFeedback(false);
        setShowOptions(true);
        setIsTransitioning(false);
      }, 1500);
    }, 1000);
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'angry': return '😠';
      case 'concerned': return '😟';
      case 'satisfied': return '😊';
      case 'defensive': return '😤';
      default: return '😐';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeedbackStyle = (feedback: string) => {
    if (feedback.includes('Výborně')) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-400',
        text: 'text-green-700',
        icon: (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      };
    }
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: (
        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    };
  };

  // Get current dialogue safely
  const currentDialogue = scenario.dialogueTree[currentNode];
  if (!currentDialogue) return null;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F5F6F7] p-4">
        <div className="card max-w-4xl w-full mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zpět na procvičování
            </Link>
          </div>

          <div className="bg-[#18B48E]/10 p-6 rounded-xl mb-6">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🎯</div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-[#18B48E]">Rozhovor dokončen!</h2>
                <p className="text-gray-700">Podívejte se na výsledky vašeho hodnotícího rozhovoru.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${getMetricColor(metrics.rapport)} bg-opacity-10`}>
              <div className="font-bold mb-1">Vztah</div>
              <div className="text-3xl font-bold">{metrics.rapport}%</div>
              <p className="text-sm mt-2">Jak dobře jste budovali vztah se zaměstnancem</p>
            </div>
            <div className={`p-4 rounded-lg ${getMetricColor(metrics.progress)} bg-opacity-10`}>
              <div className="font-bold mb-1">Pokrok</div>
              <div className="text-3xl font-bold">{metrics.progress}%</div>
              <p className="text-sm mt-2">Jak efektivně jste řešili pracovní problémy</p>
            </div>
            <div className={`p-4 rounded-lg ${getMetricColor(metrics.professionalism)} bg-opacity-10`}>
              <div className="font-bold mb-1">Profesionalita</div>
              <div className="text-3xl font-bold">{metrics.professionalism}%</div>
              <p className="text-sm mt-2">Jak profesionálně jste vedli rozhovor</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Průběh rozhovoru</h3>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    entry.speaker === 'you' ? 'bg-[#18B48E] text-white' : 'bg-gray-100'
                  }`}>
                    {entry.speaker === 'you' ? '👤' : getEmotionIcon(entry.emotion)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">
                      {entry.speaker === 'you' ? 'Vy' : 'Zaměstnanec'}
                    </div>
                    <p className="text-gray-800">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <h4 className="font-bold text-blue-800 mb-2">Tipy pro příště:</h4>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Začněte rozhovor pozitivně a vytvořte bezpečné prostředí</li>
              <li>Aktivně naslouchejte a projevujte empatii</li>
              <li>Zaměřte se na konkrétní řešení a nabídněte podporu</li>
              <li>Udržujte profesionální přístup i v náročných situacích</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Link 
              to="/exercises" 
              className="px-6 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90 transition-colors"
            >
              Dokončit cvičení
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] p-4">
      <div className="card max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
        </div>

        <div className="bg-[#321C3D] text-white p-4 rounded-xl mb-4">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-xl font-bold">{scenario.title}</h1>
          </div>
          <p className="text-white/80">{scenario.context}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Vztah</div>
              <div className={`text-lg font-semibold ${getMetricColor(metrics.rapport)}`}>
                {metrics.rapport}%
              </div>
            </div>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Pokrok</div>
              <div className={`text-lg font-semibold ${getMetricColor(metrics.progress)}`}>
                {metrics.progress}%
              </div>
            </div>
          </div>
          <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Profesionalita</div>
              <div className={`text-lg font-semibold ${getMetricColor(metrics.professionalism)}`}>
                {metrics.professionalism}%
              </div>
            </div>
          </div>
        </div>

        <div ref={dialogueRef} className="bg-white rounded-lg p-4 mb-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${entry.speaker === 'you' ? 'justify-end' : ''}`}
            >
              <div
                className={`max-w-[80%] ${
                  entry.speaker === 'you'
                    ? 'bg-[#18B48E] text-white rounded-l-lg rounded-br-lg'
                    : 'bg-gray-100 rounded-r-lg rounded-bl-lg'
                } p-3`}
              >
                {entry.speaker === 'employee' && entry.emotion && (
                  <div className="text-2xl mb-2">{getEmotionIcon(entry.emotion)}</div>
                )}
                <p>{entry.text}</p>
              </div>
            </div>
          ))}
        </div>

        {showFeedback && lastFeedback && (() => {
          const style = getFeedbackStyle(lastFeedback);
          return (
            <div className={`${style.bg} border-l-4 ${style.border} p-4 mb-4 rounded-r-lg`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {style.icon}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${style.text}`}>{lastFeedback}</p>
                </div>
              </div>
            </div>
          );
        })()}

        <div ref={optionsRef}>
          {showOptions && currentDialogue.options && currentDialogue.options.length > 0 && (
            <div className="space-y-3">
              {currentDialogue.options.map((option, index) => (
                <button
                  key={option.id}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#18B48E] hover:shadow-md transition-all"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isTransitioning}
                >
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePlayScenario; 