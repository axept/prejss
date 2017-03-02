import parser from '../postcss-adapter/sync/parse.server'
import extractExpressions from './extract-expressions'
import restoreExpressions from './restore-expressions'

export default ({ types: t }) => {
  return {
    visitor: {
      TaggedTemplateExpression(p, { opts }) {
        const namespace = opts.namespace || 'prejss'
        const { tag } = p.node

        if (tag.name !== namespace) {
          return
        }

        const { rawStyle, variables } = extractExpressions(p.node.quasi)
        const parsed = parser(rawStyle)
        const restored = restoreExpressions(parsed, variables)
        p.replaceWith(restored)
      },
    },
  }
}
