"use client";

import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function BoardItem({
  board,
  assign,
  fetchBoards,
}: {
  board: Board;
  assign: Function;
  fetchBoards: Function;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const { register, getValues } = useForm({
    defaultValues: {
      no: board.no,
      name: board.name,
    },
  });

  async function handleDelete() {
    await axios.delete(`${window.backendUrl}/api/boards/${board.id}`);

    fetchBoards();
  }

  async function handleUpdate() {
    await axios.put(`${window.backendUrl}/api/boards/${board.id}`, getValues());

    fetchBoards();
  }

  return (
    <li onClick={() => assign(board)}>
      {isEditing ? (
        <div>
          <input type="text" placeholder="No" {...register("no")} />
          <input type="text" placeholder="Name" {...register("name")} />

          <button onClick={handleUpdate}>Confirm</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{board.no}</span>
          <span>{board.name}</span>

          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
}
