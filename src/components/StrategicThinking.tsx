import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DroppableStateSnapshot, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface Initiative {
  id: string;
  title: string;
  description: string;
  impact: number;
  effort: number;
  correctQuadrant: 'quick-wins' | 'major-projects' | 'thankless-tasks' | 'fill-ins';
}

interface Quadrant {
  id: 'quick-wins' | 'major-projects' | 'thankless-tasks' | 'fill-ins';
  title: string;
  description: string;
}

const initiatives: Initiative[] = [
  {
    id: 'initiative-1',
    title: 'Implementace automatizovaného testování',
    description: 'Zavedení automatických testů pro klíčové části systému',
    impact: 8,
    effort: 7,
    correctQuadrant: 'major-projects'
  },
  {
    id: 'initiative-2',
    title: 'Aktualizace dokumentace',
    description: 'Revize a aktualizace technické dokumentace',
    impact: 3,
    effort: 4,
    correctQuadrant: 'fill-ins'
  },
  {
    id: 'initiative-3',
    title: 'Optimalizace výkonu databáze',
    description: 'Zrychlení dotazů a indexace databáze',
    impact: 9,
    effort: 3,
    correctQuadrant: 'quick-wins'
  },
  {
    id: 'initiative-4',
    title: 'Refaktoring legacy kódu',
    description: 'Přepsání zastaralých částí systému',
    impact: 6,
    effort: 9,
    correctQuadrant: 'major-projects'
  },
  {
    id: 'initiative-5',
    title: 'Code review proces',
    description: 'Zavedení systematického procesu review kódu',
    impact: 7,
    effort: 2,
    correctQuadrant: 'quick-wins'
  },
  {
    id: 'initiative-6',
    title: 'Aktualizace NPM balíčků',
    description: 'Update zastaralých závislostí',
    impact: 4,
    effort: 2,
    correctQuadrant: 'fill-ins'
  },
  {
    id: 'initiative-7',
    title: 'Migrace na novou verzi frameworku',
    description: 'Upgrade na nejnovější major verzi',
    impact: 8,
    effort: 8,
    correctQuadrant: 'major-projects'
  },
  {
    id: 'initiative-8',
    title: 'Čištění technického dluhu',
    description: 'Odstranění zastaralých funkcí a kódu',
    impact: 3,
    effort: 6,
    correctQuadrant: 'thankless-tasks'
  }
];

const quadrants: Quadrant[] = [
  {
    id: 'quick-wins',
    title: 'Quick Wins',
    description: 'Vysoký dopad, nízké úsilí'
  },
  {
    id: 'major-projects',
    title: 'Major Projects',
    description: 'Vysoký dopad, vysoké úsilí'
  },
  {
    id: 'thankless-tasks',
    title: 'Thankless Tasks',
    description: 'Nízký dopad, vysoké úsilí'
  },
  {
    id: 'fill-ins',
    title: 'Fill-Ins',
    description: 'Nízký dopad, nízké úsilí'
  }
];

interface ResultSummary {
  initiative: Initiative;
  isCorrect: boolean;
  placedIn: string;
  shouldBeIn: string;
}

const StrategicThinking: React.FC = () => {
  const { markExerciseCompleted } = useContext(UserProgressContext);
  const [initiativesByQuadrant, setInitiativesByQuadrant] = useState<{[key: string]: Initiative[]}>({
    'quick-wins': [],
    'major-projects': [],
    'thankless-tasks': [],
    'fill-ins': [],
    'unassigned': [...initiatives]
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<ResultSummary[]>([]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const initiative = initiatives.find(i => i.id === draggableId);
    if (!initiative) return;

    const sourceQuadrant = [...(initiativesByQuadrant[source.droppableId] || [])];
    const destQuadrant = [...(initiativesByQuadrant[destination.droppableId] || [])];

    // Remove from source
    sourceQuadrant.splice(source.index, 1);

    // Add to destination
    destQuadrant.splice(destination.index, 0, initiative);

    setInitiativesByQuadrant({
      ...initiativesByQuadrant,
      [source.droppableId]: sourceQuadrant,
      [destination.droppableId]: destQuadrant
    });
  };

  const getQuadrantTitle = (id: string): string => {
    return quadrants.find(q => q.id === id)?.title || id;
  };

  const checkAnswers = () => {
    let correctCount = 0;
    let total = 0;
    const newResults: ResultSummary[] = [];

    Object.entries(initiativesByQuadrant).forEach(([quadrantId, quadrantInitiatives]) => {
      if (quadrantId !== 'unassigned') {
        quadrantInitiatives.forEach(initiative => {
          total++;
          const isCorrect = initiative.correctQuadrant === quadrantId;
          if (isCorrect) correctCount++;
          
          newResults.push({
            initiative,
            isCorrect,
            placedIn: quadrantId,
            shouldBeIn: initiative.correctQuadrant
          });
        });
      }
    });

    const newScore = Math.round((correctCount / total) * 100);
    setScore(newScore);
    setResults(newResults);
    setIsComplete(true);
    
    if (newScore >= 75) {
      markExerciseCompleted('strategic-thinking');
    }
  };

  const resetExercise = () => {
    setInitiativesByQuadrant({
      'quick-wins': [],
      'major-projects': [],
      'thankless-tasks': [],
      'fill-ins': [],
      'unassigned': [...initiatives]
    });
    setShowFeedback(false);
    setScore(0);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .quadrant {
        background: white;
        border-radius: 0.75rem;
        padding: 1rem;
        min-height: 200px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .initiative-card {
        background: white;
        border: 2px solid #E5E7EB;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 0.5rem;
        cursor: grab;
        transition: all 0.2s;
      }

      .initiative-card:hover {
        border-color: #18B48E;
        background-color: #F3FAFA;
      }

      .initiative-card.dragging {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
        <div className="card max-w-4xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#321C3D] mb-4">
              Výsledky vašeho pokusu! 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Dosáhli jste skóre {score}%
            </p>
            {score >= 75 && (
              <div className="mt-2 text-[#18B48E] font-medium">
                Skvělá práce! Cvičení bylo označeno jako dokončené.
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="font-bold text-lg mb-4">Shrnutí vašich odpovědí</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={result.initiative.id}
                  className={`p-4 rounded-lg border ${
                    result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mt-1 mr-3 ${
                      result.isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {result.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{result.initiative.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{result.initiative.description}</p>
                      {!result.isCorrect && (
                        <p className="text-sm text-red-600 mt-2">
                          Umístěno v: {getQuadrantTitle(result.placedIn)}<br />
                          Správně patří do: {getQuadrantTitle(result.shouldBeIn)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={resetExercise}
              className="px-6 py-2 border-2 border-[#18B48E] text-[#18B48E] rounded-lg hover:bg-[#18B48E]/5"
            >
              Zkusit znovu
            </button>
            <Link
              to="/exercises"
              className="px-6 py-2 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90"
            >
              Zpět na přehled
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#321C3D] mb-4">Strategické myšlení</h1>
          <div className="bg-[#321C3D] text-white p-6 rounded-xl mb-6">
            <p className="text-lg">
              Vaším úkolem je roztřídit technické iniciativy do správných kvadrantů podle jejich dopadu a náročnosti.
              Použijte metodu prioritizace založenou na Impact/Effort matici.
            </p>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {quadrants.map(quadrant => (
                  <div key={quadrant.id} className="quadrant">
                    <h3 className="font-bold text-lg mb-2">{quadrant.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{quadrant.description}</p>
                    <Droppable droppableId={quadrant.id}>
                      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[200px] rounded-lg p-2 ${
                            snapshot.isDraggingOver ? 'bg-gray-50' : ''
                          }`}
                        >
                          {initiativesByQuadrant[quadrant.id]?.map((initiative, index) => (
                            <Draggable
                              key={initiative.id}
                              draggableId={initiative.id}
                              index={index}
                            >
                              {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`initiative-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                >
                                  <h4 className="font-medium mb-1">{initiative.title}</h4>
                                  <p className="text-sm text-gray-600">{initiative.description}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Dostupné iniciativy</h3>
              <Droppable droppableId="unassigned">
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] rounded-lg p-2 ${
                      snapshot.isDraggingOver ? 'bg-gray-50' : ''
                    }`}
                  >
                    {initiativesByQuadrant.unassigned?.map((initiative, index) => (
                      <Draggable
                        key={initiative.id}
                        draggableId={initiative.id}
                        index={index}
                      >
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`initiative-card ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <h4 className="font-medium mb-1">{initiative.title}</h4>
                            <p className="text-sm text-gray-600">{initiative.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={checkAnswers}
                  className="flex-1 px-6 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90"
                >
                  Zkontrolovat
                </button>
                <button
                  onClick={resetExercise}
                  className="px-6 py-3 border-2 border-[#18B48E] text-[#18B48E] rounded-lg hover:bg-[#18B48E]/5"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default StrategicThinking; 