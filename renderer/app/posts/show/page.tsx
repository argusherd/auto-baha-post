"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Boards from "../_boards";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const { register, setValue, handleSubmit } = useForm();
  const POST_ID = params.get("id");
  const [boardId, setBoardId] = useState<number>();

  useEffect(() => {
    (async () => {
      const getPost = await axios.get<Post>(
        window.backendUrl + `/api/posts/${POST_ID}`
      );

      if (getPost.status == 404) {
        router.push("/posts/create");
      } else {
        const { title, content, board_id } = getPost.data;

        setValue("title", title);
        setValue("content", content);
        setValue("board", board_id);
        setBoardId(board_id);
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

      <Boards defaultValue={boardId} register={register} setValue={setValue} />

      <textarea
        placeholder="Content"
        {...register("content", {
          required: "Content is required",
        })}
      ></textarea>

      <button>Save</button>
      <button data-testid="delete-post" onClick={handleDelete}>
        Delete
      </button>
    </form>
  );
}
