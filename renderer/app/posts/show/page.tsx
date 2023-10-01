"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import PostInputs from "../_posts/post-inputs";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const POST_ID = params.get("id");
  const requestUrl = `${window.backendUrl}/api/posts/${POST_ID}`;
  const methods = useForm<Partial<Post>>({
    defaultValues: getPostData,
  });
  const { handleSubmit } = methods;
  const [isAssignedToBoard, setIsAssignedToBoard] = useState(false);

  async function getPostData() {
    const getPost = await axios.get<Post>(requestUrl);

    if (getPost.status == 404) {
      router.push("/posts/create");
    }

    const { scheduled_at, ...others } = getPost.data;

    setIsAssignedToBoard(Boolean(others.board_id));

    return {
      ...others,
      scheduled_at: scheduled_at
        ? moment(scheduled_at).format("YYYY-MM-DDTHH:mm")
        : "",
    };
  }

  async function onSubmit(data: Post) {
    const updatePost = await axios.put<Post>(requestUrl, data);

    setIsAssignedToBoard(Boolean(updatePost.data.board_id));
  }

  async function handleDelete() {
    const res = await axios.delete(requestUrl);

    if (res.status == 200) router.push("/posts");
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormProvider {...methods}>
        <PostInputs />
      </FormProvider>

      <button onClick={handleSubmit(onSubmit)}>Save</button>
      <button
        disabled={!isAssignedToBoard}
        onClick={() => window.electron.publishNow(Number(POST_ID))}
      >
        Publish Now
      </button>
      <button data-testid="delete-post" onClick={handleDelete}>
        Delete
      </button>
    </form>
  );
}
