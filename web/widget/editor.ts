import {
  defaultValueCtx,
  Editor,
  editorStateOptionsCtx,
  EditorStatus,
  editorViewCtx,
  editorViewOptionsCtx,
  inputRulesCtx,
  parserCtx,
  schemaCtx,
  serializerCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/kit/preset/gfm";
import { MilkdownPlugin } from "@milkdown/ctx";
import {
  linkTooltipPlugin,
  configureLinkTooltip,
} from "@milkdown/kit/component/link-tooltip";

import { listItemBlockComponent } from "./view";
import { linkInputRuleCustom } from "./inputRules/link";
import { schema, tidalSchema } from "./config/schema";
import {
  markInputRules,
  inputRules,
  tidalInputRules,
} from "./config/markInputRules";
import { customInputRulesRun } from "../utils/custom-input-rules";
import { EditorState, Plugin, TextSelection } from "@milkdown/prose/state";
import { customInputRulesKey } from "@milkdown/prose";
import { commands, tidalCommands } from "./config/commands";
import { keymap, tidalKeymap } from "./config/keymap";
import { tidalPlugins, plugins } from "./config/plugins";
import { tidalDateView } from "./view/tidalDate";
import { tidalDatetimeSchema } from "./node/tidalDatetime";
import { Node as PmNode, Slice } from "prosemirror-model";
import { waitUntil } from "../utils/utils";
import { paragraphSchema } from "./node/paragraph";

export function EmptyLinePrefix(content: string | null) {
  if (content == null) {
    return null;
  }

  return content
    .replace(/\n\n/g, "<br/>\n\n")
    .replace(/([^\n])<br\/>\n/g, "$1\n\n");
}

class BasicEditor extends Editor {
  public editable?: (state: EditorState) => boolean;

  UpdateEditorContent(newContent: string | null) {
    if (newContent != null) {
      this.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
        ctx.set(editorViewOptionsCtx, {
          editable: this.editable,
        });
      });
      if (this.status != EditorStatus.Idle) this.create();
    }
  }

  CouldUpdate() {
    return this.status != EditorStatus.OnCreate;
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
      .use(listItemBlockComponent)
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

export type TidalData = {
  date?: Date;
  str: string;
};

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
      .use(listItemBlockComponent)
      .use(tidalDateView)
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
              plugin.props.handleKeyDown = (view, event) => {
                if (event.key == "ArrowDown" || event.key == "ArrowLeft") {
                  const { $anchor } = view.state.selection as TextSelection;
                  if ($anchor.pos == 0 && $anchor.depth == 0) {
                    view.dispatch(
                      view.state.tr.insert(
                        0,
                        paragraphSchema.type(ctx).create()
                      )
                    );
                  }
                }

                if (event.key !== "Enter") return false;
                const { $cursor } = view.state.selection as TextSelection;
                if ($cursor)
                  return customInputRulesRun(
                    view,
                    $cursor.pos,
                    $cursor.pos,
                    "\n",
                    rules,
                    plugin
                  );
                return false;
              };
            }
          });
          return x;
        });
      });
  }

  async initTidal(data: TidalData[]) {
    await waitUntil(() => this.status != EditorStatus.OnCreate);
    this.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const schema = ctx.get(schemaCtx);
      const parser = ctx.get(parserCtx);
      var content: PmNode[] = [];

      data.forEach((value) => {
        const doc = parser(value.str);
        if (value.date) {
          content.push(
            tidalDatetimeSchema.type(ctx).create({ date: value.date })
          );
        }
        for (let i = 0; i < doc.content.content.length; i++) {
          content.push(doc.child(i));
        }
      });
      const doc = schema.node("doc", null, content);

      const { state } = view;
      return view.dispatch(
        state.tr.replace(
          0,
          state.doc.content.size,
          new Slice(doc.content, 0, 0)
        )
      );
    });
  }

  tidalData(): TidalData[] {
    return this.action((ctx) => {
      let data: TidalData[] = [];
      const schema = ctx.get(schemaCtx);
      const view = ctx.get(editorViewCtx);
      const serializer = ctx.get(serializerCtx);
      const state = view.state;
      const doc = state.doc;
      const dates = view.dom.getElementsByTagName("h1");
      let curr_pos = 0;
      for (let i = 0; i < dates.length; ++i) {
        const pos = view.posAtDOM(dates[i], 0);
        const n = doc.nodeAt(curr_pos);
        if (pos != curr_pos) {
          let slice = state.doc.slice(curr_pos, pos, true);
          let doc = schema.topNodeType.createAndFill(null, slice.content);
          if (doc) {
            const str = serializer(doc);
            if (n?.type.name == tidalDatetimeSchema.type(ctx).name) {
              data.push({ date: n.attrs.date, str });
            } else {
              data.push({ str });
            }
            curr_pos = pos;
          }
        }
      }

      const n = doc.nodeAt(curr_pos);
      {
        let slice = state.doc.slice(curr_pos);
        let doc = schema.topNodeType.createAndFill(null, slice.content);
        if (doc) {
          const str = serializer(doc);
          if (n?.type.name == tidalDatetimeSchema.type(ctx).name) {
            data.push({ date: n.attrs.date, str });
          } else {
            data.push({ str });
          }
        }
      }

      return data;
    });
  }
}
