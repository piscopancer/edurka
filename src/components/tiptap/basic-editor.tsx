'use client'

import { basicExtensions } from '@/tiptap'
import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react'
import clsx from 'clsx'
import { ComponentProps } from 'react'
import { IconType } from 'react-icons/lib'
import { TbBold, TbCode, TbH2, TbH3, TbList, TbListNumbers } from 'react-icons/tb'
import { Tooltip } from '../tooltip'

type Action = {
  title: string
  icon: IconType
  action: (editor: Editor) => boolean
  can: (editor: Editor) => boolean
  isActive: (editor: Editor) => boolean
  hotkey?: string[]
}

const actions = {
  bold: {
    title: 'Bold',
    icon: TbBold,
    action(editor) {
      return editor.chain().toggleBold().focus().run()
    },
    can(editor) {
      return editor.can().toggleBold()
    },
    isActive(editor) {
      return editor.isActive('bold')
    },
    hotkey: ['Ctrl', 'B'],
  },
  code: {
    title: 'Code',
    icon: TbCode,
    action(editor) {
      return editor.chain().toggleCode().focus().run()
    },
    can(editor) {
      return editor.can().toggleCode()
    },
    isActive(editor) {
      return editor.isActive('code')
    },
    hotkey: ['Shift', 'Alt', 'C'],
  },
  h2: {
    title: 'Heading (Level 2)',
    icon: TbH2,
    can(editor) {
      return editor.can().toggleHeading({ level: 2 })
    },
    action(editor) {
      return editor.chain().toggleHeading({ level: 2 }).focus().run()
    },
    isActive(editor) {
      return editor.isActive('heading', { level: 2 })
    },
    hotkey: ['Shift', 'Alt', '2'],
  },
  h3: {
    title: 'Heading (Level 3)',
    icon: TbH3,
    can(editor) {
      return editor.can().toggleHeading({ level: 3 })
    },
    action(editor) {
      return editor.chain().toggleHeading({ level: 3 }).focus().run()
    },
    isActive(editor) {
      return editor.isActive('heading', { level: 3 })
    },
    hotkey: ['Shift', 'Alt', '3'],
  },
  bulletList: {
    title: 'Unordered list',
    icon: TbList,
    action(editor) {
      return editor.chain().toggleBulletList().focus().run()
    },
    can(editor) {
      return editor.can().toggleBulletList()
    },
    isActive(editor) {
      return editor.isActive('bulletList')
    },
    hotkey: ['Ctrl', 'Shift', '8'],
  },
  orderedList: {
    title: 'Ordered list',
    icon: TbListNumbers,
    action(editor) {
      return editor.chain().toggleOrderedList().focus().run()
    },
    can(editor) {
      return editor.can().toggleOrderedList()
    },
    isActive(editor) {
      return editor.isActive('orderedList')
    },
    hotkey: ['Ctrl', 'Shift', '7'],
  },
} satisfies Record<string, Action>

type BasicEditorProps = {} & ComponentProps<'article'>

export default function BasicEditor({ ...props }: BasicEditorProps) {
  const editor = useEditor({
    extensions: basicExtensions,
    editorProps: {
      attributes: {
        class: 'outline-none p-4',
        spellcheck: 'false',
      },
    },
  })

  return (
    <article {...props} className={clsx(props.className, 'rounded-lg border shadow')}>
      <header className='border-b'>
        <menu className='flex'>
          <Action editor={editor} action={actions.bold} className='border-r border-dashed' />
          <Action editor={editor} action={actions.code} className='border-r' />
          <Action editor={editor} action={actions.h2} className='border-r border-dashed' />
          <Action editor={editor} action={actions.h3} className='border-r' />
          <Action editor={editor} action={actions.bulletList} className='border-r border-dashed' />
          <Action editor={editor} action={actions.orderedList} className='border-r' />
        </menu>
      </header>
      <EditorContent editor={editor}>{editor && <CustomBubbleMenu editor={editor} />}</EditorContent>
    </article>
  )
}

function Action({ action, editor, ...props }: { action: Action; editor: Editor | null } & ComponentProps<'button'>) {
  return (
    <Tooltip
      content={
        <div>
          <span className={clsx('', action.hotkey && 'mb-1 inline-block')}>{action.title}</span>
          {action.hotkey && (
            <ul className='mb-1 flex justify-center gap-1'>
              {action.hotkey.map((key) => (
                <li key={key} className='rounded-md border border-zinc-200 px-2 py-0.5 text-xs'>
                  {key}
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    >
      <button
        {...props}
        disabled={editor ? !action.can(editor) : true}
        onClick={() => {
          if (editor) {
            action.action(editor)
          }
        }}
        className={clsx(props.className, 'flex size-10 items-center justify-center disabled:bg-halftone', editor && action.isActive(editor) && 'text-accent-dark bg-accent/10')}
      >
        <action.icon className={clsx('size-1/2', editor && action.isActive(editor) && 'scale-110')} />
      </button>
    </Tooltip>
  )
}

function CustomBubbleMenu(props: { editor: Editor | null }) {
  return (
    <BubbleMenu editor={props.editor} updateDelay={0} tippyOptions={{ placement: 'bottom' }}>
      <menu className='flex rounded-lg border bg-zinc-200'>
        <Action editor={props.editor} action={actions.bold} className='!size-8 border-r border-dashed' />
        <Action editor={props.editor} action={actions.code} className='!size-8' />
      </menu>
    </BubbleMenu>
  )
}
