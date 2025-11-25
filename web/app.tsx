import React, { Component, ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index.scss";
import MilkdownPhone from "./pages/milkdown-phone";
import Milkdown from "./widget/milkdown";
import { getDeviceInfos } from "./utils/dev-infos";

class MilkdownPC extends Component<{}, {}> {
  private _fileHandler: FileSystemFileHandle | null = null;
  private _editor = React.createRef<Milkdown>();

  constructor(props: {}) {
    super(props);

    this.onkeydown = this.onkeydown.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  async openFile() {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker();
      if (fileHandle) {
        fileHandle.getFile().then((file: File) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileContent = event.target?.result;
            if (typeof fileContent === "string") {
              this._fileHandler = fileHandle;
              this._editor.current?.UpdateEditorContent(fileContent);
            }
          };
          reader.readAsText(file);
        });
      }
    } catch (error) {
      console.error("Error during file open:", error);
    }
  }

  async saveFile() {
    const content = this._editor.current?.Content();
    try {
      if (!this._fileHandler) {
        this._fileHandler = await (window as any).showSaveFilePicker({
          suggestedName: "untitled.md",
          types: [
            {
              description: "Text Files",
            },
          ],
        });
      }

      const writableStream = await this._fileHandler!.createWritable();
      await writableStream.write(content ? content : "");
      await writableStream.close();
      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }

  onkeydown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "o" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.openFile();
    } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.saveFile();
    }
  }

  render() {
    return (
      <div className="home" onKeyDown={this.onkeydown}>
        <Milkdown ref={this._editor}></Milkdown>
      </div>
    );
  }
}

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            getDeviceInfos().isMobile ? <MilkdownPhone /> : <MilkdownPC />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  ReactDOM.createRoot(document.body).render(<App />);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (e.key === "o" || e.key === "O")) {
      e.preventDefault();
      console.log("Ctrl+O pressed! Executing custom action.");
    } else if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      console.log("Ctrl+S pressed! Executing custom save action.");
    }
  });
};
