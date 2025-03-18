import React, {useRef,useState} from "react";
import Editor from "@monaco-editor/react";
import { allFuncs, allTests } from "./algos";
import { editor } from "monaco-editor";

/*
three ways of grabbing monaco instance:
via onMount/beforeMount
via loader utility
via useMonaco hook
*/
/*
  */
const funcNames = Object.keys(allFuncs);
let currAlgo = funcNames[Math.floor(Math.random()*(funcNames.length-1))];
 function App(){
    const [currText, setCurrText] = useState(allFuncs[currAlgo].toString());
    const [terminal, setTerminal] = useState("//Terminal Here");
    const editorRef = useRef(null); // Store editor instance
    
    
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

        // console.log("Editor mounted:", editorRef.current); // Debugging log

        // Listen for content changes
        editor.onDidChangeModelContent(() => {
            const text = editor.getValue();
            setCurrText(text);
            console.log("Current text:", text);
        });
    }
    
    

    function Run(){
        console.log(currText);
        let output = '';
        for(let i = 0; i < allTests[currAlgo].length; i++){
            output += `${eval(currText + allTests[currAlgo][i])}\n`
            console.log(currText + allTests[currAlgo][i]);
        }
        setTerminal(`${output}
${terminal}`);
        // let func = currText;
        // console.log(func([1,2,3,4,5], 9));
    }

    return(
        <div id="main">
            <h1>code editor here!</h1>
            <Editor height = "60vh" defaultLanguage="javascript" defaultValue={currText} onMount={handleEditorDidMount}/>
            <div>
                <textarea readOnly rows={10} cols={50} value={terminal}></textarea>
                <button onClick={Run}>Run</button>
            </div>
        </div>
        
    )
}

export default App;