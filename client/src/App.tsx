import React, { useState, useRef, RefObject, useCallback } from "react";
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import "./App.css";
import { useLocalStorage } from "./hooks/storage";
import Resizer from "./components/Resizer";
import { useThottle } from "./hooks/debounce";

const DEFAULT_HTML =
  `<!DOCTYPE html><html><head><style>body{margin: 20px; font-family: Arial, sans-serif;}` +
  `.container{max-width: 500px; margin: 0 auto;}h2{margin-bottom: 5px;}</style></head><body><div class="container">` +
  `<img src="${window.location.protocol}//${window.location.hostname}/pen.png" height="50" alt="Pen"/>` +
  `<p>Turn your ideas into ... lol. Just kidding. Do whatever you want</p><p><i>Now type some code to get ` +
  `rid of this dumb page.</i></p><h2>What is that?</h2> <p>This is a website for lazy devs like me to test html code. ` +
  `For example test how the email will look like.</p><h2>Who developed that</h2>` +
  `<p><a href="https://github.com/TheMisir" target="_blank">Me</a></p><h2>Found a bug?</h2> <p>¯\\_(ツ)_/¯</p><hr/>` +
  `<p><small><a href="" target="_blank">Want to contribute?</a></small></p></div></body></html>`;

const DEFAULT_PAGE = URL.createObjectURL(
  new Blob([DEFAULT_HTML], { type: "text/html" })
);

const App: React.FC = () => {
  const editorRef = useRef<MonacoEditor>() as RefObject<MonacoEditor>;
  const editor = editorRef.current?.editor;
  const [frameUrl, setFrameUrl] = useState(DEFAULT_PAGE);
  const [editorWidth, setEditorWidth, saveEditorWidth] = useLocalStorage(
    "editor_width",
    0.5
  );

  const setPreview = useCallback(
    (html: string | null | undefined) => {
      let url = DEFAULT_PAGE;

      if (html) {
        url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      }

      setFrameUrl((current) => {
        current !== DEFAULT_PAGE && URL.revokeObjectURL(current);
        return url;
      });
    },
    [setFrameUrl]
  );

  const refreshPreview = useThottle(
    useCallback(() => {
      setPreview(editor?.getValue());
    }, [editor, setPreview]),
    2000
  );

  const editorDidMount: EditorDidMount = (editor) => {
    editor.focus();
    let model = editor.getModel();
    model?.updateOptions({ insertSpaces: true, tabSize: 2 });
    editor.setModel(model);
  };

  const workspaceWidth = (document.body.clientWidth - 10) * editorWidth;

  return (
    <div className="app">
      <div className="workspace" style={{ width: workspaceWidth }}>
        <MonacoEditor
          ref={editorRef}
          language="html"
          theme="vs-dark"
          editorDidMount={editorDidMount}
          width={workspaceWidth}
          onChange={refreshPreview}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
      <Resizer
        value={editorWidth}
        onResize={setEditorWidth}
        onStopResize={() => saveEditorWidth()}
      />
      <div className="preview">
        <iframe src={frameUrl} title="Preview" />
      </div>
    </div>
  );
};

export default App;
