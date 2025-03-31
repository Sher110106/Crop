import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from './language-context';

interface SpeechSettings {
  enabled: boolean;
  delay: number;
  rate: number;
  pitch: number;
  volume: number;
  selectedVoice: string;
  language: 'en-IN' | 'hi-IN';
}

interface SpeechContextType {
  settings: SpeechSettings;
  updateSettings: (settings: Partial<SpeechSettings>) => void;
  speak: (text: string, element?: HTMLElement) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
}

const defaultSettings: SpeechSettings = {
  enabled: true,
  delay: 150,
  rate: 1,
  pitch: 1,
  volume: 1,
  selectedVoice: '',
  language: 'en-IN'
};

const SpeechContext = createContext<SpeechContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  speak: async () => {},
  stopSpeaking: () => {},
  isSpeaking: false,
  voices: []
});

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};

interface SpeechProviderProps {
  children: React.ReactNode;
}

export const SpeechProvider: React.FC<SpeechProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SpeechSettings>(defaultSettings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language } = useLanguage();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spokenElementsRef = useRef<Set<HTMLElement>>(new Set());
  const currentElementRef = useRef<HTMLElement | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedSettings = localStorage.getItem('speechSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Failed to parse speech settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('speechSettings', JSON.stringify(settings));
  }, [settings]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately if available
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    }

    // Listen for voices being loaded
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<SpeechSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  }, []);

  // Speak text
  const speak = useCallback(async (text: string, element?: HTMLElement) => {
    if (!settings.enabled || !text?.trim()) return;

    // Stop any ongoing speech
    stopSpeaking();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const availableVoices = window.speechSynthesis.getVoices();
    const preferredVoice = availableVoices.find(voice => 
      voice.lang.startsWith(language.split('-')[0])
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Apply speech settings
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Store current utterance
    currentUtteranceRef.current = utterance;
    setIsSpeaking(true);

    // Handle speech events
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    // Speak the text
    try {
      window.speechSynthesis.speak(utterance);
      
      // Fix for Chrome's speech synthesis bug
      const isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
      if (isChrome) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    } catch (e) {
      console.error("Error speaking text:", e);
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  }, [settings, language, stopSpeaking]);

  const contextValue: SpeechContextType = {
    settings,
    updateSettings,
    speak,
    stopSpeaking,
    isSpeaking,
    voices
  };

  return (
    <SpeechContext.Provider value={contextValue}>
      {children}
    </SpeechContext.Provider>
  );
};