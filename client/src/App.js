import React, {useRef} from "react";
import Editor from "@monaco-editor/react";
import exObj from "../algos";
// import { editor } from "monaco-editor";

/*
three ways of grabbing monaco instance:
via onMount/beforeMount
via loader utility
via useMonaco hook
*/
/*
function handleEditorDidMount(editor, monaco) {
    console.log("Editor instance:", editor);
    console.log("Current text:", editor.getValue());
}
  */
 function App(){
    // const editorRef = useRef(null); // Reference for the editor instance
    
    const testAlgo = exObj[0].toString();

    // function handleEditorDidMount(editor, monaco) {
    //     editorRef.current = editor; // Store the editor instance
    //     console.log("Monaco Editor instance:", monaco);
    // }
    
    // useEffect(() => {
    //     if (monaco) {
    //       console.log('here is the monaco instance:', monaco);
    //     }
    //   }, [monaco]);

    return(
        <div>
            <h1>code editor here?</h1>
            <Editor height = "60vh" defaultLanguage="javascript" defaultValue={testAlgo}/>
            <div>
                <button>Run</button>
            </div>
        </div>
        
    )
}

export default App;