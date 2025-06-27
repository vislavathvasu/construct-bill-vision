
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, className = "" }) => {
  const { toast } = useToast();

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    speechSynthesis.speak(utterance);
  };

  return (
    <Button
      onClick={speak}
      variant="outline"
      size="sm"
      className={`shrink-0 ${className}`}
    >
      <Volume2 size={16} className="mr-1" />
      Speak
    </Button>
  );
};

export default TextToSpeech;
