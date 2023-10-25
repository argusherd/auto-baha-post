"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href={"/posts/create"}>Create a post</Link>
      <Link href={"/posts"}>All posts</Link>
    </>
  );
}
