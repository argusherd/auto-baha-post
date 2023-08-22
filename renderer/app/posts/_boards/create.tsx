"use client";

import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function CreateBoard({
  fetchBoards,
}: {
  fetchBoards: Function;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  async function onSubmit(data: Board) {
    await axios.post(`${window.backendUrl}/api/boards`, data);
    await fetchBoards();
  }

  function notEmpty(errorMessage: string) {
    return (value: string) => value.trim().length > 0 || errorMessage;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="No"
        {...register("no", {
          required: true,
          validate: {
            notEmpty: notEmpty("The board's no should not be empty"),
            isNumber: (value) =>
              !isNaN(value) || "The board's no should be a number",
          },
        })}
      />
      {errors.no && <p>{errors.no.message}</p>}

      <input
        type="text"
        placeholder="Name"
        {...register("name", {
          validate: {
            notEmpty: notEmpty("The board's name should not be empty"),
          },
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <button>Add</button>
    </form>
  );
}
