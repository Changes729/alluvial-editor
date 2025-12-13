import {
  DefaultValue,
  defaultValueCtx,
  Editor,
  editorStateOptionsCtx,
  EditorStatus,
  editorViewCtx,
  getDoc,
  inputRulesCtx,
  parserCtx,
  schemaCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/kit/preset/gfm";
import { Ctx, MilkdownPlugin } from "@milkdown/ctx";
import {
  linkTooltipPlugin,
  configureLinkTooltip,
} from "@milkdown/kit/component/link-tooltip";

import { CustomViewComponent } from "./view";
import { linkInputRuleCustom } from "./inputRules/link";
import { schema, tidalSchema } from "./config/schema";
import {
  markInputRules,
  inputRules,
  tidalInputRules,
} from "./config/markInputRules";
import { customInputRulesRun } from "../utils/custom-input-rules";
import { Plugin } from "@milkdown/prose/state";
import { customInputRulesKey } from "@milkdown/prose";
import { commands, tidalCommands } from "./config/commands";
import { keymap, tidalKeymap } from "./config/keymap";
import { tidalPlugins, plugins } from "./config/plugins";
import { Node } from "prosemirror-model";

export function EmptyLinePrefix(content: string | null) {
  if (content == null) {
    return "";
  }

  return content
    .replace(/\n\n/g, "<br/>\n\n")
    .replace(/([^\n])<br\/>\n/g, "$1\n\n");
}

class BasicEditor extends Editor {
  UpdateEditorContent(newContent: string | null) {
    if (newContent != null) {
      this.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
      });
      if (this.status != EditorStatus.Idle) this.create();
    }
  }
}

export class TyporaEditor extends BasicEditor {
  static make() {
    const commonmark: MilkdownPlugin[] = [
      schema,
      inputRules,
      markInputRules,
      commands,
      keymap,
      plugins,
    ].flat();

    return new TyporaEditor()
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(CustomViewComponent)
      .use(linkInputRuleCustom)

      .config(configureLinkTooltip)
      .use(linkTooltipPlugin)

      .config((ctx) => {
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
  }
}

export class TidalEditor extends BasicEditor {
  static make() {
    const commonmark: MilkdownPlugin[] = [
      tidalSchema,
      tidalInputRules,
      markInputRules,
      tidalCommands,
      tidalKeymap,
      tidalPlugins,
    ].flat();

    return new TidalEditor()
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(CustomViewComponent)
      .use(linkInputRuleCustom)

      .config(configureLinkTooltip)
      .use(linkTooltipPlugin)

      .config((ctx) => {
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
  }

  docInit(doc: Node) {
    var rebuild = false;
    if (this.status != EditorStatus.Idle) {
      rebuild = true;
    }

    this.config((ctx) => {
      ctx.set(editorStateOptionsCtx, (x) => {
        x.doc = doc;
        return x;
      });
    });

    if (rebuild) {
      this.create();
    }
  }

  toDoc(markdown: DefaultValue): Node {
    const ctx = this.ctx;
    const schema = ctx.get(schemaCtx);
    const parser = ctx.get(parserCtx);
    return getDoc(markdown, parser, schema);
  }

  titleNode(content: string, children: Node[]): Node {
    const ctx = this.ctx;
    const schema = ctx.get(schemaCtx);
    return schema.node("heading", { level: 0, id: content }, children);
  }

  docNode(children: Node[]): Node {
    const ctx = this.ctx;
    const schema = ctx.get(schemaCtx);
    return schema.node("doc", null, children);
  }
}

export function loadContent(markdown: string, title?: string) {
  return (ctx: Ctx): Node => {
    const view = ctx.get(editorViewCtx);
    const schema = ctx.get(schemaCtx);
    const parser = ctx.get(parserCtx);
    const doc = getDoc(markdown, parser, schema);
    var children: Node[] = [];
    doc.forEach((child) => {
      children = [...children, child];
    });

    return schema.node(
      "doc",
      null,
      title
        ? [schema.node("alluvialDoc", { title: title }, children)]
        : children
    );
  };
}
