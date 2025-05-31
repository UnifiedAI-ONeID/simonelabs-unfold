import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Wand2,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

const ContentEditor = ({ initialContent = '', onSave }: ContentEditorProps) => {
  const { toast } = useToast();
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const improveContent = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    
    try {
      const response = await fetch('/api/ai/improve-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to improve content');

      const { improvedContent } = await response.json();
      editor.commands.setContent(improvedContent);
      
      toast({
        title: "Content Improved",
        description: "AI has enhanced your content.",
      });
    } catch (error) {
      toast({
        title: "Improvement Failed",
        description: "Failed to improve content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!editor || !onSave) return;
    onSave(editor.getHTML());
    
    toast({
      title: "Content Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  if (!editor) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Content Editor</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-[200px] border rounded-lg p-4">
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={improveContent}>
            <Wand2 className="h-4 w-4 mr-2" />
            Improve with AI
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;