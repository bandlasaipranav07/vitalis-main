import { useState, useRef } from 'react';
import { generateSpeech } from '../services/ttsService';
import { pcmToWav } from '../utils/audio';

export function useVoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startListening = async (onAudioReady: (base64: string, mimeType: string) => Promise<void>) => {
    try {
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted.");
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/ogg;codecs=opus';

      console.log("Using MIME type:", mimeType);
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, processing audio...");
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Stop all tracks immediately
        stream.getTracks().forEach(track => track.stop());
        
        const processAudio = () => new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              console.log("Audio converted to base64, sending to AI...");
              await onAudioReady(base64Audio, mimeType);
              resolve();
            } catch (e) {
              reject(e);
            }
          };
          reader.onerror = reject;
        });

        try {
          await processAudio();
        } catch (e) {
          console.error("Audio processing failed:", e);
          setVoiceError("I couldn't process your recording. Try speaking again or use text chat.");
        }
      };

      mediaRecorder.start();
      setIsListening(true);
      setVoiceError(null);
    } catch (error: any) {
      console.error("Microphone access error:", error);
      
      let message = "Could not start recording. Please ensure your microphone is connected.";
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message = "Please grant microphone permission in your browser settings to use voice features.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        message = "No microphone detected. Please connect one and try again.";
      } else {
        message = "Microphone check: Is it plugged in? Try speaking closer to the microphone.";
      }
      
      setVoiceError(message);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = async (text: string, language: string = 'English') => {
    if (!isVoiceMode) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }

    setIsSpeaking(true);
    try {
      console.log("Generating speech for:", text.substring(0, 50) + "...");
      const result = await generateSpeech(text, language);
      if (result?.data && result?.mimeType) {
        console.log("Speech generated, MIME type:", result.mimeType);
        let audioSrc: string;
        
        // Handle PCM audio by wrapping it in a WAV header
        if (result.mimeType.includes('pcm')) {
          audioSrc = pcmToWav(result.data, 24000);
        } else {
          audioSrc = `data:${result.mimeType};base64,${result.data}`;
        }

        const audio = new Audio(audioSrc);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          if (audioSrc.startsWith('blob:')) {
            URL.revokeObjectURL(audioSrc);
          }
        };
        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setVoiceError("I had trouble playing the response. Please check your speakers or try again.");
          setIsSpeaking(false);
        };

        try {
          await audio.play();
          console.log("Audio playback started.");
        } catch (playError: any) {
          if (playError.name === 'NotAllowedError') {
            console.warn("Autoplay blocked.");
            setVoiceError("Audio is paused. Tap anywhere on the screen to hear the response.");
          } else {
            console.error("Play promise error:", playError);
            setVoiceError("There was an issue starting audio playback.");
          }
          setIsSpeaking(false);
        }
      } else {
        console.warn("No speech data received.");
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const toggleVoiceMode = () => {
    if (isVoiceMode && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
    setIsVoiceMode(!isVoiceMode);
  };

  return {
    isListening,
    isVoiceMode,
    isSpeaking,
    voiceError,
    setVoiceError,
    startListening,
    stopListening,
    speakText,
    toggleVoiceMode
  };
}
