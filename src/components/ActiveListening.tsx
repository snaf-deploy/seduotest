import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

interface FlashCard {
  id: string;
  type: 'situation' | 'response' | 'technique';
  title: string;
  content: string;
  mana: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image?: string;
  pairedCardId?: string;
}

const ActiveListening: React.FC = () => {
  const [handCards, setHandCards] = useState<FlashCard[]>([]);
  const [boardCards, setBoardCards] = useState<FlashCard[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [draggedCard, setDraggedCard] = useState<FlashCard | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [matchesCompleted, setMatchesCompleted] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const { markExerciseCompleted } = useContext(UserProgressContext);

  // Initialize game with level-appropriate cards
  useEffect(() => {
    initializeGame(level);
  }, [level]);

  // Check for level completion
  useEffect(() => {
    if (!isInitialized) return;

    const requiredMatches = 3; // 3 matches per level
    
    if (matchesCompleted === requiredMatches) {
      if (level < 3) {
        // Progress to next level
        setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setMatchesCompleted(0);
          setShowFeedback(true);
          setIsSuccess(true);
          setFeedbackMessage(`Skvělé! Postupujete do úrovně ${nextLevel}`);
          initializeGame(nextLevel); // Initialize next level immediately
        }, 1000);
      } else {
        // Game complete - show summary
        setIsGameComplete(true);
        markExerciseCompleted('active-listening');
      }
    }
  }, [matchesCompleted, level, isInitialized]);

  const getLevelCards = (level: number): FlashCard[] => {
    const cards: FlashCard[] = [
      // Level 1 cards
      {
        id: 'sit1',
        type: 'situation',
        title: 'Nervózní prezentace',
        content: 'Kolega vypadá nervózně před důležitou prezentací pro klienta.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'resp1'
      },
      {
        id: 'resp1',
        type: 'response',
        title: 'Empatické naslouchání',
        content: 'Vidím, že jsi z té prezentace nervózní. Chceš si o tom promluvit?',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit1'
      },
      {
        id: 'resp1x',
        type: 'response',
        title: 'Praktická podpora',
        content: 'Pojď si tu prezentaci teď rychle projít, ať víš, že ji máš perfektně připravenou.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit1'
      },
      {
        id: 'sit2',
        type: 'situation',
        title: 'Pracovní stres',
        content: 'Člen týmu působí přepracovaně a má problémy s dodržováním termínů.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'resp2'
      },
      {
        id: 'resp2',
        type: 'response',
        title: 'Otevřený dialog',
        content: 'Všiml jsem si, že poslední dobou působíš přetíženě. Můžeme si o tom promluvit?',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit2'
      },
      {
        id: 'resp2x',
        type: 'response',
        title: 'Řešení problému',
        content: 'Projděme si tvé úkoly a udělejme nový časový plán s reálnějšími termíny.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit2'
      },
      {
        id: 'sit3',
        type: 'situation',
        title: 'Týmový konflikt',
        content: 'Dva kolegové mají napjatý vztah kvůli rozdílným přístupům k práci.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'resp3'
      },
      {
        id: 'resp3',
        type: 'response',
        title: 'Aktivní mediace',
        content: 'Vnímám mezi vámi určité napětí. Pojďme si společně sednout a probrat, co vás trápí.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit3'
      },
      {
        id: 'resp3x',
        type: 'response',
        title: 'Profesionální přístup',
        content: 'V práci musíme umět spolupracovat bez ohledu na osobní preference. Zkuste se soustředit na výsledky.',
        mana: 3,
        rarity: 'common',
        pairedCardId: 'sit3'
      },
      // Level 2 cards
      {
        id: 'sit4',
        type: 'situation',
        title: 'Osobní krize',
        content: 'Kolega se svěřuje s osobními problémy, které ovlivňují jeho práci.',
        mana: 4,
        rarity: 'uncommon',
        pairedCardId: 'resp4'
      },
      {
        id: 'resp4',
        type: 'response',
        title: 'Empatické naslouchání',
        content: 'To musí být pro tebe těžké. Jsem tu, abych tě vyslechl a pomohl ti najít řešení.',
        mana: 4,
        rarity: 'uncommon',
        pairedCardId: 'sit4'
      },
      {
        id: 'resp4x',
        type: 'response',
        title: 'Profesionální hranice',
        content: 'Chápu tvou situaci. Můžeme se podívat na možnosti, jak ti pomoci skrz firemní podporu.',
        mana: 4,
        rarity: 'uncommon',
        pairedCardId: 'sit4'
      },
      // Level 3 cards
      {
        id: 'sit7',
        type: 'situation',
        title: 'Vyhoření v týmu',
        content: 'Senior vývojář projevuje známky vyhoření a uvažuje o odchodu.',
        mana: 5,
        rarity: 'rare',
        pairedCardId: 'resp7'
      },
      {
        id: 'resp7',
        type: 'response',
        title: 'Hluboká empatie',
        content: 'Vážím si tvé upřímnosti. Pojďme společně prozkoumat, co tě k tomuto rozhodnutí vede.',
        mana: 5,
        rarity: 'rare',
        pairedCardId: 'sit7'
      },
      {
        id: 'resp7x',
        type: 'response',
        title: 'Konstruktivní dialog',
        content: 'Tvá práce je pro tým velmi cenná. Rád bych pochopil, co můžeme změnit, aby ses cítil lépe.',
        mana: 5,
        rarity: 'rare',
        pairedCardId: 'sit7'
      }
    ];

    // Return level-appropriate cards
    switch (level) {
      case 1:
        return cards.filter(card => 
          ['sit1', 'resp1', 'resp1x', 'sit2', 'resp2', 'resp2x', 'sit3', 'resp3', 'resp3x'].includes(card.id)
        );
      case 2:
        return cards.filter(card => 
          ['sit4', 'resp4', 'resp4x', 'sit5', 'resp5', 'resp5x', 'sit6', 'resp6', 'resp6x'].includes(card.id)
        );
      case 3:
        return cards.filter(card => 
          ['sit7', 'resp7', 'resp7x', 'sit8', 'resp8', 'resp8x', 'sit9', 'resp9', 'resp9x'].includes(card.id)
        );
      default:
        return [];
    }
  };

  const initializeGame = (level: number) => {
    const cards = getLevelCards(level);
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    
    // Split cards into hand and board
    const initialHand = shuffledCards.filter(card => card.type === 'response');
    const initialBoard = shuffledCards.filter(card => card.type === 'situation');
    
    setHandCards(initialHand);
    setBoardCards(initialBoard);
    setMatchesCompleted(0);
    setIsInitialized(true);
  };

  const handleDragStart = (e: React.DragEvent, card: FlashCard) => {
    setDraggedCard(card);
    e.dataTransfer.setData('text/plain', card.id);
    const element = e.currentTarget as HTMLElement;
    element.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('dragging');
    setDraggedCard(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, targetCard?: FlashCard) => {
    e.preventDefault();
    const dropZone = e.currentTarget as HTMLElement;
    dropZone.classList.remove('drag-over');

    if (!draggedCard || !targetCard) return;

    const cardElement = document.getElementById(draggedCard.id);
    
    // Check if the dragged response matches this specific situation
    if (draggedCard.pairedCardId === targetCard.id) {
      if (cardElement) {
        cardElement.classList.add('animate-pop-success');
        setTimeout(() => {
          setHandCards(prev => prev.filter(card => card.id !== draggedCard.id));
          setBoardCards(prev => prev.filter(card => card.id !== targetCard.id));
        }, 300);
      }
      setScore(prev => prev + draggedCard.mana);
      showSuccessFeedback();
    } else {
      if (cardElement) {
        cardElement.classList.add('animate-shake');
        setTimeout(() => {
          cardElement.classList.remove('animate-shake');
        }, 500);
      }
      showErrorFeedback();
    }
  };

  const showSuccessFeedback = () => {
    setShowFeedback(true);
    setIsSuccess(true);
    setFeedbackMessage('Skvělá odpověď! Správně jste spárovali karty.');
    setMatchesCompleted(prev => prev + 1);
    setScore(prev => prev + 10);
    
    // Check if this was the last match for the current level
    setTimeout(() => {
      if (boardCards.length <= 1) { // Since we haven't removed the current card yet
        if (level === 3) {
          setIsGameComplete(true);
          markExerciseCompleted('active-listening');
        } else {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setMatchesCompleted(0);
          setShowFeedback(true);
          setIsSuccess(true);
          setFeedbackMessage(`Skvělé! Postupujete do úrovně ${nextLevel}`);
          initializeGame(nextLevel);
        }
      }
    }, 500);
  };

  const showErrorFeedback = () => {
    setIsSuccess(false);
    setFeedbackMessage('Zkus najít vhodnější odpověď na tuto situaci.');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setMatchesCompleted(0);
    setShowFeedback(false);
    setIsSuccess(false);
    setFeedbackMessage('');
    setIsGameComplete(false);
    setIsInitialized(false);
    initializeGame(1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-8">
          <Link to="/exercises" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět
          </Link>
          <div className="flex items-center space-x-6">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-500">Skóre:</span>
              <span className="ml-2 text-lg font-semibold text-blue-600">{score}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-500">Úroveň:</span>
              <span className="ml-2 text-lg font-semibold text-blue-600">{level}/3</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Aktivní naslouchání</h1>

        {!isGameComplete ? (
          <>
            {/* Game board - Situations */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">💭</span>
                Situace
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {boardCards.map(card => (
                  <div 
                    key={card.id}
                    id={card.id}
                    className={`relative p-5 rounded-xl transition-all duration-200
                      ${draggedCard ? 'border-2 border-dashed border-blue-400 bg-blue-50/30' : 'border-2 border-gray-100'}
                      hover:shadow-md group`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, card)}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{card.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{card.content}</p>
                    </div>
                    {draggedCard && (
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 to-blue-50/70 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="transform -translate-y-2 transition-transform group-hover:translate-y-0">
                          <div className="flex items-center space-x-2 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="font-medium">Přiřadit odpověď</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Player's hand */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-lg">💬</span>
                Možné reakce
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {handCards.map(card => (
                  <div 
                    key={card.id}
                    id={card.id}
                    className="p-5 border-2 border-gray-100 rounded-xl cursor-grab hover:shadow-md hover:border-blue-100 transition-all transform hover:-translate-y-1"
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{card.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{card.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200 max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Gratulujeme!</h2>
            <div className="space-y-4 mb-8">
              <p className="text-gray-600">Dokončili jste všechny úrovně aktivního naslouchání!</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">Celkové skóre: {score} bodů</p>
              </div>
              <div className="text-gray-600">
                <p className="font-medium mb-2">Naučili jste se:</p>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Empaticky naslouchat kolegům v různých situacích
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Volit vhodné reakce podle kontextu
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Balancovat mezi empatií a praktickým řešením
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={resetGame}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium"
              >
                Hrát znovu
              </button>
              <Link 
                to="/exercises" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Dokončit
              </Link>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {showFeedback && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            isSuccess ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          } border ${isSuccess ? 'border-green-200' : 'border-yellow-200'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{isSuccess ? '✨' : '💡'}</span>
              <span className="font-medium">{feedbackMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveListening; 