import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, RobotoSlab_400Regular, RobotoSlab_700Bold } from '@expo-google-fonts/roboto-slab';
import { AppState, Fortune, AppView } from './types';
import { styles } from './styles';

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_700Bold,
  });
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
  if (!fontsLoaded) {
    return null;
  }

  async function checkTodaysFortune() {
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
          source={require('./assets/belizar.png')}
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
          {appState.isLoading ? 'Generating...' : 'Get Fortune'}
        </Text>
      </TouchableOpacity>

      {appState.error && (
        <Text style={styles.errorText}>{appState.error}</Text>
      )}
    </Animated.View>
  );

  const renderLoadingView = () => (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Text style={styles.loadingText}>Belizar sees...</Text>
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


