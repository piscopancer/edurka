import { Extensions, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import boldExtension from '@tiptap/extension-bold'
import bulletListExtension from '@tiptap/extension-bullet-list'
import codeExtension from '@tiptap/extension-code'
import codeBlockExtension from '@tiptap/extension-code-block'
import documentExtension from '@tiptap/extension-document'
import hardBreakExtension from '@tiptap/extension-hard-break'
import headingExtension from '@tiptap/extension-heading'
import historyExtension from '@tiptap/extension-history'
import linkExtension from '@tiptap/extension-link'
import listItemExtension from '@tiptap/extension-list-item'
import orderedListExtension from '@tiptap/extension-ordered-list'
import paragraphExtension from '@tiptap/extension-paragraph'
import textExtension from '@tiptap/extension-text'
import textAlignExtension from '@tiptap/extension-text-align'
import clsx from 'clsx'
import { Markdown as markdownExtension } from 'tiptap-markdown'

declare module '@tiptap/react' {
  class Editor {
    get storage(): { markdown: { getMarkdown: () => string } }
  }
}

const headingLevels = [2, 3] as const

const extensions = {
  doc: documentExtension,
  markdown: markdownExtension,
  history: historyExtension,
  textAlign: textAlignExtension.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'right', 'center'],
  }),
  hardBreak: hardBreakExtension,
  text: textExtension,
  heading: headingExtension.configure({ levels: [...headingLevels] }).extend({
    marks() {
      return ''
    },
    addInputRules() {
      return headingLevels.map((level) =>
        textblockTypeInputRule({
          find: new RegExp(`^(#{${level}})\\s$`),
          type: this.type,
          getAttributes: { level },
        }),
      )
    },
    renderHTML({ node, HTMLAttributes }) {
      const attrs = node.attrs as { level: (typeof headingLevels)[number] }
      return [
        `h${attrs.level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: {
            class2: 'text-2xl mb-6 my-12 font-semibold',
            class3: 'text-xl mb-4 my-8 font-semibold',
          }[`class${attrs.level}`],
        }),
        0,
      ]
    },
    addKeyboardShortcuts() {
      return {
        'shift-alt-2': ({ editor }) => {
          if (editor.can().toggleHeading({ level: 2 satisfies (typeof headingLevels)[number] })) {
            return editor.commands.toggleHeading({ level: 2 satisfies (typeof headingLevels)[number] })
          } else {
            return false
          }
        },
        'shift-alt-3': ({ editor }) => {
          if (editor.can().toggleHeading({ level: 3 satisfies (typeof headingLevels)[number] })) {
            return editor.commands.toggleHeading({ level: 3 satisfies (typeof headingLevels)[number] })
          } else {
            return false
          }
        },
      }
    },
  }),
  parapgraph: paragraphExtension.configure({ HTMLAttributes: { class: 'not-[:first-child]:mt-4 not-[:last-child]:mb-4' } }),
  bold: boldExtension,
  code: codeExtension.configure({
    HTMLAttributes: {
      class: 'border rounded-lg px-1.5 font-mono inline-block text-sm',
    },
  }),
  // .extend({
  //   addKeyboardShortcuts() {
  //     return {
  //       check for can()
  //       'shift-alt-c': () => this.editor.commands.toggleCode(),
  //     }
  //   },
  // }),
  codeBlock: codeBlockExtension.configure({
    HTMLAttributes: { class: 'bg-zinc-900 rounded-md px-4 py-3 my-4 selection:bg-zinc-300 selection:text-zinc-900 text-sm *:!font-mono text-zinc-200' },
  }),
  // .extend({
  //   addKeyboardShortcuts() {
  //     return {
  //       'shift-alt-s': () => {
  //         if (this.editor.can().toggleCodeBlock()) {
  //           return this.editor.commands.toggleCodeBlock()
  //         } else {
  //           return false
  //         }
  //       },
  //     }
  //   },
  // }),
  listItem: listItemExtension.configure({ HTMLAttributes: { class: '' } }),
  bulletList: bulletListExtension.configure({
    HTMLAttributes: {
      class: clsx(
        'not-[:first-child]:mt-4 not-[:last-child]:mb-4',
        '[&_ul]:!my-0',
        '[&_li]:grid-cols-[auto,1fr] [&_li]:grid [&_li]:grid-cols-[auto,1fr] [&_li]:gap-x-4 [&_li_*:not(:first-child)]:col-start-2',
        '[&_li_*]:!my-0',
        '[&_li]:before:content-["->"] [&_li]:before:font-mono',
      ),
    },
  }),
  orderedList: orderedListExtension.configure({
    HTMLAttributes: {
      class: clsx(
        '[counter-reset:li] not-[:first-child]:mt-4 not-[:last-child]:mb-4',
        '[&_ol]:!my-0',
        '[&_li]:my-2 [&_li]:last:!mb-0 [&_li>*]:!my-0 [&_li]:grid [&_li]:grid-cols-[auto,1fr] [&_li]:gap-x-2 [&_li_*:not(:first-child)]:col-start-2',
        '[&_li]:before:content-[counter(li)] [&_li]:before:[counter-increment:li] [&_li]:before:size-6 [&_li]:before:text-sm [&_li]:before:inline-flex [&_li]:before:items-center [&_li]:before:justify-center [&_li]:before:border [&_li]:before:border-zinc-900 [&_li]:before:rounded-lg [&_li]:before:border-dashed [&_li]:before:shrink-0',
      ),
    },
  }),
  link: linkExtension,
} satisfies Record<string, Extensions[number]>

export const generalExtensions = [
  extensions.history,
  extensions.doc,
  extensions.markdown,
  extensions.textAlign,
  extensions.hardBreak,
  extensions.parapgraph,
  extensions.codeBlock,
  extensions.bulletList,
  extensions.orderedList,
  extensions.heading,
  extensions.listItem,
  extensions.bold,
  extensions.code,
  extensions.text,
  extensions.link,
] as const satisfies Extensions

export const selectOneExtensions: Extensions = [extensions.doc, extensions.parapgraph, extensions.text, extensions.history, extensions.bold, extensions.code, extensions.hardBreak]
