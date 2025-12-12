import { $nodeAttr, $nodeSchema } from "@milkdown/utils";
import { withMeta } from "../../utils/meta";
import { serializeText } from "../../utils/serialize-text";

/// HTML attributes for noHeading node.
export const noHeadingAttr = $nodeAttr("noHeading");

withMeta(noHeadingAttr, {
  displayName: "Attr<noHeading>",
  group: "Heading",
});

/// Schema for noHeading node.
export const noHeadingSchema = $nodeSchema("noHeading", (ctx) => ({
  content: "inline*",
  group: "block",
  defining: true,
  attrs: {
    id: {
      default: "",
      validate: "string",
    },
    level: {
      default: 1,
      validate: "number",
    },
  },
  parseMarkdown: {
    match: ({ type }) => type === "heading",
    runner: (state, node, type) => {
      const depth = node.depth as number;
      state.addText("#".repeat(depth));
      state.next(node.children);
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === "heading",
    runner: (state, node) => {
      serializeText(state, node);
    },
  },
}));

withMeta(noHeadingSchema.node, {
  displayName: "NodeSchema<noHeading>",
  group: "Heading",
});

withMeta(noHeadingSchema.ctx, {
  displayName: "NodeSchemaCtx<noHeading>",
  group: "Heading",
});
