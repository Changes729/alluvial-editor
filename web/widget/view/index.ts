import type { MilkdownPlugin } from "@milkdown/ctx";

import { listItemBlockView } from "./list-item-block";
import { alluvialDocView } from "./alluvial-doc";

export const CustomViewComponent: MilkdownPlugin[] = [
  listItemBlockView,
  alluvialDocView,
];
