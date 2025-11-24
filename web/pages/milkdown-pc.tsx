import React, { Component } from "react";

import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
import { gfm } from "@milkdown/kit/preset/gfm";
import "./milkdown.scss";

import { listItemBlockComponent } from "../widget/list-item-block";

interface DocState {}

class MilkDownEditor extends Component<{}, DocState> {
  private _editor: Editor;
  private _fileHandler: FileSystemFileHandle | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {};

    this._editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, "#readme");
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listItemBlockComponent);

    this._updateEditorContent = this._updateEditorContent.bind(this);

    this.onkeydown = this.onkeydown.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  _updateEditorContent(newContent: string | null) {
    if (newContent) {
      this._editor.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
      });
      this._editor.create();
    }
  }

  _fileAutoSave() {
    const content = this._editor.action(getMarkdown());
    localStorage.setItem("docContent", content);
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
              this._updateEditorContent(fileContent);
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
    const content = this._editor.action(getMarkdown());
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
      await writableStream.write(content);
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

  componentDidMount() {
    this._updateEditorContent(localStorage.getItem("docContent"));
    /** NOTE: create is an async function. if set content after create. will failed. */
    this._editor.create();
    setInterval(() => this._fileAutoSave(), 1000);
  }

  render() {
    return (
      <div
        id="readme"
        className="container markdown-body"
        onKeyDown={this.onkeydown}
      ></div>
    );
  }
}

export default MilkDownEditor;
