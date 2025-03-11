import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';
import { scenarios } from '../data/scenarios';

interface MessageBubbleProps {
  message: {
    speaker: 'user' | 'other';
    text: string;
    emotion?: string;
  };
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
    case 'hopeful':
      return (
        <img 
          src={`${baseUrl}/slightly-smiling-face_1f642.png`} 
          alt="hopeful"
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
      className={`flex items-end ${message.speaker === 'user' ? 'justify-end' : 'justify-start'} mb-3 transition-all duration-500 ease-in-out`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {message.speaker !== 'user' && (
        <div className={`avatar-bubble other mr-3 mb-1`}>
          {getEmotionAvatar(message.emotion, false)}
        </div>
      )}
      <div className={`message-bubble max-w-[80%] ${message.speaker === 'user' ? 'user rounded-br-none' : 'other rounded-bl-none'}`}>
        {message.text}
      </div>
      {message.speaker === 'user' && (
        <div className={`avatar-bubble user ml-3 mb-1`}>
          {getEmotionAvatar(message.emotion, true)}
        </div>
      )}
    </div>
  );
};

interface ChoiceButtonProps {
  choice: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  };
  isSelected: boolean;
  showFeedback: boolean;
  onClick: () => void;
  isVisible: boolean;
  index: number;
  onContinue: () => void;
  onCorrectAnswer: () => void;
}

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

const ConflictResolution: React.FC = () => {
  // We use the third scenario (index 2) for conflict resolution
  const scenario = scenarios[2];
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [nextMessages, setNextMessages] = useState<any[]>([]);
  const [progress, setProgress] = useState({
    correctAnswers: 0,
    completedScenarios: [] as string[]
  });

  const { markExerciseCompleted } = useContext(UserProgressContext);
  const optionsRef = useRef<HTMLDivElement>(null);

  const currentStepData = scenario.steps[currentStep];

  // Initialize messages on component mount
  useEffect(() => {
    setAllMessages(scenario.steps[0].messages);
  }, []);

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

  // Add new useEffect for scrolling to options when they appear
  useEffect(() => {
    if (showAnswers && optionsRef.current) {
      setTimeout(() => {
        optionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [showAnswers]);

  const handleChoiceSelect = (choiceId: string) => {
    if (showFeedback) return;
    
    const selectedChoiceData = currentStepData.choices?.find(
      (choice: any) => choice.id === choiceId
    );

    if (!selectedChoiceData) return;

    setSelectedChoice(choiceId);
    setShowFeedback(true);

    // Only add the user's message if it's the correct answer
    if (selectedChoiceData.isCorrect) {
      const newMessage = {
        id: `answer-${choiceId}`,
        speaker: 'user',
        text: selectedChoiceData.text,
        emotion: 'neutral'
      };
      
      // Add user's message and make it visible immediately
      setAllMessages(prev => [...prev, newMessage]);
      setVisibleMessages(prev => prev + 1);

      // Get next messages if available
      if (currentStep < scenario.steps.length - 1) {
        const nextStepMessages = scenario.steps[currentStep + 1].messages;
        setNextMessages(nextStepMessages);
      }

      setProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1
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
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const handleCorrectAnswer = () => {
    const nextStep = currentStep + 1;
    if (nextStep < scenario.steps.length) {
      // First hide answers with animation
      setShowAnswers(false);
      
      // Wait for fade out animation, then update
      setTimeout(() => {
        setCurrentStep(nextStep);
        setSelectedChoice(null);
        setShowFeedback(false);
        
        // Get the next step's messages
        const nextStepMessages = scenario.steps[nextStep].messages;
        
        // Keep track of current messages and their visibility
        const currentMessageCount = allMessages.length;
        
        // Combine current messages with next messages
        setAllMessages(prev => [...prev, ...nextStepMessages]);
        
        // Start showing new messages one by one, starting after the current messages
        nextStepMessages.forEach((_, index) => {
          setTimeout(() => {
            setVisibleMessages(currentMessageCount + index + 1);
            
            // Scroll to the latest message
            window.scrollTo({
              top: document.documentElement.scrollHeight - 300,
              behavior: 'smooth'
            });
            
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
      setIsComplete(true);
      markExerciseCompleted('conflict-resolution');
    }
  };

  const handleTryAgain = () => {
    setCurrentStep(0);
    setVisibleMessages(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setShowAnswers(false);
    setIsComplete(false);
    setAllMessages(scenario.steps[0].messages);
    setProgress({
      correctAnswers: 0,
      completedScenarios: []
    });
  };

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
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      .message-bubble {
        padding: 12px 16px;
        border-radius: 18px;
        margin-bottom: 8px;
        max-width: 80%;
        animation: fadeIn 0.3s ease-out;
      }
      
      .message-bubble.user {
        background-color: #18B48E;
        color: white;
        align-self: flex-end;
      }
      
      .message-bubble.other {
        background-color: #F0F0F0;
        color: #333;
        align-self: flex-start;
      }
      
      .practice-option {
        padding: 16px;
        border: 2px solid #E5E7EB;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .practice-option:hover {
        border-color: #18B48E;
        background-color: rgba(24, 180, 142, 0.05);
      }
      
      .practice-option.selected {
        border-color: #18B48E;
      }
      
      .choice-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #F3F4F6;
        color: #4B5563;
        font-weight: bold;
      }
      
      .feedback-box {
        padding: 16px;
        border-radius: 12px;
        animation: fadeIn 0.3s ease-out;
      }
      
      .feedback-box.correct {
        background-color: rgba(24, 180, 142, 0.1);
        border: 1px solid rgba(24, 180, 142, 0.3);
      }
      
      .feedback-box.incorrect {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      
      .btn-primary {
        background-color: #18B48E;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .btn-primary:hover {
        background-color: #15a37f;
      }
      
      .animate-bounce-slow {
        animation: bounce-slow 2s infinite;
      }
      
      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
      
      @keyframes scale-in {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      .card {
        background-color: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 24px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#321C3D] mb-4">{scenario.title}</h1>
              <div className="bg-[#321C3D] text-white p-6 rounded-xl">
                <p className="text-lg">{scenario.context}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 mb-6 shadow-sm">
              {allMessages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isVisible={index < visibleMessages}
                  delay={index * 1000}
                />
              ))}

              {showAnswers && currentStepData.choices && (
                <div className="mt-8" ref={optionsRef}>
                  <h3 className="text-xl font-semibold mb-6">{currentStepData.prompt}</h3>
                  <div className="space-y-4">
                    {currentStepData.choices.map((choice, index) => (
                      <ChoiceButton
                        key={choice.id}
                        choice={choice}
                        isSelected={selectedChoice === choice.id}
                        showFeedback={showFeedback}
                        onClick={() => handleChoiceSelect(choice.id)}
                        isVisible={showAnswers}
                        index={index}
                        onContinue={handleContinue}
                        onCorrectAnswer={handleCorrectAnswer}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center bg-white rounded-xl p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#321C3D] mb-4">
                Gratulujeme! Dokončili jste scénář.
              </h2>
              <p className="text-xl text-gray-600">
                Správně jste odpověděli na {progress.correctAnswers} z {scenario.steps.length} otázek.
              </p>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={handleTryAgain}
                className="px-8 py-3 bg-white text-[#18B48E] border-2 border-[#18B48E] rounded-lg hover:bg-[#18B48E]/5 transition-colors text-lg font-medium"
              >
                Zkusit znovu
              </button>
              <Link
                to="/exercises"
                className="px-8 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90 transition-colors text-lg font-medium"
              >
                Zpět na přehled
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConflictResolution; 