import {
  defaultValueCtx,
  Editor,
  editorStateOptionsCtx,
  inputRulesCtx,
} from "@milkdown/kit/core";
import { history } from "@milkdown/kit/plugin/history";
import { commands, keymap, plugins } from "@milkdown/kit/preset/commonmark";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/kit/preset/gfm";
import { MilkdownPlugin } from "@milkdown/ctx";
import {
  linkTooltipPlugin,
  configureLinkTooltip,
} from "@milkdown/kit/component/link-tooltip";

import { listItemBlockComponent } from "./view";
import { linkInputRuleCustom } from "./inputRules/link";
import { schema } from "./schema";
import { markInputRules, inputRules } from "./markInputRules";
import { customInputRulesRun } from "../utils/custom-input-rules";
import { Plugin } from "@milkdown/prose/state";
import { customInputRulesKey } from "@milkdown/prose";

export function EmptyLinePrefix(content: string | null) {
  if (content == null) {
    return null;
  }

  return content
    .replace(/\n\n/g, "<br/>\n\n")
    .replace(/([^\n])<br\/>\n/g, "$1\n\n");
}

const commonmark: MilkdownPlugin[] = [
  schema,
  inputRules,
  markInputRules,
  commands,
  keymap,
  plugins,
].flat();

class BasicEditor extends Editor {
  UpdateEditorContent(newContent: string | null) {
    if (newContent != null) {
      this.config((ctx) => {
        ctx.set(defaultValueCtx, newContent);
      });
      this.create();
    }
  }
}

export class TyporaEditor extends BasicEditor {
  static make() {
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
