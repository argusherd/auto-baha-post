"use client";

import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { FieldValidationError } from "express-validator";
import { useForm } from "react-hook-form";
import BoardName from "./board/name";
import BoardNo from "./board/no";

export default function CreateBoard({
  fetchBoards,
}: {
  fetchBoards: Function;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  async function onSubmit(data: Board) {
    try {
      await axios.post(`${window.backendUrl}/api/boards`, data);

      reset();

      fetchBoards();
    } catch (error) {
      error.response.data.errors.forEach((item: FieldValidationError) => {
        setError(item.path, { message: item.msg });
      });
    }
  }

  return (
    <li className="flex items-center justify-between gap-2 p-1">
      <div className="flex gap-2">
        <BoardName register={register} errors={errors} />
        <BoardNo register={register} errors={errors} />
      </div>

      <button
        className="icon-[material-symbols--add] text-3xl"
        type="button"
        onClick={handleSubmit(onSubmit)}
      />
    </li>
  );
}
