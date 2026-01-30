import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import MainTableRemote from "./components/MainTableRemote.tsx";
import {
    deleteBlogPost,
    getBlogPostPagination,
} from "../../../api/blog/blog_post.ts";
import { PostFormPage } from "./components/PostFormPage.tsx";
import {
    showConfirm,
    showError,
    showSuccess,
} from "../../../helpers/confirm_delete.helper.tsx";
import { BlogPost } from "../../../types/blogs/blog_posts.type.ts";

export default function PostPage() {
    const [optionSearch, setOptionSearch] = useState({
        column: "title",
        search: "",
        page: 1,
        perPage: 5,
        total: 0,
        isSearch: true,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<BlogPost[]>([]);
    const [dataEdit, setDataEdit] = useState<BlogPost | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAdd = () => {
        setDataEdit(null);
        setIsModalOpen(true);
    };

    const fetchData = () => {
        if (optionSearch.isSearch) {
            setIsLoading(true);
            getBlogPostPagination({
                page: optionSearch.page,
                perPage: optionSearch.perPage,
                column: optionSearch.column,
                search: optionSearch.search,
            })
                .then((res) => {
                    setData(res.data);
                    setOptionSearch({
                        ...optionSearch,
                        isSearch: false,
                        total: res.total,
                    });
                })
                .finally(() => setIsLoading(false));
        }
    };

    const handleReset = () => {
        setOptionSearch({
            column: "title",
            search: "",
            page: 1,
            perPage: 5,
            total: 0,
            isSearch: true,
        });
    };

    const handleSearch = () => {
        setOptionSearch({
            ...optionSearch,
            isSearch: true,
        });
    };

    useEffect(() => {
        fetchData();
    }, [optionSearch]);

    const handleDelete = (data: BlogPost) => {
        showConfirm("Are you sure?", `Are you sure you want to delete "${data.title}"?`).then((result) => {
            if (result) {
                deleteBlogPost(data.id.toString())
                    .then(() => {
                        setOptionSearch({
                            ...optionSearch,
                            isSearch: true,
                        });
                        showSuccess("Post deleted successfully");
                    })
                    .catch((err) => {
                        showError("Error!", err.response?.data?.message || "Something went wrong");
                    });
            }
        });
    };

    const handleEdit = (data: BlogPost) => {
        setDataEdit(data);
        setIsModalOpen(true);
    };

    return (
        <>
            <PageMeta
                title="Saetechnology - Blogs - Post"
                description="Saetechnology - Blogs - Post"
            />
            <PageBreadcrumb pageTitle="Post" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Blog Posts
                </h3>

                {/* 🔍 Toolbar filter & action */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side: filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={optionSearch.column}
                            onChange={(e) =>
                                setOptionSearch({
                                    ...optionSearch,
                                    column: e.target.value,
                                })
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="title">Title</option>
                            <option value="status">Status</option>
                        </select>

                        <input
                            type="text"
                            value={optionSearch.search}
                            onChange={(e) =>
                                setOptionSearch({
                                    ...optionSearch,
                                    search: e.target.value,
                                })
                            }
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
                    <MainTableRemote
                        action={true}
                        isLoading={isLoading}
                        data={[...data]}
                        page={optionSearch.page}
                        perPage={optionSearch.perPage}
                        total={optionSearch.total}
                        setPage={(value: number) =>
                            setOptionSearch({
                                ...optionSearch,
                                page: value,
                                isSearch: true,
                            })
                        }
                        setPerPage={(value: number) =>
                            setOptionSearch({
                                ...optionSearch,
                                perPage: value,
                                isSearch: true,
                            })
                        }
                        setIsReload={() =>
                            setOptionSearch({
                                ...optionSearch,
                                isSearch: true,
                            })
                        }
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                </div>
            </div>

            <PostFormPage
                dataEdit={dataEdit}
                isModalOpen={isModalOpen}
                setIsModalOpen={() => {
                    setIsModalOpen(!isModalOpen);
                    setOptionSearch({
                        ...optionSearch,
                        isSearch: true,
                    });
                }}
            />
        </>
    );
}
