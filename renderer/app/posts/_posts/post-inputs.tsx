import { useFormContext } from "react-hook-form";
import Boards from "../_boards";
import ScheduledAt from "./scheduled-at";
import Subject from "./subject";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const boardId = watch("board_id");

  return (
    <>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <Boards />

      <input
        type="number"
        placeholder="Demonstratio"
        {...register("demonstratio", { valueAsNumber: true })}
      />
      <input
        type="number"
        placeholder="Sub Board"
        {...register("sub_board", { valueAsNumber: true })}
      />
      <Subject />

      <button
        disabled={!boardId}
        onClick={() => {
          window.electron.getPostProperties(boardId);
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
