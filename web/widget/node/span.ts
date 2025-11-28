import { $nodeAttr, $nodeSchema } from "@milkdown/utils";

import { withMeta } from "../../utils/meta";
import { editorViewCtx } from "@milkdown/core";
import { Ctx } from "@milkdown/ctx";
import { remarkPreserveEmptyLinePlugin } from "@milkdown/preset-commonmark";
import { serializeText } from "../../utils/serialize-text";

export const spanAttr = $nodeAttr("span");

withMeta(spanAttr, {
  displayName: "Attr<span>",
  group: "span",
});

export const spanSchema = $nodeSchema("span", (ctx) => ({
  inline: true,
  content: "text*",
  group: "inline",
  parseDOM: [{ tag: "span" }],
  toDOM: (node) => {
    console.log(node);
    return ["span", ctx.get(spanAttr.key)(node), 0];
  },
  parseMarkdown: {
    match: () => false,
    runner: () => {},
  },
  toMarkdown: {
    match: (node) => node.type.name === "span",
    runner: (state, node) => {
      const view = ctx.get(editorViewCtx);
      const lastNode = view.state?.doc.lastChild;
      if (
        (!node.content || node.content.size === 0) &&
        node !== lastNode &&
        shouldPreserveEmptyLine(ctx)
      ) {
        state.addNode("text", undefined, "\n");
      } else {
        serializeText(state, node);
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

withMeta(spanSchema.node, {
  displayName: "NodeSchema<span>",
  group: "Text",
});

withMeta(spanSchema.ctx, {
  displayName: "NodeSchemaCtx<span>",
  group: "Text",
});
