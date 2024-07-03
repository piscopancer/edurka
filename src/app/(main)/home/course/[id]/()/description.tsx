'use client'

import GeneralEditor from '@/components/tiptap/editors/general-editor'
import { useGeneralEditor } from '@/tiptap'
import { generalExtensions } from '@/tiptap/extensions'
import { generateHTML } from '@tiptap/html'
import clsx from 'clsx'
import htmlToReact from 'html-react-parser'
import { ComponentProps, useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { useCourseQuery } from '.'

const testContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Example ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
          text: 'Text',
        },
      ],
    },
  ],
}

export default function Description({ courseId, ...props }: { courseId: number } & ComponentProps<'div'>) {
  const { data: course } = useCourseQuery(courseId)
  const [edit, setEdit] = useState(false)
  const descriptionEditor = useGeneralEditor({
    content: testContent,
    editable: edit,
  })

  if (!course) return

  return (
    <div {...props} className={clsx(props.className, '')}>
      <button onClick={() => setEdit(true)} className='ml-auto block rounded-lg border border-transparent hover:border-inherit'>
        <TbEdit className='size-10 p-2.5' />
      </button>
      {edit ? <GeneralEditor editor={descriptionEditor} /> : <div>{htmlToReact(generateHTML(testContent, generalExtensions))}</div>}
    </div>
  )
}
