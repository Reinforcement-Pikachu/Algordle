import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { allFuncs, allTests } from '../algos';
import { editor } from 'monaco-editor';
import Layout from "./Layout.jsx";
/*
three ways of grabbing monaco instance:
via onMount/beforeMount
via loader utility
via useMonaco hook
*/
/*
 */
const funcNames = Object.keys(allFuncs);
// let currAlgo = funcNames[Math.floor(Math.random() * (funcNames.length - 1))];

function Dashboard({user, setUser, selectedAlgo, isDarkMode, toggleTheme}) {
  console.log(selectedAlgo);

  const [currText, setCurrText] = useState("");
  useEffect(() => {
    if(selectedAlgo) {
      setCurrText(`function ${selectedAlgo.function_signature} {}`)
    }
  }, [selectedAlgo]);
  // const [currText, setCurrText] = useState(allFuncs[currAlgo].toString());
  const [terminal, setTerminal] = useState('//output');
  const [counter, setCounter] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const editorRef = useRef(null); // Store editor instance

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const editorContainer = editor.getContainerDomNode();
  
    // Initial opacity for fade effect
    editorContainer.style.transition = "opacity 0.5s ease-in-out";
    editorContainer.style.opacity = 0; // Fade out
  
    setTimeout(() => {
      editor.updateOptions({ theme: isDarkMode ? 'vs-dark' : 'vs-light' });
  
      setTimeout(() => {
        editorContainer.style.opacity = 1; // Fade back in after theme update
      }, 300); // Adjust delay for smooth effect
    }, 300); // Delay before changing theme
  
    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      setCurrText(text);
      console.log('Current text:', text);
    });
  };


  const submitSolution = async () => {
    if (!selectedAlgo) {
      console.error("No algorithm selected!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/evaluate", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          challengeName: selectedAlgo?.name,
          solution: currText,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Server Error: ${response.status} ${response.statusText}`
        );
      }
      let data;
      try {
        data = await response.json();
      } catch (error) {
        throw new Error(
          "Server did not return JSON. Response was: " + response.statusText
        );
      }
      setFeedback(data.result || "Error in evaluation");

      // test results
      let testOutput = `Results for ${selectedAlgo.name}:\n`;
      data.testResults.forEach((test) => {
        testOutput += `Test: ${test.test}\nExpected: ${test.expected}\nGot: ${
          test.actual
        }\nPassed: ${test.passed ? "✅" : "❌"}\n\n`;
      });
      
      // setTerminal((prevTerminal) => `${data.result}\n${prevTerminal}`);
      setTerminal((prevTerminal) => `${testOutput}\n${prevTerminal}`);

    } catch (err) {
      console.error('Error submiting solution:', err);
      setFeedback('Server error');
    }
  };

  async function Run() {

    // console.log(currentText: currText);
    //const override = `console.tempLog = console.log; \n console.log = function(value){return value;};\n`
    // const override = '';
    let output = '';
    let logs = '';
    const originalConsoleLog = console.log; // Store default console log prototype to actually use for logging to browser console and for reverting the prototype on line 60
    console.log = function(...args) { // reassign console.log prototype to allow the user to log their console logs to our output box
      const logMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '); // in case of multiple console logs iterate through
      logs += logMessage + '\n'; // append logs if there are mutliple
      originalConsoleLog.apply(console, args); // actually log to the browser console
    }
    try {
      const response = await fetch('http://localhost:3000/api/challenges');
      const data = await response.json();
      if (!selectedAlgo) {
        throw new Error('invalid algo selection');
      }
      // console.log("the algo", selectedAlgo);
      // console.log(data);
      let tests;
      for(let i = 0; i < data.length; i++){
        if(data[i].id == selectedAlgo.id) tests = data[i].tests;
      }
      // const executeCode = new Function(currText);
      // console.log(Object.values(tests));
          for (let i = 0; i < Object.values(tests).length; i++) {
            //run all tests
            output += `${Object.values(tests)[i]} ==> ${eval(currText + Object.values(tests)[i])}\n`;
            //  output += `${executeCode()}\n`
      }
  
  
    } catch (err) {
      output += `Error: ${err.message}\n` // log errors when there are any
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
    <Layout user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} setUser={setUser}>
       <h1>Welcome, {user.username}!</h1>
    <div id='main'>
      <h1>code editor here!</h1>
      <Editor
        height='60vh'
        defaultLanguage='javascript'
        defaultValue={currText}
        onMount={handleEditorDidMount}
        theme={isDarkMode ? 'vs-dark' : 'vs-light'}
      />
      <div>
        <textarea readOnly rows={10} cols={50} value={terminal} className={isDarkMode ? 'dark-mode-textarea' : 'light-mode-textarea'}></textarea>
        <button className='clear-btn' onClick={Clear}>X</button>
        <button className='run-btn' onClick={Run}>Run</button>
        <button className='submit-btn' onClick={submitSolution}>Submit Code</button>
        {/* {user && <button onClick={handleLogout}>Logout</button>}   */}
        {feedback && `Feedback: ${feedback}`} 
      </div>
      {feedback && <p>Feedback: {feedback}</p>} 
    </div>
    </Layout>
  );
}

export default Dashboard;
