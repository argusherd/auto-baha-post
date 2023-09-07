"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PostInputs from "../_posts/post-inputs";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const methods = useForm();
  const { setValue, handleSubmit } = methods;
  const POST_ID = params.get("id");

  useEffect(() => {
    (async () => {
      const getPost = await axios.get<Post>(
        window.backendUrl + `/api/posts/${POST_ID}`
      );

      if (getPost.status == 404) {
        router.push("/posts/create");
      } else {
        const { title, content, board_id, scheduled_at } = getPost.data;

        setValue("title", title);
        setValue("content", content);
        setValue("board", board_id);
        setValue("scheduled_at", scheduled_at);
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
      <FormProvider {...methods}>
        <PostInputs />
      </FormProvider>

      <button>Save</button>
      <button data-testid="delete-post" onClick={handleDelete}>
        Delete
      </button>
    </form>
  );
}
