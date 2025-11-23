import React, { Component } from "react";

import {
  defaultValueCtx,
  Editor,
  rootCtx,
  rootDOMCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
// import "@milkdown/theme-nord/style.css";
import { gfm } from "@milkdown/kit/preset/gfm";
import "./milkdown.scss";

import { listItemBlockComponent } from "../widget/list-item-block";

interface DocState {
  title: string;
  doc: string;
}

class MilkDownEditor extends Component<{}, DocState> {
  private _editor?: Editor;
  private _content = React.createRef<HTMLDivElement>();

  constructor(props: {}) {
    super(props);
    this.state = {
      title: "Untitled",
      doc: `hello world`,
    };

    this.onclick = this.onclick.bind(this);
    this.onSendClick = this.onSendClick.bind(this);
  }

  onclick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.button === 0) {
      e.preventDefault();
      console.log("Left mouse button clicked");
      const content = this._editor!.action(getMarkdown());
      console.log("Document content to save:", content);
      // Implement your save logic here
    }
  }

  onSendClick() {
    if (this._editor) {
      const content = this._editor.action(getMarkdown());
      let newContentDiv = document.createElement("div");
      this._content.current!.appendChild(newContentDiv);
      const editor = Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, this._content.current!);
          ctx.set(defaultValueCtx, content);
        })
        .config(nord)
        .use(commonmark)
        .use(gfm)
        .use(history)
        .use(listItemBlockComponent);
      editor.create();

      this._editor.destroy();
    this._editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, "#editor");
        ctx.set(defaultValueCtx, "");
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listItemBlockComponent);
    this._editor.create();
    }
  }

  componentDidMount() {
    console.log("Mounting MilkDown Editor");
    this._editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, "#editor");
        ctx.set(defaultValueCtx, this.state.doc);
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listItemBlockComponent);
    this._editor.create();
  }

  render() {
    return (
      <div
        id="readme"
        className="container markdown-body"
        onClick={this.onclick}
      >
        <div className="head">{this.state.title}</div>
        <div className="content" ref={this._content}></div>
        <div className="input">
          <div id="editor"></div>
          <button id="Send-button" onClick={this.onSendClick}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default MilkDownEditor;
