import { BubbleMenu, Editor, EditorContent } from '@tiptap/react'
import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import { IconType } from 'react-icons/lib'
import { TbArrowsMaximize, TbArrowsMinimize, TbBold, TbCode, TbH2, TbH3, TbLink, TbList, TbListNumbers, TbMarkdown, TbMarkdownOff } from 'react-icons/tb'
import { Tooltip } from '../../tooltip'

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
  codeBlock: {
    title: 'Code Block',
    icon: TbCode,
    can(editor) {
      return editor.can().toggleCodeBlock()
    },
    action(editor) {
      return editor.chain().toggleCodeBlock().focus().run()
    },
    isActive(editor) {
      return editor.isActive('codeBlock')
    },
    hotkey: ['Shift', 'Alt', 'S'],
  },
  link: {
    title: 'Link',
    icon: TbLink,
    can(editor) {
      return editor.can().toggleLink({ href: '' })
      return true
    },
    action(editor) {
      // return editor.chain().toggleLink({}).focus().run()
      // show dialogue
      return true
    },
    isActive(editor) {
      return editor.isActive('link')
    },
  },
} satisfies Record<string, Action>

type GeneralEditorProps = {
  editor: Editor | null
} & ComponentProps<'article'>

export default function GeneralEditor({ editor, ...props }: GeneralEditorProps) {
  const [maximized, setMaximized] = useState(false)
  const [markdown, setMarkdown] = useState(false)

  return (
    <article {...props} className={clsx(props.className, maximized ? 'fixed inset-0 z-[1] bg-zinc-200' : 'rounded-lg border shadow', 'flex flex-col')}>
      <header className='bg-halftone shrink-0 overflow-hidden rounded-t-lg border-b'>
        <menu className='flex'>
          <div className='mr-auto flex bg-zinc-200'>
            <TiptapAction editor={editor} action={actions.h2} markdown={markdown} className='border-r border-dashed' />
            <TiptapAction editor={editor} action={actions.h3} markdown={markdown} className='border-r' />
            <TiptapAction editor={editor} action={actions.bold} markdown={markdown} className='border-r border-dashed' />
            <TiptapAction editor={editor} action={actions.code} markdown={markdown} className='border-r' />
            <TiptapAction editor={editor} action={actions.bulletList} markdown={markdown} className='border-r border-dashed' />
            <TiptapAction editor={editor} action={actions.orderedList} markdown={markdown} className='border-r' />
            <TiptapAction editor={editor} action={actions.codeBlock} markdown={markdown} className='border-r' />
            <TiptapAction editor={editor} action={actions.link} markdown={markdown} className='border-r' />
          </div>
          {/* <button
            onClick={() => {
              if (editor) {
                console.log(editor.storage.markdown.getMarkdown())
              }
            }}
          >
            MD
          </button> */}
          <div className='flex border-l bg-zinc-200'>
            <Tooltip content={markdown ? 'Disable markdown mode' : 'Enable markdown mode'}>
              <button
                onClick={() => {
                  setMarkdown((prev) => !prev)
                }}
                className={clsx(markdown ? 'bg-accent/10 text-accent-dark' : 'bg-zinc-200', 'flex size-10 items-center justify-center border-r')}
              >
                {markdown ? <TbMarkdownOff className='size-1/2' /> : <TbMarkdown className='size-1/2' />}
              </button>
            </Tooltip>
          </div>
          <div className='flex bg-zinc-200'>
            <Tooltip content={maximized ? 'Minimize editor' : 'Maximize editor'}>
              <button
                onClick={() => {
                  setMaximized((prev) => !prev)
                }}
                className={clsx(maximized ? 'bg-accent/10 text-accent-dark' : 'bg-zinc-200', 'flex size-10 items-center justify-center')}
              >
                {maximized ? <TbArrowsMinimize className='size-1/2' /> : <TbArrowsMaximize className='size-1/2' />}
              </button>
            </Tooltip>
          </div>
        </menu>
      </header>
      {markdown ? (
        <textarea
          defaultValue={editor ? editor.storage.markdown.getMarkdown() : ''}
          onChange={(e) => {
            if (editor) {
              editor.commands.setContent(e.target.value)
            }
          }}
          rows={5}
          spellCheck={false}
          className='grow p-4 outline-none'
        />
      ) : (
        <EditorContent editor={editor} className='overflow-y-auto'>
          {editor && <CustomBubbleMenu editor={editor} markdown={markdown} />}
        </EditorContent>
      )}
    </article>
  )
}

function TiptapAction({ action, editor, markdown, ...props }: { action: Action; editor: Editor | null; markdown: boolean } & ComponentProps<'button'>) {
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
        disabled={editor && !markdown ? !action.can(editor) : true}
        onClick={() => {
          if (editor) {
            action.action(editor)
          }
        }}
        className={clsx(
          props.className,
          'flex size-10 items-center justify-center disabled:bg-halftone',
          editor && !markdown && action.isActive(editor) && 'bg-accent/10 text-accent-dark',
        )}
      >
        <action.icon className='size-1/2' />
      </button>
    </Tooltip>
  )
}

function CustomBubbleMenu(props: { editor: Editor | null; markdown: boolean }) {
  return (
    <BubbleMenu editor={props.editor} updateDelay={0} tippyOptions={{ placement: 'bottom' }}>
      <menu className='flex rounded-lg border bg-zinc-200'>
        <TiptapAction editor={props.editor} action={actions.bold} markdown={props.markdown} className='!size-8 border-r border-dashed' />
        <TiptapAction editor={props.editor} action={actions.code} markdown={props.markdown} className='!size-8' />
      </menu>
    </BubbleMenu>
  )
}
