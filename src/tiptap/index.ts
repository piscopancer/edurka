import { EditorOptions, useEditor } from '@tiptap/react'
import { generalExtensions } from './extensions'

export function useGeneralEditor(options?: Partial<EditorOptions>) {
  return useEditor({
    extensions: generalExtensions,
    editorProps: {
      attributes: {
        class: 'outline-none p-4',
        spellcheck: 'false',
      },
    },
    ...options,
  })
}
