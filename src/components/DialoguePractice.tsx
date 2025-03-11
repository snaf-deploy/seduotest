import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Scenario, DialogueMessage, Choice } from '../types/practice';
import { scenarios } from '../data/scenarios';

interface MessageBubbleProps {
  message: DialogueMessage;
  isVisible: boolean;
  delay: number;
}

const getEmotionAvatar = (emotion: string | undefined, isUser: boolean) => {
  // Using Microsoft Fluent 3D Emojis
  const baseUrl = "https://em-content.zobj.net/source/microsoft-teams/363";
  
  switch (emotion) {
    case 'stressed':
      return (
        <img 
          src={`${baseUrl}/anxious-face-with-sweat_1f630.png`} 
          alt="stressed"
          className="w-8 h-8"
        />
      );
    case 'frustrated':
      return (
        <img 
          src={`${baseUrl}/confounded-face_1f616.png`} 
          alt="frustrated"
          className="w-8 h-8"
        />
      );
    case 'determined':
      return (
        <img 
          src={`${baseUrl}/face-with-steam-from-nose_1f624.png`} 
          alt="determined"
          className="w-8 h-8"
        />
      );
    case 'neutral':
      return (
        <img 
          src={`${baseUrl}/neutral-face_1f610.png`} 
          alt="neutral"
          className="w-8 h-8"
        />
      );
    default:
      return (
        <img 
          src={`${baseUrl}/slightly-smiling-face_1f642.png`} 
          alt="default"
          className="w-8 h-8"
        />
      );
  }
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isVisible, delay }) => {
  const isUser = message.speaker === 'user';
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return (
    <div 
      className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'} mb-3 transition-all duration-500 ease-in-out`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {!isUser && (
        <div className={`avatar-bubble other mr-3 mb-1`}>
          {getEmotionAvatar(message.emotion, false)}
        </div>
      )}
      <div className={`message-bubble max-w-[80%] ${isUser ? 'user rounded-br-none' : 'other rounded-bl-none'}`}>
        {message.text}
      </div>
      {isUser && (
        <div className={`avatar-bubble user ml-3 mb-1`}>
          {getEmotionAvatar(message.emotion, true)}
        </div>
      )}
    </div>
  );
};

interface CountdownBarProps {
  duration: number;
  onComplete: () => void;
}

const CountdownBar: React.FC<CountdownBarProps> = ({ duration, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-4">
      <div 
        className="h-full bg-[#18B48E] rounded-full transition-all duration-300"
        style={{ 
          animation: `shrink ${duration}ms linear forwards`
        }}
      />
    </div>
  );
};

interface ChoiceButtonProps {
  choice: Choice;
  isSelected: boolean;
  showFeedback: boolean;
  onClick: () => void;
  isVisible: boolean;
  index: number;
  onContinue: () => void;
  onCorrectAnswer: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  isSelected,
  showFeedback,
  onClick,
  isVisible,
  index,
  onContinue,
  onCorrectAnswer
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const choiceRef = React.useRef<HTMLDivElement>(null);

  // Scroll into view when feedback is shown
  useEffect(() => {
    if (showFeedback && isSelected && choiceRef.current) {
      setTimeout(() => {
        choiceRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }
  }, [showFeedback, isSelected]);

  return (
    <div className="mb-2" ref={choiceRef}>
      <div
        className={`practice-option transform transition-all duration-300 ease-in-out flex items-center gap-3 ${
          !isVisible ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        } ${isSelected ? 'selected' : ''} ${
          showFeedback && isSelected
            ? choice.isCorrect
              ? 'border-[#18B48E] bg-[#18B48E]/5'
              : 'border-red-500 bg-red-50'
            : ''
        }`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`choice-number ${isHovered ? 'animate-bounce-slow' : ''}`}>
          {index + 1}
        </div>
        <p className="text-lg flex-1">{choice.text}</p>
      </div>
      
      {showFeedback && isSelected && (
        <div className={`feedback-box mt-2 ${choice.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="flex items-start gap-4">
            <img 
              src={`https://em-content.zobj.net/source/microsoft-teams/363/${
                choice.isCorrect ? 'sparkles_2728' : 'pensive-face_1f614'
              }.png`}
              alt={choice.isCorrect ? 'sparkles' : 'pensive'}
              className="w-8 h-8 animate-bounce-slow"
            />
            <div className="flex-1">
              <p className={`text-lg font-semibold mb-2 ${
                choice.isCorrect ? 'text-[#18B48E]' : 'text-red-600'
              }`}>
                {choice.isCorrect ? 'Správně!' : 'Tohle není nejlepší volba.'}
              </p>
              <p className="text-gray-700 leading-relaxed">{choice.feedback}</p>
              {choice.isCorrect ? (
                <>
                  <CountdownBar 
                    duration={3000} 
                    onComplete={onCorrectAnswer} 
                  />
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Pokračování za chvíli...
                  </p>
                </>
              ) : (
                <div className="mt-4 flex justify-end">
                  <button
                    className="btn-primary hover:scale-105 animate-scale-in"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContinue();
                    }}
                  >
                    Zkusit znovu
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DialoguePractice: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [allMessages, setAllMessages] = useState<DialogueMessage[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [nextMessages, setNextMessages] = useState<DialogueMessage[]>([]);
  const [showScenarioComplete, setShowScenarioComplete] = useState(false);
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    completedScenarios: [] as string[],
  });

  const optionsRef = useRef<HTMLDivElement>(null);
  const currentStep = currentScenario?.steps[currentScenario.currentStepIndex];

  // Add keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize scenario
  useEffect(() => {
    if (!currentScenario) {
      const uncompletedScenarios = scenarios.filter(
        (scenario) => !progress.completedScenarios.includes(scenario.id)
      );
      if (uncompletedScenarios.length > 0) {
        const newScenario = {
          ...uncompletedScenarios[0],
          currentStepIndex: 0,
        };
        setCurrentScenario(newScenario);
        setAllMessages(newScenario.steps[0].messages);
        setVisibleMessages(0);
        setShowAnswers(false);
      }
    }
  }, [currentScenario, progress.completedScenarios]);

  // Handle message visibility
  useEffect(() => {
    if (allMessages.length > 0 && !showFeedback) {
      const messageDelay = 1000;

      if (visibleMessages < allMessages.length) {
        const timer = setTimeout(() => {
          setVisibleMessages(prev => prev + 1);
          
          // If this is the last message and it's from the employee, show answers after a delay
          if (visibleMessages + 1 === allMessages.length && 
              allMessages[visibleMessages]?.speaker === 'other') {
            setTimeout(() => {
              setShowAnswers(true);
            }, 1000);
          }
        }, messageDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [visibleMessages, allMessages, showFeedback]);

  // Scroll to top when component mounts and when starting a new scenario
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScenario?.id]); // This will trigger when switching scenarios or when component mounts

  // Add new useEffect for scrolling to options when they appear
  useEffect(() => {
    if (showAnswers && optionsRef.current) {
      setTimeout(() => {
        optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [showAnswers]);

  const handleTryAgain = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (showFeedback) return;
    
    const selectedChoiceData = currentStep?.choices?.find(
      (choice) => choice.id === choiceId
    );

    if (!selectedChoiceData) return;

    setSelectedChoice(choiceId);
    setShowFeedback(true);

    if (selectedChoiceData.isCorrect) {
      const newMessage: DialogueMessage = {
        id: `answer-${choiceId}`,
        speaker: 'user',
        text: selectedChoiceData.text,
        emotion: 'neutral'
      };
      
      // Get next messages if available
      if (currentScenario && currentScenario.currentStepIndex < currentScenario.steps.length - 1) {
        const nextStepMessages = currentScenario.steps[currentScenario.currentStepIndex + 1].messages;
        setNextMessages(nextStepMessages);
      }

      // Add user's message and make it visible immediately
      setAllMessages(prev => [...prev, newMessage]);
      setVisibleMessages(prev => prev + 1);

      setProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
      }));
    }

    // Scroll to show feedback
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleContinue = () => {
    if (!currentScenario) return;
    
    if (currentScenario.currentStepIndex < currentScenario.steps.length - 1) {
      const nextIndex = currentScenario.currentStepIndex + 1;
      
      // First hide answers with animation
      setShowAnswers(false);
      
      // Wait for fade out animation, then update
      setTimeout(() => {
        // Update scenario index and reset UI state
        setCurrentScenario(prev => ({
          ...prev!,
          currentStepIndex: nextIndex,
        }));
        setSelectedChoice(null);
        setShowFeedback(false);
        
        // Get the next step's messages
        const nextStepMessages = currentScenario.steps[nextIndex].messages;
        
        // Keep track of current messages and their visibility
        const currentMessageCount = allMessages.length;
        
        // Combine current messages with next messages
        setAllMessages(prev => [...prev, ...nextStepMessages]);
        
        // Start showing new messages one by one, starting after the current messages
        nextStepMessages.forEach((_, index) => {
          setTimeout(() => {
            setVisibleMessages(currentMessageCount + index + 1);
            
            // Show answers after the last message if it's from the employee
            if (index === nextStepMessages.length - 1 && 
                nextStepMessages[index].speaker === 'other') {
              setTimeout(() => {
                setShowAnswers(true);
              }, 800);
            }
          }, (index + 1) * 1000); // 1 second delay between messages
        });
        
      }, 300);
    } else {
      // Scenario complete
      setProgress(prev => ({
        ...prev,
        completedScenarios: [...prev.completedScenarios, currentScenario.id],
      }));
      setShowScenarioComplete(true);
      setShowAnswers(false);
      setShowFeedback(false);
    }
  };

  const handleNextScenario = () => {
    setShowScenarioComplete(false);
    setCurrentScenario(null);
    setAllMessages([]);
    setVisibleMessages(0);
    setShowAnswers(false);
  };

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!showFeedback && currentStep?.choices && visibleMessages >= allMessages.length) {
        const key = event.key;
        const number = parseInt(key);
        
        if (!isNaN(number) && number > 0 && number <= currentStep.choices.length) {
          const choice = currentStep.choices[number - 1];
          handleChoiceSelect(choice.id);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showFeedback, currentStep, visibleMessages, allMessages.length]);

  if (!currentScenario || !currentStep) {
    if (progress.completedScenarios.length === scenarios.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#18B48E]/5 to-light p-6">
          <div className="card max-w-2xl w-full text-center transform transition-all hover:scale-105">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4 text-[#18B48E]">Gratulujeme!</h2>
            <p className="mb-6 text-lg">
              Úspěšně jste dokončili všechny scénáře.
            </p>
            <Link 
              to="/exercises" 
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Zpět na procvičování
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#18B48E]/5 to-light">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#18B48E]"></div>
      </div>
    );
  }

  if (showScenarioComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
        <div className="card max-w-2xl w-full text-center">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-4 text-[#18B48E]">Výborně!</h2>
          <p className="text-xl mb-8">
            Úspěšně jste dokončili scénář "{currentScenario.title}"
          </p>
          <Link 
            to="/exercises" 
            className="px-8 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90 transition-colors inline-block"
          >
            Zpět na přehled
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
      <div className="card max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Link to="/exercises" className="text-[#3A1E5B] hover:text-[#18B48E] transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zpět na procvičování
          </Link>
        </div>
        
        {currentScenario && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-bold text-[#18B48E]">
                {currentScenario.title}
              </h3>
            </div>
            <p className="text-gray-600 text-xl leading-relaxed">{currentScenario.context}</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {allMessages.map((message, index) => (
            <MessageBubble
              key={`${message.id}-${index}`}
              message={message}
              isVisible={index < visibleMessages}
              delay={300}
            />
          ))}
        </div>

        {currentStep?.description && (
          <div className="bg-[#18B48E]/5 p-4 rounded-2xl mb-6 transform transition-all duration-500 ease-in-out border-2 border-[#18B48E]/20 shadow-lg">
            <p className="text-gray-700 text-lg">{currentStep.description}</p>
          </div>
        )}

        {showAnswers && (
          <div 
            ref={optionsRef}
            className="transform transition-opacity duration-300 ease-in-out opacity-0 animate-fade-in"
            style={{
              animation: 'fadeIn 0.3s ease-out forwards',
            }}
          >
            {currentStep?.prompt && (
              <div className="transform transition-all duration-300 ease-in-out">
                <p className="font-semibold text-xl mb-4 text-center text-[#18B48E]">{currentStep.prompt}</p>
              </div>
            )}

            <div className="space-y-2">
              {currentStep?.choices?.map((choice, index) => (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  isSelected={selectedChoice === choice.id}
                  showFeedback={showFeedback}
                  onClick={() => handleChoiceSelect(choice.id)}
                  isVisible={true}
                  index={index}
                  onContinue={handleTryAgain}
                  onCorrectAnswer={handleContinue}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialoguePractice; 