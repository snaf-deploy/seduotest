import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DialoguePractice from './components/DialoguePractice';
import DifficultConversations from './components/DifficultConversations';
import ExercisesPage, { UserProgressProvider } from './components/ExercisesPage';
import ActiveListening from './components/ActiveListening';
import TimeManagement from './components/TimeManagement';
import Feedback from './components/Feedback';
import Delegation from './components/Delegation';
import RolePlayScenario from './components/RolePlayScenario';
import DecisionSimulation from './components/DecisionSimulation';
import ConflictResolution from './components/ConflictResolution';
import StrategicThinking from './components/StrategicThinking';
import StressManagement from './components/StressManagement';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <UserProgressProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/exercises" element={<Layout><ExercisesPage /></Layout>} />
            <Route path="/dialogue-practice" element={<Layout><DialoguePractice /></Layout>} />
            <Route path="/difficult-conversations" element={<Layout><DifficultConversations /></Layout>} />
            <Route path="/active-listening" element={<Layout><ActiveListening /></Layout>} />
            <Route path="/time-management" element={<Layout><TimeManagement /></Layout>} />
            <Route path="/feedback" element={<Layout><Feedback /></Layout>} />
            <Route path="/delegation" element={<Layout><Delegation /></Layout>} />
            <Route path="/role-play" element={<Layout><RolePlayScenario /></Layout>} />
            <Route path="/decision-simulation" element={<Layout><DecisionSimulation /></Layout>} />
            <Route path="/conflict-resolution" element={<Layout><ConflictResolution /></Layout>} />
            <Route path="/strategic-thinking" element={<Layout><StrategicThinking /></Layout>} />
            <Route path="/stress-management" element={<Layout><StressManagement /></Layout>} />
            <Route path="*" element={<Layout><HomePage /></Layout>} />
          </Routes>
        </div>
      </UserProgressProvider>
    </Router>
  );
}

export default App;
