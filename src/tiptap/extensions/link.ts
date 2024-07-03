// import Link from '@/components/tiptap/extensions/link'
// import { Mark, mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'

// export type LinkAttrs = {
//   type: 'email' | 'phone' | 'url'
//   href: string
// }

// export const prefixes = {
//   email: 'mailto:',
//   phone: 'tel:',
//   url: 'https://',
// } satisfies Record<LinkAttrs['type'], string>

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     link: {
//       toggleLink: (attributes?: LinkAttrs) => ReturnType
//     }
//   }
// }

// export const linkExtension = Mark.create<LinkAttrs>({
//   name: 'link',
//   exitable: true,
//   addAttributes() {
//     return {
//       type: {
//         default: 'url',
//       },
//       href: {
//         default: '',
//       },
//     }
//   },
//   parseHTML() {
//     return [
//       {
//         tag: 'a',
//       },
//     ]
//   },
//   renderHTML({ HTMLAttributes }) {
//     return ['a', mergeAttributes(HTMLAttributes), 0]
//   },
//   addCommands() {
//     return {
//       toggleLink: (attrs) => {
//         return ({ commands, tr }) =>
//           commands.toggleMark(
//             this.type.name,
//             attrs ??
//               ({
//                 type: 'url',
//                 href: '',
//               } satisfies LinkAttrs),
//           )
//       },
//     }
//   },
//   addNodeView() {
//     return ReactNodeViewRenderer(Link)
//   },
// })
