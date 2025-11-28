import type { InputRule } from "prosemirror-inputrules";
import { EditorState, TextSelection, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import { Plugin } from "prosemirror-state";

export function customInputRulesRun(
  view: EditorView,
  from: number,
  to: number,
  text: string,
  rules: InputRule[],
  plugin: Plugin
) {
  if (view.composing) return false;
  const state = view.state;
  const $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) return false;
  const textBefore =
    $from.parent.textBetween(
      Math.max(0, $from.parentOffset - 500),
      $from.parentOffset,
      undefined,
      "\uFFFC"
    ) + text;
  for (let _matcher of rules) {
    const matcher = _matcher as unknown as {
      match: RegExp;
      handler: (
        state: EditorState,
        match: string[],
        from: number,
        to: number
      ) => Transaction;
      undoable?: boolean;
    };
    const match = matcher.match.exec(textBefore);
    const tr =
      match &&
      match[0] &&
      matcher.handler(state, match, from - (match[0].length - text.length), to);
    if (!tr) continue;
    if (matcher.undoable !== false)
      tr.setMeta(plugin, { transform: tr, from, to, text });
    view.dispatch(tr);
    return true;
  }
  return false;
}
