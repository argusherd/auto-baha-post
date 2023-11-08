"use client";

import Board from "@/backend-api/database/entities/Board";
import handleFormRequest from "@/renderer/helpers/handleFormRequest";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import BoardName from "./board/name";
import BoardNo from "./board/no";

export default function CreateBoard({
  fetchBoards,
}: {
  fetchBoards: Function;
}) {
  const defaultValues = {
    name: "",
    no: "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm<FieldValues>({ defaultValues });

  async function onSubmit(data: Board) {
    handleFormRequest(async () => {
      await axios.post(`${window.backendUrl}/api/boards`, data);

      reset(defaultValues);

      fetchBoards();
    }, setError);
  }

  return (
    <li className="flex gap-2 p-1">
      <div className="flex basis-0 gap-2">
        <BoardName register={register} errors={errors} />
        <BoardNo register={register} errors={errors} />
      </div>

      <button
        aria-label="create-board"
        className="icon-[ic--baseline-add] mt-1 text-2xl"
        type="button"
        onClick={handleSubmit(onSubmit)}
      />
    </li>
  );
}
