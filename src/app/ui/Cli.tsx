import './Cli.styl';

import React, { useState, useEffect } from 'react';
import figlet from 'figlet';
// @ts-ignore
import standard from 'figlet/importable-fonts/Standard.js';

interface Props {
  cmds: (input: string) => string;
  title?: string;
  welcomeMessage?: string;
  promptLabel: string;
}

const figletText = async (text: string): Promise<string> => {
  figlet.parseFont("Standard", standard);
  return new Promise(resolve => {
    figlet.text(text, { font: "Standard" }, (err: any, data: any) => resolve(data));
  });
}

export const Cli = (props: Props) => {
  const [newLineValue, setNewLineValue] = useState<string>('');
  const [historyCommands, setHistoryCommands] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const [oldValueLength, setOldValueLength] = useState<number>(0);
  const elem = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (elem.current !== null) {
      elem.current.scrollTop = elem.current?.scrollHeight;
    }
  });

  useEffect(() => {
    // elem.current?.focus();
    (async () => {
      const title = await figletText(props.title ? props.title : '');
      clear();
      const welcomeText = `${title ? title + '\n\n' : ''}${props.welcomeMessage ? props.welcomeMessage : ''}\n${props.promptLabel} `;
      print(welcomeText);
    })();
  }, []);

  useEffect(() => {
    if (historyIndex !== 0) {
      setNewLineValue(historyCommands[historyCommands.length - historyIndex])
      setValue(`${value.slice(0, oldValueLength)}${historyCommands[historyCommands.length - historyIndex]}`)
    }
  }, [historyIndex]);

  const onSumbit = (input: string) => {
    setOldValueLength(previeousLength => previeousLength + input.length)
    print(`\n${props.cmds(input)}\n${props.promptLabel} `);
  }

  const clear = () => {
    setValue('');
    setOldValueLength(0);
  }

  const print = (text: string) => {
    setValue(previousMessages => `${previousMessages}${text}`);
    setOldValueLength(previeousLength => previeousLength + text.length);
  }

  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (target.selectionStart < oldValueLength) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        e.preventDefault()
      }
    }
    if (e.key === 'Backspace') {
      if (target.selectionStart === oldValueLength) {
        e.preventDefault()
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < historyCommands.length) {
        setHistoryIndex(historyIndex + 1);
      } else {
        return;
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 1) {
        setHistoryIndex(historyIndex - 1);
      } else {
        return;
      }
    }
    if (e.key === 'Enter' && e.shiftKey === false) { // enter
      e.preventDefault();
      if (newLineValue !== '' && newLineValue !== undefined) {
        onSumbit(newLineValue)
        setHistoryCommands([...historyCommands, newLineValue]);
        setHistoryIndex(0);
        setNewLineValue('');
      }
    }
  }

  return (
    <textarea
      className='cli'
      ref={elem}
      spellCheck="false"
      value={value}
      onChange={(e) => { setValue(e.target.value); setNewLineValue(e.target.value.slice(oldValueLength)) }}
      onKeyDown={onKeyDown} >
    </textarea>
  )
}

