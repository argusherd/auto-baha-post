"use client";

import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

export default function BoardItem({
  board,
  fetchBoards,
}: {
  board: Board;
  fetchBoards: Function;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { register, getValues } = useForm({
    defaultValues: {
      no: board.no,
      name: board.name,
    },
  });
  const { setValue: setParentValue, getValues: getParentValues } =
    useFormContext();

  async function handleDelete() {
    await axios.delete(`${window.backendUrl}/api/boards/${board.id}`);

    if (getParentValues("board") == board.id) setParentValue("board", "");

    fetchBoards();
  }

  async function handleUpdate() {
    await axios.put(`${window.backendUrl}/api/boards/${board.id}`, getValues());

    fetchBoards();
  }

  return (
    <li>
      {isEditing ? (
        <div>
          <input type="text" placeholder="No" {...register("no")} />
          <input type="text" placeholder="Name" {...register("name")} />

          <button onClick={handleUpdate}>Confirm</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <div onClick={() => setParentValue("board", board.id)}>
            <span>{board.no}</span>
            <span>{board.name}</span>
          </div>

          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
}
