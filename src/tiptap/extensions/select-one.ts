import SelectOne from '@/components/tiptap/extensions/select-one'
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'

export type SelectOneAttrs = {
  options: string
  correctAnswer: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    selectOne: {
      insertSelectOne: (attributes?: SelectOneAttrs) => ReturnType
    }
  }
}

export const selectOneExtension = Node.create({
  name: 'selectOne',
  group: 'inline',
  exitable: true,
  // selectable: false,
  // inline: true,
  addAttributes() {
    return {
      options: {
        default: 'Option 1, Option 2',
      },
      correctAnswer: {
        default: 0,
      },
    } satisfies { [K in keyof SelectOneAttrs]: { default: SelectOneAttrs[K] } }
  },
  parseHTML() {
    return [
      {
        tag: 'select-one',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['select-one', mergeAttributes(HTMLAttributes)]
  },
  addCommands() {
    return {
      insertSelectOne:
        (attrs) =>
        ({ commands, tr }) => {
          return commands.insertContent(
            {
              type: this.type.name,
              attrs:
                attrs ??
                ({
                  correctAnswer: 0,
                  options: tr.doc.textBetween(tr.selection.from, tr.selection.to, ' ').trim(),
                } satisfies SelectOneAttrs),
            },
            {},
          )
        },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(SelectOne, { className: 'inline-block' })
  },
})
