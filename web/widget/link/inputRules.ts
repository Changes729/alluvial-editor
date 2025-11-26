import { $inputRule } from "@milkdown/utils";
import { InputRule } from "@milkdown/prose/inputrules";
import * as commonmark from "@milkdown/preset-commonmark";

export const linkInputRuleCustom = $inputRule((ctx) => {
  const linkPattern =
    /(?<!\\|!)\[(?!!\[.*?\]\(.*?\))(.+?(?<!\\)(?:\\\\)*)\]\((.+?)(?:\s+['"](.+?)['"])?\)/;
  return new InputRule(linkPattern, (state, match, start, end) => {
    if (!match) return null;

    var [okay, text, href] = match;
    const { tr } = state;
    const markType = commonmark.linkSchema.type(ctx);

    if (!markType) return null;

    tr.removeMark(start, end);
    tr.insertText(text, start, end);
    tr.addMark(start, start + text.length, markType.create({ href }));
    return tr;
  });
});
