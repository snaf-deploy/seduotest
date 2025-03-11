import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

interface Task {
  id: number;
  name: string;
  description: string;
  correctQuadrant: 1 | 2 | 3 | 4;
  icon: string;
}

const TimeManagement: React.FC = () => {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      name: "Odpovědět na urgentní email od klienta",
      description: "Klient potřebuje okamžitou odpověď na svůj dotaz ohledně projektu.",
      correctQuadrant: 1,
      icon: "📧"
    },
    {
      id: 2,
      name: "Připravit prezentaci pro vedení",
      description: "Prezentace pro vedení společnosti o stavu projektu, která je za týden.",
      correctQuadrant: 2,
      icon: "📊"
    },
    {
      id: 3,
      name: "Vyřešit technický problém v aplikaci",
      description: "Aplikace má kritickou chybu, která brání uživatelům v používání klíčové funkce.",
      correctQuadrant: 1,
      icon: "🛠️"
    },
    {
      id: 4,
      name: "Aktualizovat dokumentaci projektu",
      description: "Dokumentace projektu potřebuje aktualizaci, ale není to urgentní.",
      correctQuadrant: 2,
      icon: "📝"
    },
    {
      id: 5,
      name: "Odpovědět na rutinní emaily",
      description: "Běžná emailová komunikace, která nevyžaduje hluboké zamyšlení.",
      correctQuadrant: 3,
      icon: "📨"
    },
    {
      id: 6,
      name: "Účastnit se nepovinné schůzky",
      description: "Schůzka, která není přímo relevantní pro vaši práci.",
      correctQuadrant: 4,
      icon: "👥"
    },
    {
      id: 7,
      name: "Vytvořit strategii pro nový projekt",
      description: "Dlouhodobé plánování nového projektu, který začne za dva měsíce.",
      correctQuadrant: 2,
      icon: "🔍"
    },
    {
      id: 8,
      name: "Vyřešit konflikt v týmu",
      description: "Dva členové týmu mají spor, který ovlivňuje produktivitu celého týmu.",
      correctQuadrant: 1,
      icon: "🤝"
    },
    {
      id: 9,
      name: "Procházet sociální sítě",
      description: "Kontrola sociálních sítí a zpráv, které nesouvisí s prací.",
      correctQuadrant: 4,
      icon: "📱"
    },
    {
      id: 10,
      name: "Organizovat pracovní stůl",
      description: "Uspořádání dokumentů a věcí na pracovním stole.",
      correctQuadrant: 3,
      icon: "🗄️"
    }
  ]);

  const [assignments, setAssignments] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<{[key: number]: string}>({});
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Get the markExerciseCompleted function from context
  const { markExerciseCompleted } = useContext(UserProgressContext);

  const handleDragStart = (taskId: number) => {
    setDraggedTask(taskId);
  };

  const handleDrop = (quadrant: number) => {
    if (draggedTask === null) return;
    
    setAssignments({
      ...assignments,
      [draggedTask]: quadrant
    });
    
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const evaluateAssignments = () => {
    let correctAssignments = 0;
    let newFeedback: { [key: number]: string } = {};
    
    tasks.forEach(task => {
      const assignedQuadrant = assignments[task.id];
      if (assignedQuadrant === undefined) {
        newFeedback[task.id] = "Tento úkol nebyl zařazen.";
        return;
      }
      
      if (assignedQuadrant === task.correctQuadrant) {
        correctAssignments++;
        newFeedback[task.id] = "Správně! Tento úkol je správně zařazen.";
      } else {
        newFeedback[task.id] = `Tento úkol patří do kvadrantu ${getQuadrantName(task.correctQuadrant)}.`;
      }
    });
    
    const newScore = Math.round((correctAssignments / tasks.length) * 100);
    setCorrectAnswers(newScore);
    setFeedback(newFeedback);
    setShowResults(true);
    
    // If the user has completed the exercise successfully
    if (newScore >= 70) { // 70% correct
      // Mark the exercise as completed
      markExerciseCompleted('strategic-thinking');
      console.log('Time Management exercise completed with score:', newScore);
    }
  };

  const getQuadrantName = (quadrant: number) => {
    switch (quadrant) {
      case 1: return "Urgentní a důležité";
      case 2: return "Důležité, ale ne urgentní";
      case 3: return "Urgentní, ale ne důležité";
      case 4: return "Ani urgentní, ani důležité";
      default: return "";
    }
  };

  const getQuadrantDescription = (quadrant: number) => {
    switch (quadrant) {
      case 1: return "Krize, problémy s deadlinem, naléhavé problémy";
      case 2: return "Plánování, prevence, budování vztahů, osobní rozvoj";
      case 3: return "Vyrušení, některé hovory, některé emaily, některé schůzky";
      case 4: return "Triviální úkoly, některé emaily, časožrouti, příjemné aktivity";
      default: return "";
    }
  };

  const getQuadrantColor = (quadrant: number) => {
    switch (quadrant) {
      case 1: return "bg-red-100 border-red-300";
      case 2: return "bg-green-100 border-green-300";
      case 3: return "bg-yellow-100 border-yellow-300";
      case 4: return "bg-gray-100 border-gray-300";
      default: return "";
    }
  };

  const getQuadrantIcon = (quadrant: number) => {
    switch (quadrant) {
      case 1: return "🔥";
      case 2: return "🎯";
      case 3: return "⏱️";
      case 4: return "🗑️";
      default: return "";
    }
  };

  const getTasksForQuadrant = (quadrant: number) => {
    return Object.entries(assignments)
      .filter(([_, q]) => q === quadrant)
      .map(([taskId]) => tasks.find(t => t.id === parseInt(taskId)))
      .filter(Boolean) as Task[];
  };

  const getFeedbackColor = (taskId: number) => {
    const feedbackText = feedback[taskId] || '';
    if (feedbackText.includes('Správně')) return 'text-green-600';
    return 'text-red-600';
  };

  const resetExercise = () => {
    setAssignments({});
    setShowResults(false);
    setFeedback({});
    setCorrectAnswers(0);
    setDraggedTask(null);
  };

  const allTasksAssigned = tasks.every(task => assignments[task.id] !== undefined);

  const getPerformanceMessage = () => {
    const percentage = (correctAnswers / tasks.length) * 100;
    
    if (percentage >= 80) {
      return {
        title: "Výborně!",
        message: "Máte skvělé porozumění principům řízení času.",
        icon: "🏆"
      };
    } else if (percentage >= 50) {
      return {
        title: "Dobrá práce!",
        message: "Rozumíte základům řízení času, ale je zde prostor pro zlepšení.",
        icon: "👍"
      };
    } else {
      return {
        title: "Je třeba se zlepšit",
        message: "Je třeba více procvičovat! Podívejte se na zpětnou vazbu níže a zkuste to znovu.",
        icon: "📚"
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Matice řízení času</h3>
            <p className="mb-4">
              Eisenhowerova matice je nástroj pro efektivní řízení času. Rozděluje úkoly do čtyř kvadrantů podle jejich důležitosti a urgentnosti:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <div className="font-bold flex items-center">
                  <span className="mr-2">1. Urgentní a důležité</span>
                  <span>🔥</span>
                </div>
                <p className="text-sm">Krize, problémy s deadlinem</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="font-bold flex items-center">
                  <span className="mr-2">2. Důležité, ne urgentní</span>
                  <span>🎯</span>
                </div>
                <p className="text-sm">Plánování, osobní rozvoj</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <div className="font-bold flex items-center">
                  <span className="mr-2">3. Urgentní, ne důležité</span>
                  <span>⏱️</span>
                </div>
                <p className="text-sm">Vyrušení, některé hovory</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="font-bold flex items-center">
                  <span className="mr-2">4. Ani urgentní, ani důležité</span>
                  <span>🗑️</span>
                </div>
                <p className="text-sm">Časožrouti, triviální úkoly</p>
              </div>
            </div>
            <p className="mb-4">
              Přetáhněte úkoly do správných kvadrantů podle jejich důležitosti a urgentnosti.
            </p>
            <div className="flex justify-end">
              <button 
                className="btn-primary"
                onClick={() => setShowTutorial(false)}
              >
                Začít cvičení
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card max-w-6xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6 text-[#321C3D]">Řízení času - Eisenhowerova matice</h1>
        
        {!showResults ? (
          <>
            <div className="bg-[#f0f8ff] p-4 rounded-xl mb-6">
              <h2 className="text-lg font-medium mb-2">Instrukce:</h2>
              <p className="text-gray-700">
                Přetáhněte úkoly do správných kvadrantů podle jejich důležitosti a urgentnosti. Po zařazení všech úkolů klikněte na tlačítko "Vyhodnotit".
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <h2 className="text-xl font-medium mb-4">Úkoly k zařazení</h2>
                <div className="space-y-3">
                  {tasks.filter(task => assignments[task.id] === undefined).map(task => (
                    <div 
                      key={task.id}
                      className="p-4 bg-white border-2 border-gray-200 rounded-xl cursor-grab hover:shadow transition-all"
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{task.icon}</span>
                        <div>
                          <h3 className="font-medium text-[#321C3D]">{task.name}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium mb-4">Eisenhowerova matice</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(quadrant => (
                    <div 
                      key={quadrant}
                      className={`p-4 border-2 rounded-xl ${getQuadrantColor(quadrant)} min-h-[200px]`}
                      onDrop={() => handleDrop(quadrant)}
                      onDragOver={handleDragOver}
                    >
                      <div className="flex items-center mb-3">
                        <span className="text-xl mr-2">{getQuadrantIcon(quadrant)}</span>
                        <h3 className="font-medium">{getQuadrantName(quadrant)}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{getQuadrantDescription(quadrant)}</p>
                      
                      <div className="space-y-2">
                        {getTasksForQuadrant(quadrant).map(task => (
                          <div 
                            key={task.id}
                            className="p-3 bg-white border border-gray-200 rounded-lg flex items-center"
                          >
                            <span className="text-xl mr-2">{task.icon}</span>
                            <span>{task.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="btn-primary"
                onClick={evaluateAssignments}
                disabled={!allTasksAssigned}
              >
                {allTasksAssigned ? 'Vyhodnotit' : 'Nejprve zařaďte všechny úkoly'}
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="bg-[#18B48E]/10 p-6 rounded-xl mb-8">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{getPerformanceMessage().icon}</div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-[#18B48E]">{getPerformanceMessage().title}</h2>
                  <p className="text-gray-700">{getPerformanceMessage().message}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Detailní zpětná vazba:</h3>
            
            <div className="space-y-4 mb-8">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-white border-2 border-gray-100 p-4 rounded-xl"
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{task.icon}</span>
                    <div>
                      <h4 className="font-bold">{task.name}</h4>
                      <div className="mt-2">
                        <span className="font-medium">Vaše zařazení: </span>
                        {assignments[task.id] ? getQuadrantName(assignments[task.id]) : 'Nezařazeno'}
                      </div>
                      <div className="mt-2">
                        <span className="font-medium">Zpětná vazba: </span>
                        <span className={getFeedbackColor(task.id)}>{feedback[task.id]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
              <h4 className="font-bold text-blue-800 mb-2">Tipy pro efektivní řízení času:</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Zaměřte se na úkoly v kvadrantu 2 (důležité, ale ne urgentní) - to je klíč k produktivitě</li>
                <li>Minimalizujte čas strávený v kvadrantu 4 (ani důležité, ani urgentní)</li>
                <li>Delegujte úkoly z kvadrantu 3 (urgentní, ale ne důležité), pokud je to možné</li>
                <li>Řešte úkoly z kvadrantu 1 (urgentní a důležité) co nejdříve</li>
                <li>Pravidelně plánujte svůj čas a stanovte si priority</li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn-primary bg-white text-[#18B48E] border border-[#18B48E] hover:bg-[#18B48E]/5"
                onClick={resetExercise}
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

export default TimeManagement; 