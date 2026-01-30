import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {useEffect} from "react";
import {IconButton, CircularProgress} from "@mui/material";
import {Edit, Delete} from "@mui/icons-material";
import {BlogPost} from "../../../../types/blogs/blog_posts.type.ts";

const headers = [
  { label: "No", value: "no" },
  { label: "Title", value: "title" },
  { label: "Content", value: "content" },
  { label: "Category", value: "category" },
  { label: "Tags", value: "tags" },
  { label: "Status", value: "status" },
];

interface TableRemoteProps {
  data: BlogPost[];
  page: number;
  perPage: number;
  total: number;
  setPage:  (value: number) => void;
  setPerPage:  (value: number) => void;
  setIsReload: () => void;
  handleEdit?: (data: BlogPost) => void;
  handleDelete?: (data: BlogPost) => void;
  isLoading: boolean;
  action?: boolean;
}

export default function MainTableRemote({
                                          action = true,
                                          isLoading,
                                          handleDelete,
                                          handleEdit,
                                          data,
                                          page,
                                          perPage,
                                          total = 50,
                                          setPage,
                                          setPerPage,
                                          setIsReload,
                                        }: TableRemoteProps) {

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const totalPages = Math.ceil(total / perPage);

  const handlePrev = () => setPage(Math.max(page - 1, 1));
  const handleNext = () => setPage(Math.min(page + 1, totalPages));
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
  };

  useEffect(() => {
    setIsReload();
  }, [perPage, page]);

  const renderCell = (row: BlogPost, key: string) => {
    switch (key) {
      case "no":
        return <>{row.id}</>;
      case "category":
        return <>{row.category?.name || "-"}</>;
      case "tags":
        return (
            <div className="flex flex-wrap gap-1">
              {row.tags?.length
                  ? row.tags.map((tag) => (
                      <span
                          key={tag.id}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      >
                    {tag.name}
                  </span>
                  ))
                  : "-"}
            </div>
        );
      default:
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return <>{(row as keyof never)[key] ?? "-"}</>;
    }
  };

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {headers.map((h, i) => (
                    <TableCell
                        key={`header-${i}`}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {h.label}
                    </TableCell>
                ))}
                {action && (
                    <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Loading State */}
            {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="flex justify-center items-center py-6">
                        <CircularProgress size={28} />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
            ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.length > 0 ? (
                      data.map((row, i) => (
                          <TableRow key={row.id ?? i}>
                            {headers.map(({ value }, j) => (
                                <TableCell
                                    key={`cell-${i}-${j}`}
                                    className="px-4 py-3 text-gray-600 text-start text-sm dark:text-gray-300"
                                >
                                   {renderCell(row, value)}
                                </TableCell>
                            ))}
                            {action && (
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                  <div className="flex gap-2">
                                    {handleEdit && (
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => handleEdit(row)}
                                        >
                                          <Edit fontSize="small" />
                                        </IconButton>
                                    )}
                                    {handleDelete && (
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(row)}
                                        >
                                          <Delete fontSize="small" />
                                        </IconButton>
                                    )}
                                  </div>
                                </TableCell>
                            )}
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                        <TableCell
                            className="text-center py-4 text-gray-500"
                        >
                          No data found
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
            )}
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">{Math.min(endIndex, total)}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </div>

          <div className="flex items-center gap-3">
            <select
                value={perPage}
                onChange={handlePerPageChange}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            >
              {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                Prev
              </button>
              <span className="px-2 text-sm text-gray-700 dark:text-gray-300">
              {page} / {totalPages}
            </span>
              <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
