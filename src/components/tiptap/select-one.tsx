import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'

type SelectOneProps = NodeViewProps & {
  node: {
    attrs: {
      options: string[]
      correctAnswer: string
    }
  }
}

export default function SelectOne(props: SelectOneProps) {
  return (
    <NodeViewWrapper>
      <span contentEditable={false}>React Component</span>
      <ul className='bg-red-500'>
        {props.node.attrs.options.map((option, i) => (
          <li key={i}>{option}</li>
        ))}
      </ul>
    </NodeViewWrapper>
  )
}
