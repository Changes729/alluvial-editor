import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index.scss";
import { EmptyLinePrefix, TyporaEditor } from "./widget/editor";
import { getMarkdown } from "@milkdown/utils";
import { BasicEditorView } from "./module.index";

export const TyporaEditorView: React.FC<{}> = ({}) => {
  var fileHandler: FileSystemFileHandle | null = null;
  const _editor = useRef<TyporaEditor>(TyporaEditor.make());

  async function openFile() {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker();
      if (fileHandle) {
        fileHandle.getFile().then((file: File) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target?.result;
            if (typeof fileContent === "string") {
              fileHandler = fileHandle;
              _editor.current.UpdateEditorContent(EmptyLinePrefix(fileContent));
            }
          };
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error("Error during file open:", error);
    }
  }

  async function saveFile() {
    const content = _editor.current.action(getMarkdown());
    try {
      if (!fileHandler) {
        fileHandler = await (window as any).showSaveFilePicker({
          suggestedName: "untitled.md",
          types: [
            {
              description: "Text Files",
            },
          ],
        });
      }

      const writableStream = await fileHandler!.createWritable();
      await writableStream.write(content ? content : "");
      await writableStream.close();
      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  function onkeydown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "o" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      openFile();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFile();
    }
  }

  function _fileAutoSave() {
    localStorage.setItem("docContent", _editor.current.action(getMarkdown()));
  }

  useEffect(() => {
    if (fileHandler == null) {
      _editor.current.UpdateEditorContent(
        EmptyLinePrefix(localStorage.getItem("docContent"))
      );
    }
    _editor.current.create();
    setInterval(() => _fileAutoSave(), 1000);
  });

  return (
    <div className="home" onKeyDown={onkeydown}>
      <BasicEditorView editor={_editor.current}></BasicEditorView>
    </div>
  );
};
