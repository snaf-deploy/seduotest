import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserProgressContext } from './ExercisesPage';

// Define interfaces
interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  urgency: 'low' | 'medium' | 'high';
  skills: string[];
  bestMatch: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: string[];
  workload: number;
  avatar: string;
}

const Delegation: React.FC = () => {
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: "Oprava chyby v API",
      description: "Opravit chybu v API, která způsobuje nesprávné načítání dat z databáze.",
      difficulty: "medium",
      urgency: "high",
      skills: ["Backend", "API", "Debugging"],
      bestMatch: 2
    },
    {
      id: 2,
      title: "Návrh nového UI pro dashboard",
      description: "Vytvořit návrh nového uživatelského rozhraní pro dashboard aplikace.",
      difficulty: "medium",
      urgency: "medium",
      skills: ["UI Design", "UX", "Figma"],
      bestMatch: 3
    },
    {
      id: 3,
      title: "Aktualizace dokumentace",
      description: "Aktualizovat dokumentaci API pro nové funkce přidané v poslední verzi.",
      difficulty: "easy",
      urgency: "low",
      skills: ["Dokumentace", "Komunikace"],
      bestMatch: 4
    },
    {
      id: 4,
      title: "Optimalizace výkonu databáze",
      description: "Analyzovat a optimalizovat dotazy do databáze pro zlepšení výkonu aplikace.",
      difficulty: "hard",
      urgency: "medium",
      skills: ["Databáze", "Optimalizace", "SQL"],
      bestMatch: 2
    },
    {
      id: 5,
      title: "Implementace nového přihlašovacího systému",
      description: "Implementovat nový přihlašovací systém s podporou dvoufaktorové autentizace.",
      difficulty: "hard",
      urgency: "high",
      skills: ["Bezpečnost", "Frontend", "Backend"],
      bestMatch: 1
    },
    {
      id: 6,
      title: "Testování nových funkcí",
      description: "Provést testování nových funkcí a nahlásit případné chyby.",
      difficulty: "easy",
      urgency: "medium",
      skills: ["Testování", "QA"],
      bestMatch: 5
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Jan Novák",
      role: "Senior Developer",
      skills: ["Frontend", "Backend", "Bezpečnost", "Architektura"],
      workload: 60,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Petra Svobodová",
      role: "Backend Developer",
      skills: ["Backend", "Databáze", "API", "Debugging"],
      workload: 40,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Tomáš Dvořák",
      role: "UI/UX Designer",
      skills: ["UI Design", "UX", "Figma", "Prototypování"],
      workload: 30,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 4,
      name: "Lucie Černá",
      role: "Junior Developer",
      skills: ["Frontend", "Dokumentace", "Testování"],
      workload: 20,
      avatar: "https://randomuser.me/api/portraits/women/56.jpg"
    },
    {
      id: 5,
      name: "Martin Horák",
      role: "QA Specialist",
      skills: ["Testování", "QA", "Automatizace"],
      workload: 50,
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ]);

  // Change assignments structure to store arrays of task IDs for each member
  const [assignments, setAssignments] = useState<{[key: number]: number[]}>({});
  const [feedback, setFeedback] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'warning' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [assignedTasksList, setAssignedTasksList] = useState<Task[]>([]);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);
  const [allTasksAssigned, setAllTasksAssigned] = useState(false);
  const assignedTasksRef = useRef<HTMLDivElement>(null);

  // Get the markExerciseCompleted function from context
  const { markExerciseCompleted } = useContext(UserProgressContext);

  // Handle task assignment
  const handleTaskAssignment = (taskId: number, memberId: number) => {
    // Check if task is already assigned
    if (isTaskAssigned(taskId)) {
      return;
    }

    // Get the task and member
    const task = tasks.find(t => t.id === taskId);
    const member = teamMembers.find(m => m.id === memberId);

    if (!task || !member) return;

    // Check workload
    const memberAssignments = assignments[memberId] || [];
    const assignedTasksCount = memberAssignments.length;
    
    const newWorkload = member.workload + (assignedTasksCount + 1) * 20;
    
    if (newWorkload > 100) {
      setFeedback({
        show: true,
        message: `${member.name} má již příliš mnoho práce. Zvažte delegaci na někoho jiného.`,
        type: 'error'
      });
      
      setTimeout(() => {
        setFeedback({ show: false, message: '', type: 'success' });
      }, 3000);
      
      return;
    }

    // Check skill match - but don't show feedback about it
    const skillMatch = task.skills.some(skill => member.skills.includes(skill));
    
    // Update assignments
    setAssignments(prev => {
      const memberTasks = prev[memberId] || [];
      return {
        ...prev,
        [memberId]: [...memberTasks, taskId]
      };
    });

    // Add to assigned tasks list - ensure we don't add duplicates
    setAssignedTasksList(prev => {
      // Check if task is already in the list
      if (!prev.some(t => t.id === task.id)) {
        return [...prev, task];
      }
      return prev;
    });

    // Provide feedback about assignment without revealing if it's right or wrong
    setFeedback({
      show: true,
      message: `Úkol "${task.title}" byl přiřazen ${member.name}.`,
      type: 'success'
    });

    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'success' });
    }, 3000);

    // Check if all tasks are assigned
    const totalAssignedTasks = Object.values(assignments).reduce((sum, tasks) => sum + tasks.length, 0) + 1;
    if (totalAssignedTasks === tasks.length) {
      setAllTasksAssigned(true);
      
      // Scroll to the assigned tasks section
      setTimeout(() => {
        if (assignedTasksRef.current) {
          assignedTasksRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
    
    // Reset selected task
    setSelectedTask(null);
    
    // Advance tutorial if active
    if (showTutorial && tutorialStep === 1) {
      setTutorialStep(2);
    }
  };

  // Calculate score only when evaluating
  const calculateScore = () => {
    let calculatedScore = 0;
    
    Object.entries(assignments).forEach(([memberId, taskIds]) => {
      const member = teamMembers.find(m => m.id === parseInt(memberId));
      
      if (!member) return;
      
      taskIds.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return;
        
        // Check if this is the best match
        if (task.bestMatch === member.id) {
          calculatedScore += 2;
        } 
        // Check if there's a skill match
        else if (task.skills.some(skill => member.skills.includes(skill))) {
          calculatedScore += 1;
        }
      });
    });
    
    return calculatedScore;
  };

  // Unassign a task
  const handleUnassignTask = (memberId: number, taskId: number) => {
    // Update assignments
    setAssignments(prev => {
      const memberTasks = prev[memberId] || [];
      const updatedTasks = memberTasks.filter(id => id !== taskId);
      
      const newAssignments = { ...prev };
      
      if (updatedTasks.length === 0) {
        delete newAssignments[memberId];
      } else {
        newAssignments[memberId] = updatedTasks;
      }
      
      return newAssignments;
    });
    
    // Show feedback
    setFeedback({
      show: true,
      message: 'Úkol byl odebrán.',
      type: 'warning'
    });
    
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'success' });
    }, 2000);
    
    // Set allTasksAssigned to false since we now have unassigned tasks
    setAllTasksAssigned(false);
    
    // Set isComplete to false since we now have unassigned tasks
    setIsComplete(false);
  };

  // Evaluate the assignments and show results
  const handleEvaluate = () => {
    // Calculate the final score
    const finalScore = calculateScore();
    setScore(finalScore);
    
    setIsComplete(true);
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset the exercise
  const resetExercise = () => {
    setAssignments({});
    setFeedback({ show: false, message: '', type: 'success' });
    setIsComplete(false);
    setScore(0);
    setSelectedTask(null);
    setShowTutorial(true);
    setTutorialStep(1);
    setAssignedTasksList([]);
    setAllTasksAssigned(false);
  };

  // Get assigned tasks for a team member
  const getAssignedTasks = (memberId: number): Task[] => {
    const memberTaskIds = assignments[memberId] || [];
    return tasks.filter(task => memberTaskIds.includes(task.id));
  };

  // Check if a task is assigned
  const isTaskAssigned = (taskId: number): boolean => {
    return Object.values(assignments).some(taskIds => taskIds.includes(taskId));
  };

  // Calculate final score percentage
  const getScorePercentage = () => {
    const maxScore = tasks.length * 2;
    return Math.round((score / maxScore) * 100);
  };

  // Get feedback based on score
  const getFinalFeedback = () => {
    const score = getScorePercentage();
    
    // If the user has completed the exercise successfully
    if (score >= 70) { // 70% correct
      // Mark the exercise as completed
      markExerciseCompleted('delegation');
      console.log('Delegation exercise completed with score:', score);
    }
    
    if (score >= 80) {
      return {
        title: "Výborně!",
        message: "Máte skvělé dovednosti v delegování úkolů. Dokážete efektivně přiřadit úkoly správným lidem s ohledem na jejich dovednosti a vytížení.",
        icon: "🏆"
      };
    } else if (score >= 50) {
      return {
        title: "Dobrá práce!",
        message: "Máte dobré základy v delegování úkolů, ale je zde prostor pro zlepšení. Zkuste více zohlednit dovednosti a vytížení členů týmu.",
        icon: "👍"
      };
    } else {
      return {
        title: "Je třeba se zlepšit",
        message: "Delegování úkolů vyžaduje více praxe. Zaměřte se na to, aby úkoly byly přiřazeny lidem s odpovídajícími dovednostmi a přiměřeným vytížením.",
        icon: "📚"
      };
    }
  };

  // Get assignment quality feedback
  const getAssignmentFeedback = (taskId: number, memberId: number) => {
    const task = tasks.find(t => t.id === taskId);
    const member = teamMembers.find(m => m.id === memberId);
    
    if (!task || !member) return { quality: 'unknown', message: 'Neznámé přiřazení' };
    
    // Check if this is the best match
    if (task.bestMatch === member.id) {
      return { 
        quality: 'excellent', 
        message: `Ideální volba! ${member.name} je nejlepší volbou pro tento úkol.`,
        reason: `Má všechny potřebné dovednosti a zkušenosti pro tento typ úkolu.`
      };
    } 
    // Check if there's a skill match
    else if (task.skills.some(skill => member.skills.includes(skill))) {
      const matchingSkills = task.skills.filter(skill => member.skills.includes(skill));
      return { 
        quality: 'good', 
        message: `Dobrá volba. ${member.name} má některé potřebné dovednosti.`,
        reason: `Má tyto relevantní dovednosti: ${matchingSkills.join(', ')}.`
      };
    } else {
      return { 
        quality: 'poor', 
        message: `Nevhodná volba. ${member.name} nemá potřebné dovednosti pro tento úkol.`,
        reason: `Potřebné dovednosti (${task.skills.join(', ')}) chybí v profilu zaměstnance.`
      };
    }
  };

  // Get the best team member for a task
  const getBestTeamMemberForTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    return teamMembers.find(m => m.id === task.bestMatch);
  };

  // Render task card
  const renderTaskCard = (task: Task) => {
    const isAssigned = isTaskAssigned(task.id);
    const isSelected = selectedTask === task.id;
    
    return (
      <div
        key={task.id}
        className={`p-4 rounded-lg shadow-sm border-2 mb-3 transition-all ${
          isAssigned ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 
          isSelected ? 'bg-[#18B48E]/10 border-[#18B48E] shadow-md' :
          'bg-white border-[#18B48E]/20 cursor-pointer hover:border-[#18B48E] hover:shadow'
        } ${showTutorial && tutorialStep === 1 && !isAssigned && !isSelected ? 'pulse' : ''}`}
        onClick={() => !isAssigned && setSelectedTask(task.id)}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-[#321C3D]">{task.title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        <div className="flex flex-wrap gap-1">
          {task.skills.map((skill, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
        </div>
        
        {isSelected && (
          <div className="mt-3 text-sm text-[#18B48E] font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Vyberte člena týmu pro přiřazení
          </div>
        )}
      </div>
    );
  };

  // Render team member card
  const renderTeamMemberCard = (member: TeamMember) => {
    const assignedTasks = getAssignedTasks(member.id);
    const currentWorkload = member.workload + assignedTasks.length * 20;
    const isTaskSelected = selectedTask !== null && !isTaskAssigned(selectedTask);
    const isHovered = hoveredMember === member.id;
    
    // Check if the selected task's skills match with this member's skills
    const selectedTaskObj = selectedTask ? tasks.find(t => t.id === selectedTask) : null;
    const matchingSkills = selectedTaskObj ? selectedTaskObj.skills.filter(skill => member.skills.includes(skill)) : [];
    const hasMatchingSkills = matchingSkills.length > 0;
    
    const workloadColor = 
      currentWorkload < 50 ? 'text-green-600' :
      currentWorkload < 80 ? 'text-yellow-600' :
      'text-red-600';
    
    return (
      <div 
        key={member.id}
        className={`p-4 rounded-lg border-2 transition-all ${
          isTaskSelected ? 'cursor-pointer hover:border-[#18B48E] hover:bg-[#18B48E]/5' : 'border-gray-200'
        } ${showTutorial && tutorialStep === 2 ? 'pulse' : ''}`}
        onClick={() => {
          if (isTaskSelected) {
            handleTaskAssignment(selectedTask, member.id);
          }
        }}
        onMouseEnter={() => setHoveredMember(member.id)}
        onMouseLeave={() => setHoveredMember(null)}
      >
        <div className="flex items-center mb-4">
          <img 
            src={member.avatar} 
            alt={member.name} 
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <div>
            <h3 className="font-medium text-[#321C3D]">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Vytížení</span>
            <span className={workloadColor}>{currentWorkload}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                currentWorkload < 50 ? 'bg-green-500' :
                currentWorkload < 80 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} 
              style={{ width: `${Math.min(currentWorkload, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-1">Dovednosti:</h4>
          <div className="flex flex-wrap gap-1">
            {member.skills.map((skill, index) => {
              const isMatchingSkill = selectedTaskObj && selectedTaskObj.skills.includes(skill);
              return (
                <span 
                  key={index} 
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isMatchingSkill ? 'bg-green-100 text-green-800 font-semibold' : 'bg-[#321C3D]/10 text-[#321C3D]'
                  }`}
                >
                  {skill}
                  {isMatchingSkill && (
                    <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              );
            })}
          </div>
        </div>
        
        {assignedTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Přiřazené úkoly:</h4>
            <ul className="text-sm space-y-1">
              {assignedTasks.map(task => (
                <li key={task.id} className="bg-gray-100 p-2 rounded">
                  {task.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isTaskSelected && (
          <div className="mt-3 text-sm text-[#18B48E] font-medium flex items-center justify-center p-2 bg-[#18B48E]/10 rounded-lg">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Klikněte pro přiřazení úkolu
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F6F7] p-6">
      {feedback.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          feedback.type === 'success' ? 'bg-green-100 text-green-800' :
          feedback.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {feedback.message}
        </div>
      )}
      
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Jak delegovat úkoly</h3>
            
            {tutorialStep === 1 ? (
              <>
                <p className="mb-4">1. Nejprve vyberte úkol, který chcete delegovat kliknutím na něj.</p>
                <div className="flex justify-between">
                  <button 
                    className="btn-primary bg-white text-[#18B48E] border border-[#18B48E] hover:bg-[#18B48E]/5"
                    onClick={() => setShowTutorial(false)}
                  >
                    Přeskočit tutoriál
                  </button>
                  
                  <button 
                    className="btn-primary"
                    onClick={() => setTutorialStep(2)}
                  >
                    Další
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4">2. Poté klikněte na člena týmu, kterému chcete úkol přiřadit.</p>
                <div className="flex justify-between">
                  <button 
                    className="btn-primary bg-white text-[#18B48E] border border-[#18B48E] hover:bg-[#18B48E]/5"
                    onClick={() => setTutorialStep(1)}
                  >
                    Zpět
                  </button>
                  
                  <button 
                    className="btn-primary"
                    onClick={() => setShowTutorial(false)}
                  >
                    Začít delegovat
                  </button>
                </div>
              </>
            )}
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
        
        {!isComplete ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-[#321C3D]">Delegování úkolů</h1>
            
            <div className="bg-[#f0f8ff] p-4 rounded-xl mb-6">
              <h2 className="text-lg font-medium mb-2">Instrukce:</h2>
              <p className="text-gray-700">
                Jste vedoucí týmu a potřebujete delegovat úkoly na členy vašeho týmu. <strong>Nejprve vyberte úkol</strong> a <strong>poté klikněte na člena týmu</strong>, kterému chcete úkol přiřadit. Berte v úvahu jejich dovednosti a aktuální vytížení.
              </p>
              
              {selectedTask && (
                <div className="mt-3 bg-[#18B48E]/10 p-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#18B48E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span className="text-[#18B48E] font-medium">Úkol vybrán! Nyní vyberte člena týmu pro přiřazení.</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <span className="bg-[#18B48E] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                  Úkoly k delegování
                </h2>
                <div className="space-y-3">
                  {tasks.filter(task => !isTaskAssigned(task.id)).map(task => renderTaskCard(task))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <span className="bg-[#18B48E] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                  Členové týmu
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {teamMembers.map(member => renderTeamMemberCard(member))}
                </div>
              </div>
            </div>
            
            {assignedTasksList.length > 0 && (
              <div className="mt-8" ref={assignedTasksRef}>
                <h2 className="text-xl font-medium mb-4">Přiřazené úkoly</h2>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(assignments).flatMap(([memberId, taskIds]) => {
                      const member = teamMembers.find(m => m.id === parseInt(memberId));
                      
                      if (!member) return null;
                      
                      return taskIds.map(taskId => {
                        const task = tasks.find(t => t.id === taskId);
                        
                        if (!task) return null;
                        
                        return (
                          <div key={`${memberId}-${taskId}`} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group">
                            <button 
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnassignTask(parseInt(memberId), taskId);
                              }}
                              title="Odebrat úkol"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <h3 className="font-medium text-[#321C3D] mb-1 pr-6">{task.title}</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <span>Přiřazeno: </span>
                              <div className="flex items-center ml-2">
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="w-5 h-5 rounded-full mr-1 object-cover"
                                />
                                <span>{member.name}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {task.skills.map((skill, index) => (
                                <span key={index} className={`text-xs px-2 py-0.5 rounded-full ${
                                  member.skills.includes(skill) 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                  
                  {allTasksAssigned && (
                    <div className="mt-6 flex justify-center">
                      <button 
                        className="btn-primary bg-[#18B48E] text-white px-6 py-3 rounded-lg font-medium flex items-center"
                        onClick={handleEvaluate}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Vyhodnotit delegování
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#18B48E]/10 p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <div className="text-5xl mr-6">{getFinalFeedback().icon}</div>
              <div>
                <h2 className="text-3xl font-bold mb-2 text-[#18B48E]">{getFinalFeedback().title}</h2>
                <p className="text-gray-700">{getFinalFeedback().message}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Hodnocení vašich rozhodnutí</h3>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium">Celkové skóre</div>
                  <div className="text-2xl font-bold text-[#18B48E]">{getScorePercentage()}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-[#18B48E]" 
                    style={{ width: `${getScorePercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {Object.entries(assignments).flatMap(([memberId, taskIds]) => {
                  const member = teamMembers.find(m => m.id === parseInt(memberId));
                  
                  if (!member) return null;
                  
                  return taskIds.map(taskId => {
                    const task = tasks.find(t => t.id === taskId);
                    if (!task) return null;
                    
                    const feedback = getAssignmentFeedback(task.id, member.id);
                    const bestMember = getBestTeamMemberForTask(task.id);
                    
                    return (
                      <div 
                        key={`result-${memberId}-${taskId}`} 
                        className={`border-l-4 p-4 rounded-r-lg ${
                          feedback.quality === 'excellent' ? 'border-green-500 bg-green-50' :
                          feedback.quality === 'good' ? 'border-blue-500 bg-blue-50' :
                          'border-yellow-500 bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-[#321C3D]">{task.title}</h4>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600 mr-2">Přiřazeno:</span>
                              <div className="flex items-center">
                                <img 
                                  src={member.avatar} 
                                  alt={member.name} 
                                  className="w-5 h-5 rounded-full mr-1 object-cover"
                                />
                                <span className="text-sm font-medium">{member.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            feedback.quality === 'excellent' ? 'bg-green-200 text-green-800' :
                            feedback.quality === 'good' ? 'bg-blue-200 text-blue-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {feedback.quality === 'excellent' ? 'Výborné' :
                             feedback.quality === 'good' ? 'Dobré' : 'Nevhodné'}
                          </div>
                        </div>
                        
                        <p className="text-sm mt-2">{feedback.message}</p>
                        <p className="text-sm mt-1 text-gray-600">{feedback.reason}</p>
                        
                        {feedback.quality !== 'excellent' && bestMember && (
                          <div className="mt-3 text-sm bg-gray-100 p-2 rounded-lg">
                            <span className="font-medium">Tip:</span> Ideální volbou by byl(a) <span className="font-medium">{bestMember.name}</span>, 
                            který(á) má všechny potřebné dovednosti: {task.skills.filter(skill => 
                              bestMember.skills.includes(skill)).join(', ')}.
                          </div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <h3 className="font-bold text-blue-800 mb-2">Principy efektivního delegování:</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li><strong>Znalost týmu:</strong> Porozumění dovednostem, zkušenostem a zájmům členů týmu</li>
                <li><strong>Jasné zadání:</strong> Poskytnutí jasných instrukcí a očekávání</li>
                <li><strong>Rovnováha vytížení:</strong> Zajištění rovnoměrného rozdělení práce</li>
                <li><strong>Odpovídající dovednosti:</strong> Přiřazení úkolů lidem s odpovídajícími dovednostmi</li>
                <li><strong>Podpora a zpětná vazba:</strong> Poskytnutí podpory a konstruktivní zpětné vazby</li>
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

export default Delegation; 