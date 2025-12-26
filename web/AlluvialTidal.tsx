import React, { useEffect, useRef } from "react";

import { BasicEditorView, TidalEditor } from "./module.index";

function fileName(base64file: string) {
  const file = decodeURI(base64file);
  const indexOfSlash = file.indexOf(".");
  return indexOfSlash ? file.substring(0, indexOfSlash) : file;
}

export const AlluvialTidal: React.FC<{}> = ({}) => {
  var contentList = useRef<string[]>([]);
  const editor = useRef<TidalEditor>(TidalEditor.make());

  function saveFile() {
    console.log(editor.current.tidalData());
  }

  useEffect(() => {
    editor.current.initTidal([
      { str: "test" },
      { date: new Date(2025, 11, 1), str: "# Hello world" },
      { date: new Date(2025, 11, 0), str: "# Hello world 2" },
    ]);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "o" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFile();
    }
  }

  return (
    <div className="abstract-content-part" onKeyDown={onKeyDown}>
      <BasicEditorView editor={editor.current}></BasicEditorView>
    </div>
  );
};

export default AlluvialTidal;
