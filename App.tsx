import React, { useState, useEffect, useCallback } from 'react';
import { AppMode } from './types';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { APP_MODES } from './constants';

// SpeechRecognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any | null = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
}

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.REASONING);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const activeMode = APP_MODES.find(m => m.id === currentMode) || APP_MODES[0];

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        setInputText(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
    };

    return () => { 
      if (recognition) {
        recognition.abort();
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
      }
    };
  }, []);
  
  const handleVoiceInput = () => {
    if (!recognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    };

    if (isListening) {
      recognition.stop();
    } else {
      setInputText('');
      setIsListening(true);
      recognition.start();
    }
  };

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
    setInputText(''); // Clear input when changing modes
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentMode={currentMode} onModeChange={handleModeChange} />
      <main className="flex-1 flex flex-col">
        <ChatWindow 
          key={currentMode} // Use key to reset chat state when mode changes
          mode={activeMode}
          inputText={inputText}
          onInputChange={setInputText}
          isListening={isListening}
          onVoiceInput={handleVoiceInput}
        />
      </main>
    </div>
  );
};

export default App;
