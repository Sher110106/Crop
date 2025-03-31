import { Language } from './language-context';

export const translations: Record<string, Record<Language, string>> = {
  // Common UI elements
  'displayLanguage': {
    'en-IN': 'Display Language',
    'hi-IN': 'प्रदर्शन भाषा'
  },
  'switchTo': {
    'en-IN': 'Switch to',
    'hi-IN': 'में बदलें'
  },
  'translating': {
    'en-IN': 'Translating...',
    'hi-IN': 'अनुवाद हो रहा है...'
  },
  'processingAudio': {
    'en-IN': 'Processing audio...',
    'hi-IN': 'ऑडियो प्रोसेसिंग...'
  },
  'translationError': {
    'en-IN': 'Translation error. Showing original content.',
    'hi-IN': 'अनुवाद त्रुटि। मूल सामग्री दिखाई जा रही है।'
  },
  'uploadAudio': {
    'en-IN': 'Upload Audio',
    'hi-IN': 'ऑडियो अपलोड करें'
  },
  'uploadAudioFile': {
    'en-IN': 'Upload audio file',
    'hi-IN': 'ऑडियो फ़ाइल अपलोड करें'
  },
  'supportedFormats': {
    'en-IN': 'Supported formats: MP3, WAV, FLAC, AAC, OGG',
    'hi-IN': 'समर्थित प्रारूप: MP3, WAV, FLAC, AAC, OGG'
  },
  'clickToHear': {
    'en-IN': 'Click to hear',
    'hi-IN': 'सुनने के लिए क्लिक करें'
  },
  'switchedToEnglish': {
    'en-IN': 'Switched to English',
    'hi-IN': 'अंग्रेजी में बदल गया'
  },
  'switchedToHindi': {
    'en-IN': 'Switched to Hindi',
    'hi-IN': 'हिंदी में बदल गया'
  },

  // Navigation
  'dashboard': {
    'en-IN': 'Dashboard',
    'hi-IN': 'डैशबोर्ड'
  },
  'settings': {
    'en-IN': 'Settings',
    'hi-IN': 'सेटिंग्स'
  },
  'profile': {
    'en-IN': 'Profile',
    'hi-IN': 'प्रोफ़ाइल'
  },
  'notifications': {
    'en-IN': 'Notifications',
    'hi-IN': 'सूचनाएं'
  },
  'logout': {
    'en-IN': 'Logout',
    'hi-IN': 'लॉग आउट'
  },

  // Actions
  'save': {
    'en-IN': 'Save',
    'hi-IN': 'सहेजें'
  },
  'cancel': {
    'en-IN': 'Cancel',
    'hi-IN': 'रद्द करें'
  },
  'delete': {
    'en-IN': 'Delete',
    'hi-IN': 'हटाएं'
  },
  'edit': {
    'en-IN': 'Edit',
    'hi-IN': 'संपादित करें'
  },
  'add': {
    'en-IN': 'Add',
    'hi-IN': 'जोड़ें'
  },

  // Form labels
  'name': {
    'en-IN': 'Name',
    'hi-IN': 'नाम'
  },
  'email': {
    'en-IN': 'Email',
    'hi-IN': 'ईमेल'
  },
  'password': {
    'en-IN': 'Password',
    'hi-IN': 'पासवर्ड'
  },
  'confirmPassword': {
    'en-IN': 'Confirm Password',
    'hi-IN': 'पासवर्ड की पुष्टि करें'
  },

  // Messages
  'success': {
    'en-IN': 'Success',
    'hi-IN': 'सफल'
  },
  'error': {
    'en-IN': 'Error',
    'hi-IN': 'त्रुटि'
  },
  'loading': {
    'en-IN': 'Loading...',
    'hi-IN': 'लोड हो रहा है...'
  },
  'noData': {
    'en-IN': 'No data available',
    'hi-IN': 'कोई डेटा उपलब्ध नहीं है'
  },

  // Error messages
  'error.invalidAudioFile': {
    'en-IN': 'Please upload a valid audio file',
    'hi-IN': 'कृपया एक मान्य ऑडियो फ़ाइल अपलोड करें'
  },
  'error.audioProcessingFailed': {
    'en-IN': 'Failed to process audio file',
    'hi-IN': 'ऑडियो फ़ाइल प्रोसेस करने में विफल'
  },
  'error.translationFailed': {
    'en-IN': 'Translation failed. Please try again.',
    'hi-IN': 'अनुवाद विफल। कृपया पुनः प्रयास करें।'
  },
  'error.networkError': {
    'en-IN': 'Network error. Please check your connection.',
    'hi-IN': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।'
  },
  'error.serverError': {
    'en-IN': 'Server error. Please try again later.',
    'hi-IN': 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।'
  },

  // Audio upload
  'audioUpload.title': {
    'en-IN': 'Upload Audio File',
    'hi-IN': 'ऑडियो फ़ाइल अपलोड करें'
  },
  'audioUpload.dragDrop': {
    'en-IN': 'Drag and drop audio file here or click to browse',
    'hi-IN': 'ऑडियो फ़ाइल को यहाँ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें'
  },
  'audioUpload.processing': {
    'en-IN': 'Processing audio file...',
    'hi-IN': 'ऑडियो फ़ाइल प्रोसेस हो रही है...'
  },
  'audioUpload.success': {
    'en-IN': 'Audio file processed successfully',
    'hi-IN': 'ऑडियो फ़ाइल सफलतापूर्वक प्रोसेस हो गई'
  },
  'audioUpload.error': {
    'en-IN': 'Error processing audio file',
    'hi-IN': 'ऑडियो फ़ाइल प्रोसेस करने में त्रुटि'
  },

  // Speech
  'speech.clickToHear': {
    'en-IN': 'Click to hear',
    'hi-IN': 'सुनने के लिए क्लिक करें'
  },
  'speech.hoverToHear': {
    'en-IN': 'Hover to hear',
    'hi-IN': 'सुनने के लिए होवर करें'
  },
  'speech.speaking': {
    'en-IN': 'Speaking...',
    'hi-IN': 'बोल रहा है...'
  },
  'speech.paused': {
    'en-IN': 'Speech paused',
    'hi-IN': 'भाषण रुका हुआ है'
  },
  'speech.stopped': {
    'en-IN': 'Speech stopped',
    'hi-IN': 'भाषण रुक गया'
  },

  // Accessibility
  'accessibility.speakable': {
    'en-IN': 'Click or hover to hear text',
    'hi-IN': 'टेक्स्ट सुनने के लिए क्लिक करें या होवर करें'
  },
  'accessibility.speaking': {
    'en-IN': 'Speaking text',
    'hi-IN': 'टेक्स्ट बोल रहा है'
  },
  'accessibility.paused': {
    'en-IN': 'Speech paused',
    'hi-IN': 'भाषण रुका हुआ है'
  },
  'accessibility.stopped': {
    'en-IN': 'Speech stopped',
    'hi-IN': 'भाषण रुक गया'
  }
}; 