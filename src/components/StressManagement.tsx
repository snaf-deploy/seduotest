import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

const StressManagement: React.FC = () => {
  const { markExerciseCompleted } = useContext(UserProgressContext);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const totalBreaths = 5;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .card {
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes breatheIn {
        0% { 
          transform: scale(0.8) rotate(var(--rotation));
          opacity: 0.4;
          filter: blur(2px);
        }
        100% { 
          transform: scale(1.2) rotate(calc(var(--rotation) + 180deg));
          opacity: 0.9;
          filter: blur(0);
        }
      }

      @keyframes breatheOut {
        0% { 
          transform: scale(1.2) rotate(calc(var(--rotation) + 180deg));
          opacity: 0.9;
          filter: blur(0);
        }
        100% { 
          transform: scale(0.8) rotate(var(--rotation));
          opacity: 0.4;
          filter: blur(2px);
        }
      }

      @keyframes hold {
        0%, 100% { 
          transform: scale(1.2) rotate(calc(var(--rotation) + 180deg));
          filter: blur(0);
        }
        50% { 
          transform: scale(1.15) rotate(calc(var(--rotation) + 185deg));
          filter: blur(1px);
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      .breathing-container {
        position: relative;
        width: 300px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transform: scale(0.7);
      }

      .breathing-circle {
        position: relative;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s ease;
      }

      .petal {
        position: absolute;
        width: 80px;
        height: 80px;
        background: linear-gradient(to right, #18b48e, #0ea17d);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        margin-left: -40px;
        margin-top: -40px;
        transform-origin: 40px 40px;
        box-shadow: 0 0 15px rgba(24, 180, 142, 0.5);
        opacity: 0.8;
      }

      .petal::after {
        content: '';
        position: absolute;
        inset: -5px;
        background: inherit;
        border-radius: inherit;
        filter: blur(5px);
        opacity: 0.5;
      }

      .inner-circle {
        position: absolute;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle at center, rgba(24, 180, 142, 0.3), transparent 70%);
        border-radius: 50%;
        animation: pulse 3s ease-in-out infinite;
      }

      .ripple {
        position: absolute;
        width: 200px;
        height: 200px;
        border: 2px solid rgba(24, 180, 142, 0.2);
        border-radius: 50%;
        animation: ripple 3s ease-out infinite;
      }

      .breathing-circle.inhale .petal {
        animation: breatheIn 4s ease-in-out forwards;
      }

      .breathing-circle.exhale .petal {
        animation: breatheOut 4s ease-in-out forwards;
      }

      .breathing-circle.hold .petal {
        animation: hold 4s ease-in-out infinite;
      }

      .message {
        position: absolute;
        width: 100%;
        text-align: center;
        top: -2.5rem;
        font-size: 1.25rem;
        color: #18B48E;
        font-weight: 500;
        text-shadow: 0 0 10px rgba(24, 180, 142, 0.2);
      }

      .breath-count {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1rem;
        color: #666;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .countdown {
        position: absolute;
        font-size: 3rem;
        font-weight: 300;
        color: #FFFFFF;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!isBreathing) return;

    const breathingCycle = async () => {
      // Inhale
      setPhase('inhale');
      for (let i = 4; i >= 1; i--) {
        setTimeLeft(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Hold
      setPhase('hold');
      for (let i = 7; i >= 1; i--) {
        setTimeLeft(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Exhale
      setPhase('exhale');
      for (let i = 8; i >= 1; i--) {
        setTimeLeft(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setBreathCount(prev => {
        if (prev + 1 >= totalBreaths) {
          setIsBreathing(false);
          setIsFinished(true);
          markExerciseCompleted('stress-management');
          return 0;
        }
        return prev + 1;
      });
    };

    breathingCycle();
  }, [isBreathing, breathCount, markExerciseCompleted]);

  const createPetals = () => {
    const petals = [];
    const numPetals = 12;
    const radius = 110; // Radius for petal positioning

    for (let i = 0; i < numPetals; i++) {
      const angle = (i * 360) / numPetals;
      const radians = (angle * Math.PI) / 180;
      const x = radius * Math.cos(radians);
      const y = radius * Math.sin(radians);
      
      petals.push(
        <div
          key={i}
          className="petal"
          style={{
            transform: `translate(${x}px, ${y}px)`,
            '--rotation': `${angle}deg`
          } as React.CSSProperties}
        ></div>
      );
    }
    return petals;
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'inhale':
        return `Nádech... (${timeLeft}s)`;
      case 'hold':
        return `Zadržte dech... (${timeLeft}s)`;
      case 'exhale':
        return `Výdech... (${timeLeft}s)`;
      default:
        return 'Připravte se...';
    }
  };

  const getPhaseInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Nádech...';
      case 'hold':
        return 'Zadržte dech...';
      case 'exhale':
        return 'Výdech...';
      default:
        return '';
    }
  };

  if (isFinished) {
    return (
      <div className="h-screen bg-[#F5F6F7] p-4">
        <div className="max-w-2xl mx-auto h-full">
          <div className="card">
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-[#321C3D] mb-4">
                Skvělá práce! 🎉
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Dokončili jste všech {totalBreaths} dechových cyklů.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setBreathCount(0);
                  }}
                  className="px-8 py-3 border-2 border-[#18B48E] text-[#18B48E] rounded-lg hover:bg-[#18B48E]/5"
                >
                  Zkusit znovu
                </button>
                <Link
                  to="/exercises"
                  className="px-8 py-3 bg-[#18B48E] text-white rounded-lg hover:bg-[#18B48E]/90"
                >
                  Zpět na přehled
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F5F6F7] p-4">
      <div className="max-w-2xl mx-auto h-full">
        <div className="card">
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
              <Link to="/exercises" className="text-[#321C3D] hover:text-[#18B48E] transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zpět na procvičování
              </Link>
              {isBreathing && (
                <div className="breath-count">
                  Dech {breathCount + 1} z {totalBreaths}
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#321C3D] mb-2">Dechové cvičení</h1>
            <p className="text-gray-600 mb-2">
              Toto cvičení vám pomůže se uvolnit a snížit stres. Následujte animaci a dýchejte podle pokynů.
              <br />
              <span className="font-medium mt-1 inline-block">
                Technika 4-7-8: Nádech na 4s, zadržet na 7s, výdech na 8s
              </span>
            </p>
          </div>

          <div className="breathing-container">
            {isBreathing && <div className="ripple" />}
            <div className={`breathing-circle ${phase}`}>
              <div className="inner-circle" />
              {createPetals()}
              {isBreathing && (
                <>
                  <div className="message">{getPhaseInstructions()}</div>
                  <div className="countdown" style={{color: '#FFFFFF'}}>{timeLeft}</div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsBreathing(true)}
              disabled={isBreathing}
              className={`px-8 py-2 rounded-lg text-white font-medium transition-all ${
                isBreathing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#18B48E] hover:bg-[#18B48E]/90'
              }`}
            >
              {isBreathing ? 'Probíhá cvičení...' : 'Začít cvičení'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressManagement; 