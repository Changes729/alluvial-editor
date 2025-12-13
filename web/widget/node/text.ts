import { $node } from "@milkdown/utils";

import { withMeta } from "../../utils/meta";
import { spanSchema } from "./span";

/// The bottom-level node.
export const textSchema = $node("text", (ctx) => ({
  group: "inline",
  parseMarkdown: {
    match: ({ type }) => type === "text",
    runner: (state, node) => {
      state.addText(node.value as string);
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "text",
    runner: (state, node) => {
      var hidden = false;
      node.marks.forEach((attr) => {
        if (attr.type.name == "span" && attr.attrs.pair == true) {
          hidden = true;
        }
      });
      if (!hidden) state.addNode("text", undefined, node.text as string);
    },
  },
}));

withMeta(textSchema, {
  displayName: "NodeSchema<text>",
  group: "Text",
});
