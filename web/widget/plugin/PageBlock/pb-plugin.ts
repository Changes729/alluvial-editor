import type { PluginSpec } from '@milkdown/prose/state'

import { Plugin, PluginKey } from '@milkdown/prose/state'
import { $ctx, $prose } from '@milkdown/utils'

import { PageBlockService } from './pb-service'
import { withMeta } from '../../../utils/meta'

/// @internal
export const pageBlockService = $ctx(() => new PageBlockService(), 'pageBlockService')

/// @internal
export const pageBlockServiceInstance = $ctx(
  {} as PageBlockService,
  'pageBlockServiceInstance'
)

withMeta(pageBlockService, {
  displayName: 'Ctx<pageBlockService>',
})

withMeta(pageBlockServiceInstance, {
  displayName: 'Ctx<pageBlockServiceInstance>',
})

/// A slice contains a factory that will return a plugin spec.
/// Users can use this slice to customize the plugin.
export const pageBlockSpec = $ctx<PluginSpec<any>, 'pageBlockSpec'>({}, 'pageBlockSpec')

withMeta(pageBlockSpec, {
  displayName: 'Ctx<pageBlockSpec>',
})

/// The pageBlock prosemirror plugin.
export const pageBlockPlugin = $prose((ctx) => {
  const milkdownPluginBlockKey = new PluginKey('MILKDOWN_PAGE_BLOCK')
  const getService = ctx.get(pageBlockService.key)
  const service = getService()
  ctx.set(pageBlockServiceInstance.key, service)
  const spec = ctx.get(pageBlockSpec.key)

  return new Plugin({
    key: milkdownPluginBlockKey,
    ...spec,
    props: {
      ...spec.props,
      handleDOMEvents: {
        pointermove: (view, event) => {
          return service.mousemoveCallback(view, event)
        },
        keydown: (view) => {
          return service.keydownCallback(view)
        },
      },
    },
  })
})

withMeta(pageBlockPlugin, {
  displayName: 'Prose<pageBlock>',
})
