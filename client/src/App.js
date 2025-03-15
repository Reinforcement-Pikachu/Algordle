import React, {useRef,useState} from "react";
import Editor from "@monaco-editor/react";
import exObj from "../algos";
import { editor } from "monaco-editor";

/*
three ways of grabbing monaco instance:
via onMount/beforeMount
via loader utility
via useMonaco hook
*/
/*
  */
 function App(){
    const testAlgo = exObj;
    let terminal;
    const [currText, setCurrText] = useState(exObj);
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
        setCurrText(currText + "console.log(twoSum([1,2,3,4,5], 51));")
        terminal = eval(currText) ? "true": "false";
        // let func = currText;
        // console.log(func([1,2,3,4,5], 9));
    }

    return(
        <div>
            <h1>code editor here?</h1>
            <Editor height = "60vh" defaultLanguage="javascript" defaultValue={testAlgo} onMount={handleEditorDidMount}/>
            <div>
                <textarea rows={4} cols={50} value={terminal}></textarea>
                <button onClick={Run}>Run</button>
            </div>
        </div>
        
    )
}

export default App;