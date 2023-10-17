import React from "react";
import { useFormContext } from "react-hook-form";
import Boards from "../_boards";
import Demonstratio from "./demonstratio";
import ScheduledAt from "./scheduled-at";
import SubBoard from "./sub-board";
import Subject from "./subject";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const boardId = watch("board_id");
  const forDemonstratio = React.useRef(null);
  const forSubBoard = React.useRef(null);

  return (
    <>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <Boards />

      <Demonstratio ref={forDemonstratio} />

      <SubBoard ref={forSubBoard} />

      <Subject />

      <button
        disabled={!boardId}
        onClick={async () => {
          await window.electron.getPostProperties(boardId);
          await forDemonstratio.current.getDemonstratios();
          await forSubBoard.current.getSubBoards();
        }}
      >
        Refresh
      </button>

      {boardId && <ScheduledAt />}

      <textarea
        className="border"
        placeholder="Content"
        {...register("content", { required: "Content is required" })}
      ></textarea>
      {errors.content && <small>{errors.content.message}</small>}
    </>
  );
}
