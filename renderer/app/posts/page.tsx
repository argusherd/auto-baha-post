"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PostIndex() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(window.backendUrl + "/api/posts");

      setPosts(res.data);
    })();
  }, []);

  return (
    <>
      {posts.length ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <p>{post.title}</p>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>There are no posts.</p>
      )}
    </>
  );
}
