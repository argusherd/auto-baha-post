import { useFormContext } from "react-hook-form";
import Boards from "../_boards";
import ScheduledAt from "./scheduled-at";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

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
      <input
        type="number"
        placeholder="Subject"
        {...register("subject", { valueAsNumber: true })}
      />

      {watch("board") && <ScheduledAt />}

      <textarea
        className="border"
        placeholder="Content"
        {...register("content", { required: "Content is required" })}
      ></textarea>
      {errors.content && <small>{errors.content.message}</small>}
    </>
  );
}
