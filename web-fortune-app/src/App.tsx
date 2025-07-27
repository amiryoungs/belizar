import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppState, Fortune, AppView } from './types';
import './App.css';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    todaysFortune: null,
    isLoading: false,
    error: null,
    hasGeneratedToday: false
  });

  const [currentView, setCurrentView] = useState<AppView>('initial');

  // AIDEV-NOTE: Check if user has already generated fortune today
  useEffect(() => {
    checkTodaysFortune();
  }, []);

  async function checkTodaysFortune() {
    try {
      const today = new Date().toDateString();
      const storedFortune = localStorage.getItem('todaysFortune');
      const lastGeneratedDate = localStorage.getItem('lastGeneratedDate');

      if (storedFortune && lastGeneratedDate === today) {
        const fortune: Fortune = JSON.parse(storedFortune);
        setAppState(prev => ({
          ...prev,
          todaysFortune: fortune,
          hasGeneratedToday: true
        }));
        setCurrentView('fortune');
      }
    } catch (error) {
      console.error('Error checking stored fortune:', error);
    }
  }

  async function generateFortune() {
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    setCurrentView('loading');

    try {
      // AIDEV-NOTE: Call secure backend API endpoint
      const response = await fetch('/api/generate-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent || 'DailyFortuneApp'
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate fortune');
      }

      const fortune: Fortune = {
        text: result.data,
        generatedAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      // AIDEV-NOTE: Store fortune and date for daily tracking
      const today = new Date().toDateString();
      localStorage.setItem('todaysFortune', JSON.stringify(fortune));
      localStorage.setItem('lastGeneratedDate', today);

      setAppState(prev => ({
        ...prev,
        todaysFortune: fortune,
        isLoading: false,
        hasGeneratedToday: true
      }));

      // AIDEV-NOTE: Transition to fortune view with delay for better UX
      setTimeout(() => {
        setCurrentView('fortune');
      }, 1000);

    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong'
      }));
      setCurrentView('initial');
    }
  }

  const renderInitialView = () => (
    <motion.div 
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container"
    >
      <div className="image-container">
        <img
          src="/assets/belizar.png"
          className="fortune-image"
          alt="Fortune teller illustration"
          width={300}
          height={400}
        />
      </div>

      <button
        className="generate-button"
        onClick={generateFortune}
        disabled={appState.isLoading}
      >
        <p className="button-text">
          {appState.isLoading ? 'Generating...' : 'Get Fortune'}
        </p>
      </button>

      {appState.error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="error-text"
        >
          {appState.error}
        </motion.p>
      )}
    </motion.div>
  );

  const renderLoadingView = () => (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container"
    >
      <motion.p
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="loading-text"
      >
        Belizar sees...
      </motion.p>
    </motion.div>
  );

  const renderFortuneView = () => {
    const formattedFortune = (appState.todaysFortune?.text || '')
      .split('—')
      .map(sentence => {
        const trimmed = sentence.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      })
      .join('. ');

    return (
      <motion.div 
        key="fortune"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="container"
      >
        <div className="fortune-container">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fortune-title"
          >
            Your Fortune
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="fortune-text"
          >
            {formattedFortune}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="fortune-subtext"
          >
            Come back tomorrow for a new fortune
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="fortune-disclaimer"
          >
            FOR ENTERTAINMENT PURPOSES ONLY
          </motion.p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="wrapper">
      <AnimatePresence mode="wait">
        {currentView === 'initial' && renderInitialView()}
        {currentView === 'loading' && renderLoadingView()}
        {currentView === 'fortune' && renderFortuneView()}
      </AnimatePresence>
    </div>
  );
}