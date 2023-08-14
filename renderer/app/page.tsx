"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="underline text-green-600 font-bold text-2xl">Hi</h1>
      <Link href={"/posts/create"}>Create a post</Link>
      <Link href={"/posts"}>All posts</Link>
    </>
  );
}
