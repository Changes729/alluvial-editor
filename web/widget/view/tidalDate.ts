import type { Node as PmNode } from "@milkdown/prose/model";
import type { NodeViewConstructor } from "@milkdown/prose/view";

import { $view } from "@milkdown/utils";

import { withMeta } from "../../utils/meta";
import { tidalDatetimeSchema } from "../node/tidalDatetime";

export const tidalDateView = $view(
  tidalDatetimeSchema.node,
  (ctx): NodeViewConstructor => {
    return (initialNode, view, getPos) => {
      const updateAttrs = (node: PmNode) => {
        const daysInChinese = ["日", "一", "二", "三", "四", "五", "六"];

        const formatter = new Intl.DateTimeFormat("sv-SE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        dom.innerText = `${formatter.format(node.attrs.date)}（${
          daysInChinese[node.attrs.date.getDay()]
        }）`;
      };

      const dom = document.createElement("h1");
      const contentDOM = dom;
      updateAttrs(initialNode);

      let selected = false;
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

          if (contentDOM === mutation.target && mutation.type === "attributes")
            return true;

          if (contentDOM.contains(mutation.target)) return false;

          return true;
        },
        selectNode: () => {
          selected = true;
        },
        deselectNode: () => {
          selected = false;
        },
        destroy: () => {
          dom.remove();
        },
      };
    };
  }
);

withMeta(tidalDateView, {
  displayName: "NodeView<tidalDate>",
  group: "tidalDate",
});
