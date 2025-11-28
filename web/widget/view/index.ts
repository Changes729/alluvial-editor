import type { MilkdownPlugin } from '@milkdown/ctx'

import { listItemBlockView } from './list-item-block'

export const listItemBlockComponent: MilkdownPlugin[] = [
  listItemBlockView,
]