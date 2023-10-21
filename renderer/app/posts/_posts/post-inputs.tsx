import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import Boards from "../_boards";
import BahaEmojis from "./baha-emojis";
import Demonstratio from "./demonstratio";
import ScheduledAt from "./scheduled-at";
import SubBoard from "./sub-board";
import Subject from "./subject";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();

  const boardId = watch("board_id");
  const demonstratioRef = React.useRef(null);
  const subBoardRef = React.useRef(null);
  const contentRef = useRef(null);
  const { ref, ...rest } = register("content", {
    required: "Content is required",
  });

  return (
    <>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <Boards />

      <Demonstratio ref={demonstratioRef} />

      <SubBoard ref={subBoardRef} />

      <Subject />

      <button
        disabled={!boardId}
        onClick={async () => {
          await window.electron.getPostProperties(boardId);
          await demonstratioRef.current.getDemonstratios();
          await subBoardRef.current.getSubBoards();
        }}
      >
        Refresh
      </button>

      {boardId && <ScheduledAt />}

      <textarea
        className="border p-1"
        placeholder="Content"
        {...rest}
        ref={(el) => {
          ref(el);
          contentRef.current = el;
        }}
      ></textarea>
      {errors.content && <small>{errors.content.message}</small>}

      <BahaEmojis
        insertEmoji={(emoji: string) => {
          contentRef.current.focus();
          const position = contentRef.current.selectionStart;
          const oldContent = getValues("content");
          const before = oldContent.substring(0, position);
          const after = oldContent.substring(position, oldContent.length);
          const insert = emoji + "\n";
          setValue("content", before + insert + after);
          contentRef.current.selectionStart = position + insert.length;
          contentRef.current.selectionEnd = position + insert.length;
        }}
      />
    </>
  );
}
