"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const getTables = async () => {
      const tables = await window.electron.getTables();
      setTables(() => tables);
    };

    getTables();

    console.log(window.backendUrl);
  }, []);

  return (
    <>
      <h1 className="underline text-green-600 font-bold text-2xl">Hi</h1>
      <Link href={"/posts/create"}>Create a post</Link>
      <Link href={"/posts"}>All posts</Link>
      <ul>
        {tables.map((table, idx) => (
          <li key={idx}>{table.name}</li>
        ))}
      </ul>
    </>
  );
}
