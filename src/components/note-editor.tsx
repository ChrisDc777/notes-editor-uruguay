"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { updateNote } from "~/lib/update-note";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Props {
  id: number;
  title: string | null;
  content: string | null;
}

export default function NoteEditor(props: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [content, setContent] = useState(props.content);

  const debouncedTitle = useDebounce(title, 200);
  const debouncedContent = useDebounce(content, 200);

  useEffect(() => {
    setIsLoading(true);
    updateNote(props.id, debouncedTitle ?? "", debouncedContent)
      .catch(() => {
        console.error("error on update");
        setIsLoading(false);
      })
      .finally(() => {
        console.log("note saved successfully");
        setIsLoading(false);
      });
  }, [props.id, debouncedTitle, debouncedContent]);

  useEffect(() => setIsLoading(true), [title, content]);

  function handleTextareaReSize(textarea: HTMLTextAreaElement) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.currentTarget.value);
  }

  async function handleTextAreaChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    handleTextareaReSize(event.currentTarget);
    setContent(event.currentTarget.value);
  }

  return (
    <>
      <p className="text-sm text-foreground/30">
        {isLoading ? "Saving..." : "Saved"}
      </p>
      <Input
        onChange={handleInputChange}
        value={title ?? ""}
        placeholder="New Note Title..."
        className="mt-2 h-auto font-geist-mono text-xl"
      />
      <Textarea
        onChange={handleTextAreaChange}
        value={content ?? ""}
        placeholder="Your note content here..."
        className="mt-4 min-h-[400px] resize-none overflow-hidden border-none font-geist-mono focus-visible:ring-transparent"
      />
    </>
  );
}
