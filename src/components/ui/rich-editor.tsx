import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Bold, Italic, Underline as UnderlineIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const prevValue = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      prevValue.current = html
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2',
        placeholder: placeholder || '',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== prevValue.current) {
      prevValue.current = value
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) return null

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), label: 'Underline' },
  ]

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-muted/30">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.label}
              type="button"
              onClick={tool.action}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-md text-sm transition-colors',
                tool.active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
              title={tool.label}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          )
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
