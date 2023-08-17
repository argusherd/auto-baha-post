"use client";

import Board from "@/backend-api/database/entities/Board";
import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const HTTP_CREATED = 201;

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const res = await axios.get(`${window.backendUrl}/api/boards`);
      setBoards(res.data);
    };

    fetchBoards();
  }, []);

  async function onSubmit(data: Post) {
    const url = window.backendUrl + "/api/posts";

    const res = await axios.post(url, data);

    if (res.status == HTTP_CREATED) {
      reset();

      router.push("/posts");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <select {...register("board")}>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>

      <textarea
        className="border"
        placeholder="Content"
        {...register("content", { required: "Content is required" })}
      ></textarea>
      {errors.content && <small>{errors.content.message}</small>}

      <button>Save</button>
    </form>
  );
}
