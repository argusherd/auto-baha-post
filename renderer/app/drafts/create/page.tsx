"use client";

import Draft from "@/electron-src/database/entities/Draft";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function CreateDraft() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data: Draft) {
    const url = window.backendUrl + "/api/drafts";

    await axios.post(url, data);

    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="border"
        placeholder="Subject"
        {...register("subject", { required: "Subject is required" })}
      />
      {errors.subject && <small>{errors.subject.message}</small>}

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
