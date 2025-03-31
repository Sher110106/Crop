import React, { useEffect, useRef, useState } from 'react';
import { useSpeech } from '@/lib/speech-context';
import { useLanguage } from '@/lib/language-context';
import { Volume2 } from 'lucide-react';
import { translations } from '@/lib/translations';

interface SpeakableElementProps {
  children: React.ReactNode;
  text: string;
  className?: string;
  delay?: number;
}

export const SpeakableElement: React.FC<SpeakableElementProps> = ({
  children,
  text,
  className = '',
  delay = 150
}) => {
  const { speak, stopSpeaking, isSpeaking } = useSpeech();
  const { language, translateContent } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [speakableText, setSpeakableText] = useState(text);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update speakable text when language changes
  useEffect(() => {
    const updateText = async () => {
      if (language === 'hi-IN') {
        try {
          const translatedText = await translateContent(text, true);
          setSpeakableText(translatedText);
        } catch (error) {
          console.error('Error translating text for speech:', error);
          setSpeakableText(text);
        }
      } else {
        setSpeakableText(text);
      }
    };

    updateText();
  }, [text, language, translateContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopSpeaking();
    };
  }, [stopSpeaking]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      speak(speakableText);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopSpeaking();
  };

  return (
    <div
      ref={elementRef}
      className={`relative group ${className} ${isSpeaking ? 'speaking' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isSpeaking) {
            stopSpeaking();
          } else {
            speak(speakableText);
          }
        }
      }}
      aria-label={`${text} (${translations['accessibility.speakable'][language]})`}
    >
      {children}
      {isHovered && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm whitespace-nowrap"
          role="tooltip"
        >
          {translations['speech.hoverToHear'][language]}
        </div>
      )}
      {isSpeaking && (
        <div className="absolute -top-8 right-0 text-primary animate-pulse">
          <Volume2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};