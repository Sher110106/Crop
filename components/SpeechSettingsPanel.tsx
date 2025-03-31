import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useSpeech } from '@/lib/speech-context';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SpeechSettingsPanelProps {
  className?: string;
}

/**
 * SpeechSettingsPanel component for controlling language and speech settings
 */
export const SpeechSettingsPanel: React.FC<SpeechSettingsPanelProps> = ({
  className = '',
}) => {
  const { settings, updateSettings, voices, isSpeechSupported, isSpeaking } = useSpeech();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Filter voices by current language
  const languageVoices = voices.filter(voice => 
    voice.lang.startsWith(language.split('-')[0])
  );

  // Set default voice for language if none selected
  useEffect(() => {
    if (languageVoices.length > 0 && !settings.selectedVoice) {
      updateSettings({ selectedVoice: languageVoices[0].name });
    }
  }, [language, languageVoices, settings.selectedVoice, updateSettings]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleSpeech = () => {
    updateSettings({ enabled: !settings.enabled });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ rate: parseFloat(e.target.value) });
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ pitch: parseFloat(e.target.value) });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ volume: parseFloat(e.target.value) });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ selectedVoice: e.target.value });
  };

  // Translation of UI elements based on current language
  const uiText = {
    title: language === 'en-IN' ? 'Accessibility Settings' : 'पहुंच सेटिंग्स',
    speechEnabled: language === 'en-IN' ? 'Enable Speech' : 'भाषण सक्षम करें',
    rate: language === 'en-IN' ? 'Speech Rate' : 'भाषण दर',
    pitch: language === 'en-IN' ? 'Speech Pitch' : 'भाषण पिच',
    volume: language === 'en-IN' ? 'Volume' : 'आवाज़',
    voice: language === 'en-IN' ? 'Voice' : 'आवाज',
    slower: language === 'en-IN' ? 'Slower' : 'धीमा',
    faster: language === 'en-IN' ? 'Faster' : 'तेज़',
    lower: language === 'en-IN' ? 'Lower' : 'कम',
    higher: language === 'en-IN' ? 'Higher' : 'अधिक',
    quieter: language === 'en-IN' ? 'Quieter' : 'शांत',
    louder: language === 'en-IN' ? 'Louder' : 'ज़ोर से',
    language: language === 'en-IN' ? 'Language' : 'भाषा',
    close: language === 'en-IN' ? 'Close' : 'बंद करें',
    noSpeechSupport: language === 'en-IN' 
      ? 'Speech synthesis is not supported in your browser.'
      : 'आपके ब्राउज़र में भाषण संश्लेषण समर्थित नहीं है.'
  };

  return (
    <div className={`speech-settings ${className}`}>
      <button 
        className="settings-toggle"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-label={isOpen 
          ? (language === 'en-IN' ? 'Close accessibility settings' : 'पहुंच सेटिंग्स बंद करें') 
          : (language === 'en-IN' ? 'Open accessibility settings' : 'पहुंच सेटिंग्स खोलें')
        }
      >
        <span role="img" aria-hidden="true">{isSpeaking ? '🔊' : '🔈'}</span>
      </button>

      {isOpen && (
        <div className="settings-panel" role="dialog" aria-label={uiText.title}>
          <h3>{uiText.title}</h3>

          <div className="setting-group language-setting">
            <label>{uiText.language}</label>
            <LanguageSwitcher />
          </div>

          {isSpeechSupported ? (
            <>
              <div className="setting-group">
                <label htmlFor="speech-enabled" className="checkbox-label">
                  <input
                    id="speech-enabled"
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={handleToggleSpeech}
                  />
                  <span>{uiText.speechEnabled}</span>
                </label>
              </div>

              {settings.enabled && (
                <>
                  <div className="setting-group">
                    <label htmlFor="speech-rate">
                      {uiText.rate}: {settings.rate.toFixed(1)}
                    </label>
                    <div className="slider-container">
                      <span className="slider-label">{uiText.slower}</span>
                      <input
                        id="speech-rate"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.rate}
                        onChange={handleRateChange}
                        aria-label={uiText.rate}
                      />
                      <span className="slider-label">{uiText.faster}</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="speech-pitch">
                      {uiText.pitch}: {settings.pitch.toFixed(1)}
                    </label>
                    <div className="slider-container">
                      <span className="slider-label">{uiText.lower}</span>
                      <input
                        id="speech-pitch"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.pitch}
                        onChange={handlePitchChange}
                        aria-label={uiText.pitch}
                      />
                      <span className="slider-label">{uiText.higher}</span>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="speech-volume">
                      {uiText.volume}: {settings.volume.toFixed(1)}
                    </label>
                    <div className="slider-container">
                      <span className="slider-label">{uiText.quieter}</span>
                      <input
                        id="speech-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.volume}
                        onChange={handleVolumeChange}
                        aria-label={uiText.volume}
                      />
                      <span className="slider-label">{uiText.louder}</span>
                    </div>
                  </div>

                  {languageVoices.length > 0 && (
                    <div className="setting-group">
                      <label htmlFor="speech-voice">
                        {uiText.voice}
                      </label>
                      <select
                        id="speech-voice"
                        value={settings.selectedVoice || ''}
                        onChange={handleVoiceChange}
                        aria-label={uiText.voice}
                      >
                        {languageVoices.map(voice => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="no-speech-support" role="alert">
              {uiText.noSpeechSupport}
            </div>
          )}

          <button 
            className="close-button"
            onClick={togglePanel}
            aria-label={uiText.close}
          >
            {uiText.close}
          </button>
        </div>
      )}
    </div>
  );
};