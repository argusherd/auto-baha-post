"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const getTables = async () => {
      const tables = await window.electron.getTables();
      setTables(() => tables);
    };

    getTables();
  }, []);

  return (
    <>
      <h1 className="underline text-green-600 font-bold text-2xl">Hi</h1>
      <ul>
        {tables.map((table, idx) => (
          <li key={idx}>{table.name}</li>
        ))}
      </ul>
    </>
  );
}
