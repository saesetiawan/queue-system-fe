import {useEffect, useState} from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import MainTableRemote from "./components/MainTableRemote.tsx";
import {QueueServiceData} from "../../../types/queue/queue_service.ts";
import {deleteQueueService, getQueueService} from "../../../api/queue/service.ts";
import {ServiceFormPage} from "./components/ServiceFormPage.tsx";
import {showConfirm, showError, showSuccess} from "../../../helpers/confirm_delete.helper.tsx";

export default function QueueServicePage() {
    const [optionSearch, setOptionSearch] = useState({
        column: 'name',
        search: '',
        page: 1,
        perPage: 5,
        total: 0,
        isSearch: true
    });
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<QueueServiceData[]>([]);
    const [dataEdit, setDataEdit] = useState<QueueServiceData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 👈 state modal
    const handleAdd = () => {
        setIsModalOpen(true); // buka modal
    };

    const fetchData = () => {
        if(optionSearch.isSearch) {
            setIsLoading(true);
            getQueueService({
                page: optionSearch.page,
                perPage: optionSearch.perPage,
                column: optionSearch.column,
                search: optionSearch.search,
            }).then((res) => {
                setData(res.data)
                setOptionSearch({
                    ...optionSearch,
                    isSearch: false,
                    total: res.total,
                })
            }).finally(() => {
                setIsLoading(false)
            })
        }
    };

    const handleReset = () => {
        setOptionSearch((prev) => ({
            ...prev,
            column: 'name',
            search: '',
            page: 1,
            perPage: 5,
            total: 0,
            isSearch: true
        }))
    };

    const handleSearch = () => {
        setOptionSearch({
            ...optionSearch,
            isSearch: true,
        })
    }
    useEffect(() => {
        fetchData()
    }, [optionSearch]);

    const handleDelete = (data: QueueServiceData) => {
        showConfirm("Are you sure?", `Are you sure wanna delete this ${data.name}?`).then((result) => {
            if (result) {
                deleteQueueService(data.id.toString()).then(() => {
                    setOptionSearch({
                        ...optionSearch,
                        isSearch: true
                    })
                    showSuccess('Category deleted successfully')
                }).catch((err) => {
                    showError("Error!", err.response?.data?.message || "Something went wrong")
                })
            }
        })
    };

    const handleEdit = (data: BlogCategory) => {
        setDataEdit(data)
        setIsModalOpen(true); // buka modal
    }

    return (
        <>
            <PageMeta
                title="Saetechnology - Queue - Service"
                description="Saetechnology - Queue - Service"
            />
            <PageBreadcrumb pageTitle="Category" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Queue Service
                </h3>

                {/* 🔍 Toolbar filter & action */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side: filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={optionSearch.column}
                            onChange={(e) => setOptionSearch({
                                ...optionSearch,
                                column: e.target.value
                            })}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="name">Name</option>
                            <option value="description">Description</option>
                        </select>

                        <input
                            type="text"
                            value={optionSearch.search}
                            onChange={(e) => setOptionSearch({
                                ...optionSearch,
                                search: e.target.value,
                            })}
                            placeholder="Enter search keyword..."
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />

                        <button
                            onClick={handleSearch}
                            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                        >
                            Search
                        </button>

                        <button
                            onClick={handleReset}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-gray-700"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Right side: Add button */}
                    <button
                        onClick={handleAdd}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                    >
                        + Add
                    </button>
                </div>
                {/* Table */}
                <div className="space-y-6">
                    <MainTableRemote action={true} isLoading={isLoading} setPerPage={(value: number) => {
                        setOptionSearch({
                            ...optionSearch,
                            perPage: value
                        })
                    }} page={optionSearch.page} perPage={optionSearch.perPage} setPage={(value: number) => {
                        setOptionSearch({
                            ...optionSearch,
                            page: value
                        })
                    }} total={optionSearch.total} data={[...data]} setIsReload={() => {
                        setOptionSearch({
                            ...optionSearch,
                            isSearch: true
                        })
                    }}  handleDelete={handleDelete} handleEdit={handleEdit} />
                </div>
            </div>
            <ServiceFormPage dataEdit={dataEdit} isModalOpen={isModalOpen} setIsModalOpen={() => {
                setIsModalOpen(!isModalOpen)
                setOptionSearch({
                    ...optionSearch,
                    isSearch: true
                })
            }} />
        </>
    );
}
