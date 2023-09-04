"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import PostInputs from "../_posts/post-inputs";

const HTTP_CREATED = 201;

export default function CreatePost() {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const router = useRouter();

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
      <FormProvider {...methods}>
        <PostInputs />
      </FormProvider>

      <button>Save</button>
    </form>
  );
}
