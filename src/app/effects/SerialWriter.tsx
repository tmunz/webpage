import React, { useState, useEffect, useRef } from 'react';

interface SerialWriterProps {
  content: string;
  delay?: number;
  contentId?: string | number;
}

export const SerialWriter = ({ content, delay = 0, contentId = 0 }: SerialWriterProps) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const indexRef = useRef<number>(0);
  useEffect(() => {
    const updateText = () => {
      const intervalId = setInterval(() => {
        setDisplayedText(content.slice(0, indexRef.current + 1));
        indexRef.current++;
        if (indexRef.current >= content.length) {
          clearInterval(intervalId);
        }
      }, delay);

      return () => clearInterval(intervalId);
    };

    if (indexRef.current < content.length) {
      updateText();
    }
  }, [content, delay]);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText('');
  }, [contentId]);

  const renderTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}<br />
      </React.Fragment>
    ));
  };

  return <span>{renderTextWithLineBreaks(displayedText)}</span>;
};
