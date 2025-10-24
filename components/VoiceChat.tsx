import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from "@google/genai";
import { Message } from '../types';

// Helper functions for audio encoding/decoding
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const VoiceChat: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const handleStartChat = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          inputAudioTranscription: {},
          responseModalities: [Modality.AUDIO], // Required but we won't process audio output
        },
        callbacks: {
          onopen: () => {
            console.log("Live session opened.");
            setIsConnected(true);
            setIsConnecting(false);
            
            // Fix: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(new Int16Array(inputData.map(f => f * 32768)).buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);
          },
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const { text, isFinal } = message.serverContent.inputTranscription;
              
              // Fix: Correctly handle incremental transcription updates.
              setMessages(prev => {
                const existingIndex = prev.findIndex(m => !m.isFinal);
                if (existingIndex !== -1) {
                  const updatedMessages = [...prev];
                  const currentMessage = updatedMessages[existingIndex];
                  updatedMessages[existingIndex] = {
                    ...currentMessage,
                    text: currentMessage.text + text,
                    isFinal
                  };
                  return updatedMessages;
                } else {
                  return [...prev, { id: Date.now(), text, isFinal }];
                }
              });
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error("Live session error:", e);
            setError("حدث خطأ في الاتصال.");
            handleStopChat();
          },
          onclose: (e: CloseEvent) => {
            console.log("Live session closed.");
            handleStopChat();
          },
        }
      });

    } catch (err) {
      console.error("Failed to start chat:", err);
      setError("لم يتمكن من الوصول إلى الميكروفون. يرجى السماح بالوصول.");
      setIsConnecting(false);
    }
  };

  const handleStopChat = useCallback(() => {
    sessionPromiseRef.current?.then(session => session.close());
    sessionPromiseRef.current = null;
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;

    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    
    audioContextRef.current?.close();
    audioContextRef.current = null;
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  useEffect(() => {
    return () => {
        handleStopChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full bg-gray-800/50 p-4 rounded-lg border-2 border-gray-600 flex flex-col shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-200">الدردشة الصوتية</h2>
      {!isConnected && !isConnecting && (
        <button onClick={handleStartChat} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-colors duration-200">
          بدء الدردشة الصوتية
        </button>
      )}
      {isConnecting && <div className="text-center text-yellow-400">جارِ الاتصال...</div>}
      {isConnected && (
         <button onClick={handleStopChat} className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors duration-200">
          إيقاف الدردشة الصوتية
        </button>
      )}
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      
      <div className="flex-grow mt-4 overflow-y-auto pr-2">
        <div className="flex flex-col gap-2 text-right">
            {messages.map((msg) => (
                <p key={msg.id} className={`p-2 rounded-md ${msg.isFinal ? 'bg-gray-700' : 'bg-gray-600 text-gray-400'}`}>
                    {msg.text}
                </p>
            ))}
        </div>
      </div>
       <div className="mt-4 text-center text-sm text-gray-500">
        الحالة: {isConnected ? <span className="text-green-400">متصل</span> : <span className="text-red-400">غير متصل</span>}
      </div>
    </div>
  );
};

export default VoiceChat;