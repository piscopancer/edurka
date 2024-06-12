import { mergeAttributes } from '@tiptap/core'
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import SelectOne from './components/tiptap/select-one'

export type Attrs = {
  options: string[]
  correctAnswer: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    selectOne: {
      insertSelectOne: (attributes?: Attrs) => ReturnType
    }
  }
}

export const selectOneExtension = Node.create({
  name: 'selectOne',
  group: 'inline',
  exitable: true,
  selectable: false,
  inline: true,
  addAttributes() {
    return {
      options: {
        default: ['Option 1', 'Option 2'],
      },
      correctAnswer: {
        default: 0,
      },
    }
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
          return commands.insertContent({ type: this.type.name, attrs: { correctAnswer: 0, options: ['sex'] } })
        },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(SelectOne, { className: 'inline-block' })
  },
})
