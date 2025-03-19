import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { allFuncs, allTests } from '../algos';
import { editor } from 'monaco-editor';

/*
three ways of grabbing monaco instance:
via onMount/beforeMount
via loader utility
via useMonaco hook
*/
/*
 */
const funcNames = Object.keys(allFuncs);
let currAlgo = funcNames[Math.floor(Math.random() * (funcNames.length - 1))];

function Dashboard({user, setUser}) {
  const [currText, setCurrText] = useState(allFuncs[currAlgo].toString());
  const [terminal, setTerminal] = useState('//output');
  const [counter, setCounter] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const editorRef = useRef(null); // Store editor instance

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // console.log("Editor mounted:", editorRef.current); // Debugging log

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      setCurrText(text);
      console.log('Current text:', text);
    });
  }
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  const submitSolution = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({ challengeName: currAlgo, solution: currText }),
      });
      const data = await response.json();
      setFeedback(data.result || 'Error in evaluation');
      setTerminal(prevTerminal => `${data.result}\n${prevTerminal}`);
    } catch (err) {
      console.error('Error submiting solution:', err);
      setFeedback('Server error');
    }
  };

  async function Run() {

    // console.log(currentText: currText);
    //const override = `console.tempLog = console.log; \n console.log = function(value){return value;};\n`
    const override = '';
    let output = '';
    let logs = '';
    const originalConsoleLog = console.log; // Store default console log prototype to actually use for logging to browser console and for reverting the prototype on line 60
    console.log = function(...args) { // reassign console.log prototype to allow the user to log their console logs to our output box
      const logMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '); // in case of multiple console logs iterate through
      logs += logMessage + '\n'; // append logs if there are mutliple
      originalConsoleLog.apply(console, args); // actually log to the browser console
    }
    try {
          for (let i = 0; i < allTests[currAlgo].length; i++) {
            // run all tests
      output += `${eval(override + '\n' + currText + allTests[currAlgo][i])}\n`;
    }

  
    } catch (err) {
      output += `Error: ${error.message}\n` // log errors when there are any
    } finally {
      console.log = originalConsoleLog; // revert console.log prototype back to default
    }
    // console.log(output);
    setCounter(counter + 1);
    setTerminal(`${feedback ? feedback + '\n': ''}=== logs${counter} === \n${logs}\n=== results${counter}===\n${output}\n${terminal}`); // display output
    // let func = currText;
    // console.log(func([1,2,3,4,5], 9));
  }
  
  function Clear(){
    setCounter(1);
    setTerminal('//output');
    setFeedback(null); //clear feeback when output cleared
  }


  return (
    <div id='main'>
      <h1>code editor here!</h1>
      <Editor
        height='60vh'
        defaultLanguage='javascript'
        defaultValue={currText}
        onMount={handleEditorDidMount}
      />
      <div>
        <textarea readOnly rows={10} cols={50} value={terminal}></textarea>
        <button onClick={Run}>Run</button>
        <button onClick={Clear}>Clear</button>
        <button onClick={submitSolution}>Submit Code</button>
      </div>
      {feedback && <p>Feedback: {feedback}</p>} 
      {user && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
}

export default Dashboard;
