import { $markAttr, $markSchema } from "@milkdown/utils";

import { withMeta } from "../../utils/meta";
import { editorViewCtx } from "@milkdown/core";
import { Ctx } from "@milkdown/ctx";
import { remarkPreserveEmptyLinePlugin } from "@milkdown/preset-commonmark";
import { serializeText } from "../../utils/serialize-text";
import { strongSchema } from "./strong";

export const spanAttr = $markAttr("span");

withMeta(spanAttr, {
  displayName: "Attr<span>",
  group: "span",
});

export const spanSchema = $markSchema("span", (ctx) => ({
  inline: true,
  content: "inline*",
  group: "inline",
  attrs: {
    pair: { default: false, validate: Boolean },
  },
  parseDOM: [{ tag: "span" }],
  toDOM: (mark) => {
    console.log(mark);
    return ["span", ctx.get(spanAttr.key)(mark)];
  },
  parseMarkdown: {
    match: (node) => false,
    runner: (state, node, type) => {
      state.openMark(type, { pair: true });
      state.addText("**");
      state.closeMark(type);

      state.openMark(strongSchema.type(ctx));
      state.next(node.children);
      state.closeMark(strongSchema.type(ctx));

      state.openMark(type, { pair: true });
      state.addText("**");
      state.closeMark(type);
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "span",
    runner: (state, mark) => {
      if (!mark.attrs.pair) {
        state.withMark(mark, "span", undefined, {
          hidden: true,
        });
        // state.next(mark.content);
      }
    },
  },
}));

function shouldPreserveEmptyLine(ctx: Ctx) {
  let shouldPreserveEmptyLine = false;
  try {
    ctx.get(remarkPreserveEmptyLinePlugin.id);
    shouldPreserveEmptyLine = true;
  } catch {
    shouldPreserveEmptyLine = false;
  }
  return shouldPreserveEmptyLine;
}

withMeta(spanSchema.mark, {
  displayName: "NodeSchema<span>",
  group: "Text",
});

withMeta(spanSchema.ctx, {
  displayName: "NodeSchemaCtx<span>",
  group: "Text",
});
