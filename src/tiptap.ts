import { mergeAttributes } from '@tiptap/core'
import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import SelectOne from './components/tiptap/select-one'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    selectOne: {
      setSelectOne: (attributes: {}) => ReturnType
      toggleSelectOne: (attributes: {}) => ReturnType
      unsetSelectOne: () => ReturnType
    }
  }
}

export const selectOneExtension = Node.create({
  name: 'selectOne',
  group: 'block',
  keepOnSplit: true,
  exitable: true,
  addAttributes() {
    return {
      options: {
        default: ['Option 1', 'Option 2'],
      },
      correctAnswer: ['Option 1'],
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
  // addCommands() {
  //   return {
  //     setSelectOne:
  //       () =>
  //       ({ chain }) => {
  //         return chain().setMark(this.name).run()
  //       },
  //     unsetSelectOne:
  //       () =>
  //       ({ chain }) => {
  //         return chain().unsetMark(this.name).run()
  //       },
  //   }
  // },
  addNodeView() {
    return ReactNodeViewRenderer(SelectOne)
  },
})
