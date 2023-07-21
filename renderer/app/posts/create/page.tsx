"use client";

import Post from "@/electron-src/database/entities/Post";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data: Post) {
    const url = window.backendUrl + "/api/posts";

    await axios.post(url, data);

    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

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
