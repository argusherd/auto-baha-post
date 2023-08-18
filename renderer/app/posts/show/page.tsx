"use client";

import Board from "@/backend-api/database/entities/Board";
import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const { register, setValue, handleSubmit } = useForm();
  const POST_ID = params.get("id");
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    (async () => {
      const getBoards = await axios.get<Board[]>(
        `${window.backendUrl}/api/boards`
      );

      setBoards(getBoards.data);

      const getPost = await axios.get<Post>(
        window.backendUrl + `/api/posts/${POST_ID}`
      );

      if (getPost.status == 404) {
        router.push("/posts/create");
      } else {
        setValue("title", getPost.data.title);
        setValue("content", getPost.data.content);
        setValue("board", getPost.data.board_id);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(data: Post) {
    await axios.put(window.backendUrl + `/api/posts/${POST_ID}`, data);
  }

  async function handleDelete(event: MouseEvent) {
    event.preventDefault();

    const res = await axios.delete(window.backendUrl + `/api/posts/${POST_ID}`);

    if (res.status == 200) router.push("/posts");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="Title"
        {...register("title", {
          required: "Title is required",
        })}
      />

      <select {...register("board")}>
        <option value="" disabled>
          Publish to
        </option>
        {boards?.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Content"
        {...register("content", {
          required: "Content is required",
        })}
      ></textarea>

      <button>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </form>
  );
}
