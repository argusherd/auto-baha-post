"use client";

import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { FieldValidationError } from "express-validator";
import { useState } from "react";
import { FieldValues, useForm, useFormContext } from "react-hook-form";
import BoardName from "./name";
import BoardNo from "./no";

export default function BoardItem({
  board,
  fetchBoards,
}: {
  board: Board;
  fetchBoards: Function;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      no: board.no,
      name: board.name,
    },
  });
  const { setValue: setParentValue, getValues: getParentValues } =
    useFormContext();

  async function handleDelete() {
    await axios.delete(`${window.backendUrl}/api/boards/${board.id}`);

    if (getParentValues("board_id") == board.id) {
      setParentValue("board_id", "");
      setParentValue("scheduled_at", "");
    }

    fetchBoards();
  }

  async function handleUpdate(data: Board) {
    try {
      await axios.put(`${window.backendUrl}/api/boards/${board.id}`, data);

      setIsEditing(false);

      fetchBoards();
    } catch (error) {
      error.response.data.errors.forEach((item: FieldValidationError) => {
        setError(item.path, { message: item.msg });
      });
    }
  }

  return (
    <li className="p-1">
      {isEditing ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <BoardName register={register} errors={errors} />
            <BoardNo register={register} errors={errors} />
          </div>

          <div className="flex gap-2">
            <button
              aria-label="confirm"
              className="icon-[material-symbols--check] text-2xl"
              type="button"
              onClick={handleSubmit(handleUpdate)}
            />
            <button
              aria-label="cancel"
              className="icon-[material-symbols--cancel-outline] text-2xl"
              type="button"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <p
            className="grow cursor-pointer rounded border border-transparent px-2 py-1 hover:bg-gray-200"
            data-testid="display"
            onClick={() => setParentValue("board_id", board.id)}
          >
            <span>{board.name}</span>
            <span className="ml-1 text-sm underline">{board.no}</span>
          </p>

          <div className="flex gap-2">
            <button
              aria-label="edit"
              className="icon-[material-symbols--edit-outline] text-2xl"
              type="button"
              onClick={() => {
                setIsEditing(true);
                reset();
              }}
            />
            <button
              aria-label="delete"
              className="icon-[material-symbols--delete-outline] text-2xl"
              type="button"
              onClick={handleDelete}
            />
          </div>
        </div>
      )}
    </li>
  );
}
