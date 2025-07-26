import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Fortune, AppView } from './types';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    todaysFortune: null,
    isLoading: false,
    error: null,
    hasGeneratedToday: false
  });
  
  const [currentView, setCurrentView] = useState<AppView>('initial');
  const opacity = useSharedValue(1);

  // AIDEV-NOTE: Check if user has already generated fortune today
  useEffect(() => {
    checkTodaysFortune();
  }, []);

  const checkTodaysFortune = async () => {
    try {
      const today = new Date().toDateString();
      const storedFortune = await AsyncStorage.getItem('todaysFortune');
      const lastGeneratedDate = await AsyncStorage.getItem('lastGeneratedDate');
      
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
  };

  const generateFortune = async () => {
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
      await AsyncStorage.setItem('todaysFortune', JSON.stringify(fortune));
      await AsyncStorage.setItem('lastGeneratedDate', today);

      setAppState(prev => ({
        ...prev,
        todaysFortune: fortune,
        isLoading: false,
        hasGeneratedToday: true
      }));
      
      // AIDEV-NOTE: Fade transition to fortune view
      opacity.value = withTiming(0, { duration: 300 }, () => {
        setCurrentView('fortune');
        opacity.value = withTiming(1, { duration: 300 });
      });
      
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong'
      }));
      setCurrentView('initial');
    }
  };

  const renderInitialView = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/200x200/6366f1/ffffff?text=🔮' }}
          style={styles.fortuneImage}
          contentFit="contain"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.generateButton}
        onPress={generateFortune}
        disabled={appState.isLoading}
      >
        <Text style={styles.buttonText}>
          {appState.isLoading ? 'Generating...' : 'Get Today\'s Fortune'}
        </Text>
      </TouchableOpacity>
      
      {appState.error && (
        <Text style={styles.errorText}>{appState.error}</Text>
      )}
    </Animated.View>
  );

  const renderLoadingView = () => (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Text style={styles.loadingText}>✨ Crafting your fortune...</Text>
    </Animated.View>
  );

  const renderFortuneView = () => (
    <Animated.View entering={FadeIn} style={styles.container}>
      <View style={styles.fortuneContainer}>
        <Text style={styles.fortuneText}>
          {appState.todaysFortune?.text}
        </Text>
        <Text style={styles.fortuneSubtext}>
          Your fortune for today
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar style="dark" />
      {currentView === 'initial' && renderInitialView()}
      {currentView === 'loading' && renderLoadingView()}
      {currentView === 'fortune' && renderFortuneView()}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginBottom: 80,
  },
  fortuneImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  generateButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  loadingText: {
    fontSize: 20,
    color: '#6366f1',
    fontWeight: '500',
  },
  fortuneContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  fortuneText: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: '#1f2937',
    fontWeight: '500',
    marginBottom: 24,
  },
  fortuneSubtext: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});
