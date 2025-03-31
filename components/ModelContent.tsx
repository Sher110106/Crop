import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useSpeech } from '@/lib/speech-context';
import { SpeakableElement } from './SpeakableElement';
import { Volume2, Upload } from 'lucide-react';
import { translations } from '@/lib/translations';

interface ModelContentProps {
  content: string;
  className?: string;
  enableSpeech?: boolean;
  allowAudioUpload?: boolean;
}

/**
 * ModelContent component for displaying AI-generated content
 * with support for Hindi translation and text-to-speech
 */
export const ModelContent: React.FC<ModelContentProps> = ({
  content,
  className = '',
  enableSpeech = true,
  allowAudioUpload = false,
}) => {
  const { language, translateContent, isTranslating, t } = useLanguage();
  const { speak, stopSpeaking, isSpeaking } = useSpeech();
  const [translatedContent, setTranslatedContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [audioTranscription, setAudioTranscription] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Translate content when language changes or content changes
  useEffect(() => {
    let mounted = true;

    const performTranslation = async () => {
      if (language === 'en-IN' || !content?.trim()) {
        if (mounted) {
          setTranslatedContent(content || '');
          setTranslationError(null);
        }
        return;
      }

      try {
        setTranslationError(null);
        const result = await translateContent(content, true);
        if (mounted) {
          setTranslatedContent(result);
        }
      } catch (error) {
        console.error('Error translating model content:', error);
        if (mounted) {
          setTranslatedContent(content);
          setTranslationError(error instanceof Error ? error.message : t('error.translationFailed'));
        }
      }
    };

    performTranslation();

    return () => {
      mounted = false;
    };
  }, [content, language, translateContent, t]);

  // Handle audio file upload
  const handleAudioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const audioFile = files[0];
    
    if (!audioFile.type.startsWith('audio/')) {
      setTranslationError(t('error.invalidAudioFile'));
      return;
    }

    setIsProcessingAudio(true);
    setTranslationError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('targetLanguage', language);

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('error.audioProcessingFailed'));
      }

      setAudioTranscription(data.translatedText);
      setTranslatedContent(data.translatedText);
    } catch (error) {
      console.error('Audio processing error:', error);
      setTranslationError(error instanceof Error ? error.message : t('error.audioProcessingFailed'));
    } finally {
      setIsProcessingAudio(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get the appropriate text for speech
  const getSpeechText = () => {
    if (audioTranscription) return audioTranscription;
    if (language === 'hi-IN') return translatedContent;
    return content;
  };

  return (
    <div 
      className={`model-content ${isTranslating || isProcessingAudio ? 'translating' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      aria-live="polite"
      lang={language.split('-')[0]}
    >
      {isTranslating && (
        <div className="translation-indicator">
          {t('translating')}
        </div>
      )}

      {isProcessingAudio && (
        <div className="translation-indicator processing-audio">
          {t('processingAudio')}
        </div>
      )}
      
      {translationError && (
        <div className="translation-error">
          {t('translationError')}
        </div>
      )}
      
      <SpeakableElement 
        text={getSpeechText()}
        className="content"
      >
        <div className="content">
          {audioTranscription || translatedContent || content}
        </div>
      </SpeakableElement>
      
      {allowAudioUpload && (
        <div className="audio-upload-section">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAudioUpload} 
            accept="audio/*" 
            className="hidden-file-input" 
            aria-label={t('uploadAudioFile')}
          />
          <button 
            onClick={handleUploadClick}
            className="audio-upload-button"
            disabled={isProcessingAudio}
          >
            <Upload className="h-4 w-4 mr-2" />
            {t('uploadAudio')}
          </button>
          <span className="audio-format-note">
            {t('supportedFormats')}
          </span>
        </div>
      )}
      
      {isSpeaking && (
        <div className="speech-indicator">
          <Volume2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};