"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import PostInputs from "../_posts/post-inputs";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const POST_ID = params.get("id");
  const methods = useForm({
    defaultValues: getPostData,
  });
  const { handleSubmit } = methods;

  async function getPostData() {
    const requestUrl = `${window.backendUrl}/api/posts/${POST_ID}`;
    const getPost = await axios.get<Post>(requestUrl);

    if (getPost.status == 404) {
      return router.push("/posts/create");
    }

    const { board_id, scheduled_at, ...others } = getPost.data;

    return {
      ...others,
      board: board_id,
      scheduled_at: scheduled_at
        ? moment(scheduled_at).format("YYYY-MM-DDTHH:mm")
        : "",
    };
  }

  async function onSubmit(data: Post) {
    await axios.put(window.backendUrl + `/api/posts/${POST_ID}`, data);
  }

  async function handleDelete() {
    const res = await axios.delete(window.backendUrl + `/api/posts/${POST_ID}`);

    if (res.status == 200) router.push("/posts");
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormProvider {...methods}>
        <PostInputs />
      </FormProvider>

      <button onClick={handleSubmit(onSubmit)}>Save</button>
      <button data-testid="delete-post" onClick={handleDelete}>
        Delete
      </button>
    </form>
  );
}
