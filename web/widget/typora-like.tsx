import React, { Component } from "react";

import {
  defaultValueCtx,
  Editor,
  editorStateOptionsCtx,
  editorViewOptionsCtx,
  inputRulesCtx,
  rootCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commands, keymap, plugins } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { getMarkdown } from "@milkdown/utils";
import { gfm } from "@milkdown/kit/preset/gfm";
import { MilkdownPlugin } from "@milkdown/ctx";
import {
  linkTooltipPlugin,
  configureLinkTooltip,
} from "@milkdown/kit/component/link-tooltip";

import style from "./milkdown.module.scss";

import { listItemBlockComponent } from "./view";
import { linkInputRuleCustom } from "./inputRules/link";
import { schema } from "./schema";
import { markInputRules, inputRules } from "./markInputRules";
import { customInputRulesRun } from "../utils/custom-input-rules";
import { Plugin } from "@milkdown/prose/state";
import { customInputRulesKey } from "@milkdown/prose";

interface DocState {
  editable: boolean;
}

interface MilkdownProps {
  editable?: boolean;
  defContent?: string;
  className?: string;
}

const commonmark: MilkdownPlugin[] = [
  schema,
  inputRules,
  markInputRules,
  commands,
  keymap,
  plugins,
].flat();

class MilkDownEditor extends React.Component<MilkdownProps, DocState> {
  private _editor: Editor;

  constructor(props: MilkdownProps) {
    super(props);
    this.state = {
      editable: this.props.editable != undefined ? this.props.editable : true,
    };

    this._editor = Editor.make()
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listItemBlockComponent)
      .use(linkInputRuleCustom)

      .config(configureLinkTooltip)
      .use(linkTooltipPlugin)

      .config((ctx) => {
        ctx.set(rootCtx, "#readme");
        ctx.set(editorViewOptionsCtx, {
          editable: () => this.state.editable,
        });
        ctx.set(editorStateOptionsCtx, (x) => {
          const rules = ctx.get(inputRulesCtx);
          x.plugins?.forEach((plugin: Plugin) => {
            if (plugin.spec.key == customInputRulesKey) {
              plugin.props.handleTextInput = (view, from, to, text) => {
                return customInputRulesRun(view, from, to, text, rules, plugin);
              };
            }
          });
          return x;
        });
      });

    this.UpdateEditorContent = this.UpdateEditorContent.bind(this);
    this.Content = this.Content.bind(this);

    document.onclick = (e) => {
      if (this.state.editable && e.target instanceof HTMLAnchorElement) {
        window.location.href = e.target.href;
      }
    };
  }

  EmptyLinePrefix(content: string | null) {
    if (content == null) {
      return null;
    }

    return content
      .replace(/\n\n/g, "<br/>\n\n")
      .replace(/([^\n])<br\/>\n/g, "$1\n\n");
  }

  UpdateEditorContent(newContent: string | null) {
    if (newContent != null) {
      this._editor.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
      });
      this._editor.create();
    }
  }

  Content() {
    return this._editor.action(getMarkdown());
  }

  componentDidMount() {
    const defContent = this.props.defContent ? this.props.defContent : "";
    this.UpdateEditorContent(this.EmptyLinePrefix(defContent));
    /** NOTE: create is an async function. if set content after create. will failed. */
    this._editor.create();
  }

  render() {
    return (
      <div
        id="readme"
        className={`${this.props.className}  ${style.container} markdown-body`}
      ></div>
    );
  }
}

export default MilkDownEditor;
