import type { $NodeSchema } from '@milkdown/utils'
import { $nodeAttr, $nodeSchema } from "@milkdown/utils";
import { withMeta } from "../../utils/meta";

export const alluvialDocAttr = $nodeAttr("alluvialDoc");

withMeta(alluvialDocAttr, {
  displayName: "Attr<alluvialDoc>",
  group: "AlluvialDoc",
});

/// The top-level document node.
export const alluvialDocSchema = $nodeSchema("alluvialDoc", (ctx) => ({
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: "div" }],
  toDOM: (node) =>  ["div", ctx.get(alluvialDocAttr.key)(node), 0],
  parseMarkdown: {
    match: () => false,
    runner: () => {},
  },
  toMarkdown: {
    match: (node) => node.type.name === "alluvialDoc",
    runner: (state, node) => {
      state.next(node.content);
    },
  },
}));

withMeta(alluvialDocSchema.node, {
  displayName: "NodeSchema<alluvialDoc>",
  group: "AlluvialDoc",
});
