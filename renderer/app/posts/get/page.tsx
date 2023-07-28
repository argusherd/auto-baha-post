"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ViewPost() {
  const router = useRouter();
  const search = useSearchParams();
  const { register, setValue } = useForm();

  useEffect(() => {
    (async () => {
      const res = await axios.get<Post>(
        window.backendUrl + `/api/posts/${search.get("id")}`
      );

      if (res.status == 404) {
        router.push("/posts/create");
      } else {
        setValue("title", res.data.title);
        setValue("content", res.data.content);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form>
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
    </form>
  );
}
