"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Boards from "../_boards";
import ScheduledAt from "../_posts/scheduled-at";

const HTTP_CREATED = 201;

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();
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
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <Boards register={register} setValue={setValue} />

      {watch("board") && <ScheduledAt register={register} />}

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
