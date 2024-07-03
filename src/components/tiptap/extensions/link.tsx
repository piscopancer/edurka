// import { LinkAttrs } from '@/tiptap/extensions/link'
// import * as Popover from '@radix-ui/react-popover'
// import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
// import clsx from 'clsx'
// import { useState } from 'react'
// import { TbSettings } from 'react-icons/tb'

// type LinkProps = Omit<NodeViewProps, 'updateAttributes'> & {
//   node: {
//     attrs: LinkAttrs
//   }
//   updateAttributes: (attrs: Partial<LinkAttrs>) => void
// }

// export default function Link(props: LinkProps) {
//   const [showMenu, setShowMenu] = useState(false)
//   const [editable, setEditable] = useState(props.editor.isEditable)

//   props.editor.on('update', ({ editor }) => {
//     setEditable(editor.isEditable)
//   })

//   return (
//     <NodeViewWrapper>
//       <Popover.Root open={editable && showMenu} onOpenChange={setShowMenu}>
//         <div className='flex rounded-lg border'>
//           <span className='px-2'>
//             <NodeViewContent />
//           </span>
//           {editable && (
//             <Popover.Trigger onClick={() => setShowMenu(true)} className={clsx('border-l px-2 py-0.5 text-sm')}>
//               <TbSettings />
//             </Popover.Trigger>
//           )}
//         </div>
//         <Popover.Content asChild align='start'>
//           <article className='rounded-xl border bg-zinc-200 p-4 shadow'>asdsad</article>
//         </Popover.Content>
//       </Popover.Root>
//     </NodeViewWrapper>
//   )
// }
