"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Code, List, ListOrdered, Send, Smile, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageInputProps {
  placeholder: string;
  onSend: (text: string, attachments?: any[]) => void;
}

const POPULAR_EMOJIS = ["👋", "👍", "❤️", "🔥", "😂", "🎉", "🚀", "👀", "🙌", "💯", "👏", "🤔"];

export function MessageInput({ placeholder, onSend }: MessageInputProps) {
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: "file" | "image" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/60 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-hidden prose max-w-none text-[#0F2A1D] text-sm min-h-[60px] max-h-[200px] overflow-y-auto w-full px-4 py-3",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submitMessage();
          return true;
        }
        if (event.key === "Escape") {
          (event.target as HTMLElement).blur();
          return true;
        }
        return false;
      },
    },
  });

  const submitMessage = () => {
    if (!editor) return;
    const textContent = editor.getText().trim();
    const htmlContent = editor.getHTML();
    
    // Check if empty
    if (!textContent && attachedFiles.length === 0) return;

    // Map files to standard attachments schema
    const attachments = attachedFiles.map((f) => ({
      name: f.name,
      url: "#",
      type: f.type,
      size: f.size,
    }));

    // Send either HTML (if formatted) or plain text
    onSend(textContent ? htmlContent : "", attachments);

    // Reset input
    editor.commands.clearContent();
    setIsEditorEmpty(true);
    setAttachedFiles([]);
  };

  const handleAddEmoji = (emoji: string) => {
    if (!editor) return;
    editor.commands.insertContent(emoji);
    setIsEditorEmpty(false);
    editor.commands.focus();
  };

  const triggerAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const isImg = file.type.startsWith("image/");
      
      setAttachedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${sizeMb} MB`,
          type: isImg ? "image" : "file",
        },
      ]);
      toast.success(`Attached: ${file.name}`);
      e.target.value = ""; // Reset file selector
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col bg-card border border-border shadow-xs rounded-xl mx-6 mb-6 select-none shrink-0 focus-within:ring-1 focus-within:ring-primary/25 focus-within:border-border/80">
      {/* Top Formatting Bar */}
      <div className="border-b border-border/50 px-3 py-1.5 flex items-center gap-0.5 bg-muted/10 rounded-t-xl shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md",
            editor.isActive("bold") && "bg-muted text-foreground"
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md",
            editor.isActive("italic") && "bg-muted text-foreground"
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md",
            editor.isActive("code") && "bg-muted text-foreground"
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md",
            editor.isActive("bulletList") && "bg-muted text-foreground"
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md",
            editor.isActive("orderedList") && "bg-muted text-foreground"
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Middle scroll area for attachments and content */}
      <div className="flex flex-col flex-1 min-h-[60px]">
        {/* File attachment preview strip */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-muted px-2.5 py-1 rounded border border-border/80 text-xs text-foreground">
                <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                <span className="text-[10px] text-muted-foreground">({file.size})</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="text-muted-foreground hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tiptap rich editor */}
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Bottom Toolbar & Send Button */}
      <div className="px-4 py-2 border-t border-border/30 flex items-center justify-between bg-muted/5 rounded-b-xl shrink-0">
        <div className="flex items-center gap-1">
          {/* File attachment button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md"
            onClick={triggerAttachment}
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Emoji Picker Popover */}
          <Popover>
            <PopoverTrigger className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md transition-colors" title="Emoji picker">
              <Smile className="h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 bg-slate-900 border-slate-800 text-white" align="start" side="top" sideOffset={8}>
              <div className="grid grid-cols-4 gap-1">
                {POPULAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddEmoji(emoji)}
                    className="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Send Action (Slack green rounded circle) */}
        <Button
          onClick={submitMessage}
          disabled={isEditorEmpty && attachedFiles.length === 0}
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center p-0 shrink-0 cursor-pointer transition-all duration-150",
            isEditorEmpty && attachedFiles.length === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
              : "bg-[#007a5a] hover:bg-[#007a5a]/90 text-white shadow-sm hover:scale-105"
          )}
          title="Send message"
        >
          <Send className="h-3.5 w-3.5 fill-current" />
        </Button>
      </div>
    </div>
  );
}
