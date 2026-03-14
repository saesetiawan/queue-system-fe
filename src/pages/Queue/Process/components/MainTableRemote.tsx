import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { QueueServiceData } from "../../../../types/queue/queue_service";
import {useEffect} from "react";
import {IconButton, CircularProgress} from "@mui/material";
import {Edit, Delete, DisplaySettingsOutlined, FrontHandOutlined,} from "@mui/icons-material";

const headers = [
  { label: "No", value: "id" },
  { label: "Name", value: "name" },
  { label: "Description", value: "description" }, // contoh mapping field
];

interface TableRemoteProps {
  data: QueueServiceData[];
  page: number;
  perPage: number;
  total: number;
  setPage:  (value: number) => void;
  setPerPage:  (value: number) => void;
  setIsReload: () => void
  handleEdit?: (data: QueueServiceData) => void
  isLoading: boolean,
  handleDelete?: (data: QueueServiceData) => void
  action?: boolean
  handleOperationQueue?: (data: QueueServiceData) => void
  handleGetQueue?: (data: QueueServiceData) => void
}

export default function MainTableRemote({ handleGetQueue, handleOperationQueue, action, isLoading, handleDelete, handleEdit, data, page, perPage, setPage, total = 50, setPerPage, setIsReload }: TableRemoteProps) {
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const totalPages = Math.ceil(total / perPage);
  const handlePrev = () => setPage(Math.max(page - 1, 1));
  const handleNext = () => setPage(Math.min(page + 1, totalPages));
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
  };

  useEffect(() => {
    setIsReload()
  }, [perPage, page]);
  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
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
                <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {isLoading && (
                <div className="flex justify-center items-center">
                  <CircularProgress />
                </div>
            )}
            {/* Table Body */}
            {!isLoading && (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.map((row, i) => (
                      <TableRow key={i}>
                        {headers.map(({ value }, j) => (
                            <TableCell
                                key={`cell-${i}-${j}`}
                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                              {row[value as keyof QueueServiceData] ?? "-"}
                            </TableCell>
                        ))}
                        {action && (
                            <TableCell
                                className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                              <div className="flex gap-2">
                                {handleEdit && (
                                    <IconButton
                                        title={"Edit"}
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEdit(row)} // buat function handleEdit
                                    >
                                      <Edit fontSize="small"/>
                                    </IconButton>
                                )}
                                {handleDelete && (
                                    <IconButton
                                        title={"Delete"}
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete(row)} // buat function handleDelete
                                    >
                                      <Delete fontSize="small"/>
                                    </IconButton>
                                )}
                                {handleGetQueue && (
                                    <IconButton
                                        title={"Get Number Queue"}
                                        color="info"
                                        size="small"
                                        onClick={() => handleGetQueue(row)} // buat function handleDelete
                                    >
                                      <FrontHandOutlined fontSize="small"/>
                                    </IconButton>
                                )}
                                {handleOperationQueue && (
                                    <IconButton
                                        title={"Go Operation Queue"}
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleOperationQueue(row)} // buat function handleDelete
                                    >
                                      <DisplaySettingsOutlined fontSize="small"/>
                                    </IconButton>
                                )}
                              </div>
                            </TableCell>
                        )}
                      </TableRow>
                  ))}
                </TableBody>
            )}
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          {/* Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
            {Math.min(endIndex, total)}
          </span>{" "}
            of <span className="font-medium">{total}</span> results
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <select
                value={perPage}
                onChange={(e) => handlePerPageChange(e)}
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