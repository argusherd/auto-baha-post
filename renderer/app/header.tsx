import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href={"/"}>Home</Link>
      <button onClick={() => window.electron.openBaha()}>Open Baha</button>
    </header>
  );
}
