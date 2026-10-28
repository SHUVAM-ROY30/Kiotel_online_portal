"use client";

// Rich-text editor for task descriptions. Replaces react-quill, which does not
// work on React 19 (it relies on ReactDOM.findDOMNode). Emits HTML through
// onChange, like Quill did, so the submit code and the backend are unchanged.

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListOl,
  FaListUl,
  FaLink,
  FaCode,
  FaRemoveFormat,
} from "react-icons/fa";

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${active ? "bg-gray-200 text-indigo-600" : "text-gray-700"}`}
    >
      {children}
    </button>
  );
}

export default function DescriptionEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    // StarterKit v3 already bundles Link and Underline.
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    // The page is server-rendered first; render the editor only on the client.
    immediatelyRender: false,
    // Re-render on selection/format changes so the toolbar's active states stay current.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-40 px-4 py-3 focus:outline-none " +
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_a]:text-indigo-600 [&_a]:underline " +
          "[&_pre]:bg-gray-100 [&_pre]:rounded [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      // Send "" rather than "<p></p>" for an empty editor.
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // Keep the editor in sync if the parent resets the value (e.g. clears the form).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="min-h-40" />;
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL", previous);
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const headingValue = [1, 2, 3].find((level) => editor.isActive("heading", { level })) || 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 px-2 py-1">
        <select
          value={headingValue}
          onChange={(e) => {
            const level = Number(e.target.value);
            if (level === 0) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level }).run();
          }}
          className="text-sm border border-gray-300 rounded px-1 py-1 bg-white"
          aria-label="Text style"
        >
          <option value={0}>Normal</option>
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
        </select>

        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <FaStrikethrough />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FaListOl />
        </ToolbarButton>
        <ToolbarButton title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FaListUl />
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          <FaLink />
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <FaCode />
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" active={false} onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <FaRemoveFormat />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
