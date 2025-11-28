import { Mark, MarkType } from "prosemirror-model";
import { Captured, Options } from "@milkdown/prose";

import { InputRule } from "prosemirror-inputrules";
import { spanSchema } from "../widget/node/span";
import { Ctx } from "@milkdown/ctx";

/// Create an input rule for a mark.
export function markRule(
  regexp: RegExp,
  markType: MarkType,
  ctx: Ctx,
  options: Options = {}
): InputRule {
  return new InputRule(regexp, (state, match, start, end) => {
    const { tr } = state;
    const matchLength = match.length;

    let group: string | undefined = match[matchLength - 1];
    let fullMatch = match[0];
    let initialStoredMarks: readonly Mark[] = [];

    const captured: Captured = {
      group,
      fullMatch,
      start,
      end,
    };

    const result = options.updateCaptured?.(captured);
    Object.assign(captured, result);
    ({ group, fullMatch, start, end } = captured);

    if (fullMatch === null) return null;

    if (group?.trim() === "") return null;

    if (group) {
      const startSpaces = fullMatch.search(/\S/);
      const textStart = start + fullMatch.indexOf(group);
      const textEnd = textStart + group.length;

      initialStoredMarks = tr.storedMarks ?? [];

      const attrs = options.getAttr?.(match);

      tr.addMark(start, textStart, spanSchema.type(ctx).create());

      if (textEnd < end) {
        tr.delete(textEnd, end);
        tr.insertText("**", textEnd);
        tr.addMark(
          textEnd,
          textEnd + "**".length,
          spanSchema.type(ctx).create()
        );
      }

      tr.addMark(textStart, textEnd, markType.create(attrs));
      tr.setStoredMarks(initialStoredMarks);

      options.beforeDispatch?.({ match, start, end, tr });
    }

    return tr;
  });
}
