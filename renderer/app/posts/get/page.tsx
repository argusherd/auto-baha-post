"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ViewPost() {
  const router = useRouter();
  const search = useSearchParams();
  const { register, setValue, handleSubmit } = useForm();
  const POST_ID = search.get("id");

  useEffect(() => {
    (async () => {
      const res = await axios.get<Post>(
        window.backendUrl + `/api/posts/${POST_ID}`
      );

      if (res.status == 404) {
        router.push("/posts/create");
      } else {
        setValue("title", res.data.title);
        setValue("content", res.data.content);
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
