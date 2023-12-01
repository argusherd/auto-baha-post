import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Paginator({ lastPage = 1 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString());
  const currentPage = Number(params.get("page")) || 1;
  const startPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
  const endPage = currentPage + 2 > lastPage ? lastPage : currentPage + 2;

  function createLink(page: number) {
    params.set("page", String(page));

    let query = params.toString();

    return (
      <Link
        className={
          `rounded border border-teal-500 px-2 py-1` +
          (currentPage === page ? " bg-teal-600 text-white" : "")
        }
        key={page}
        href={`${pathname}?${query}`}
      >
        {page}
      </Link>
    );
  }

  function createLinks() {
    const links = [];

    for (let i = startPage; i <= endPage && i <= lastPage; i++) {
      links.push(createLink(i));
    }

    return links;
  }

  return (
    <div className="flex justify-center gap-1">
      {startPage !== 1 && createLink(1)}
      {startPage !== 1 && <span>...</span>}
      {createLinks()}
      {endPage !== lastPage && <span>...</span>}
      {endPage !== lastPage && createLink(lastPage)}
    </div>
  );
}
