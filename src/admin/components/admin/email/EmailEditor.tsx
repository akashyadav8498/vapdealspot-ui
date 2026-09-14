import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface EmailEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function EmailEditor({ value, onChange, disabled }: EmailEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Underline,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes if not focused
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className={`border rounded-md bg-background flex flex-col overflow-hidden ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/20">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('underline') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('heading', { level: 1 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('heading', { level: 2 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('heading', { level: 3 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-muted ${editor.isActive('link') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-muted text-muted-foreground disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-muted text-muted-foreground disabled:opacity-50"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 min-h-[300px] prose prose-sm max-w-none focus:outline-none focus-within:ring-2 focus-within:ring-ring">
        <EditorContent editor={editor} className="outline-none min-h-[300px]" />
      </div>
    </div>
  );
}
