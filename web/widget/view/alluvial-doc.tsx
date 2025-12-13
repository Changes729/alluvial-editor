import type { Node as PmNode } from "@milkdown/prose/model";
import type { NodeViewConstructor } from "@milkdown/prose/view";

import { $view } from "@milkdown/utils";

import { withMeta } from "../../utils/meta";
import { alluvialDocSchema } from "../node/alluvialDoc";

export const alluvialDocView = $view(
  alluvialDocSchema.node,
  (ctx): NodeViewConstructor => {
    return (initialNode, view, getPos) => {
      const updateAttrs = (node: PmNode) => {
        const title = node.attrs.title;
        titleElement.innerText = title;
      };

      const dom = document.createDocumentFragment();
      // const dom = document.createElement("div");
      const contentDOM = document.createElement("div");
      const titleElement = document.createElement("h1");
      dom.append(titleElement, contentDOM);
      updateAttrs(initialNode);

      let node = initialNode;
      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type !== initialNode.type) return false;

          if (
            updatedNode.sameMarkup(node) &&
            updatedNode.content.eq(node.content)
          ) {
            return true;
          }

          node = updatedNode;
          updateAttrs(updatedNode);
          return true;
        },
        ignoreMutation: (mutation) => {
          if (!dom || !contentDOM) return true;

          if ((mutation.type as unknown) === "selection") return false;

          return true;
        },
        selectNode: () => {},
        deselectNode: () => {},
        destroy: () => {},
      };
    };
  }
);

withMeta(alluvialDocView, {
  displayName: "NodeView<alluvial-doc>",
  group: "AlluvialDoc",
});
