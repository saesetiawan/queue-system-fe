import { useEffect, useState } from "react";
import { createBlogPost, updateBlogPost } from "../../../../api/blog/blog_post.ts";
import { getBlogCategoryPagination } from "../../../../api/blog/blog_category.ts";
import { getBlogTagPagination } from "../../../../api/blog/blog_tag.ts";
import { AxiosError } from "axios";
import Alert from "../../../../components/ui/alert/Alert.tsx";
import {
    closeSwalLoading,
    openSwalLoading,
} from "../../../../helpers/loading.helper.tsx";
import {
    showConfirm,
    showSuccess,
} from "../../../../helpers/confirm_delete.helper.tsx";
import { BlogPost } from "../../../../types/blogs/blog_posts.type.ts";
import { BlogCategory } from "../../../../types/blogs/blog_category.type.ts";
import { BlogTag } from "../../../../types/blogs/blog_tag.type.ts";

interface PostFormPageProps {
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
    dataEdit?: BlogPost | null;
}

export const PostFormPage = ({
                                 dataEdit,
                                 isModalOpen,
                                 setIsModalOpen,
                             }: PostFormPageProps) => {
    const [form, setForm] = useState({
        id: "",
        title: "",
        content: "",
        coverImage: "",
        status: "draft",
        categoryId: "",
        tagIds: [] as string[],
    });

    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const closeModalHandle = () => {
        setErrorMessage("");
        setForm({
            id: "",
            title: "",
            content: "",
            coverImage: "",
            status: "draft",
            categoryId: "",
            tagIds: [],
        });
        setIsModalOpen(false);
    };

    useEffect(() => {
        // fetch categories & tags for dropdown
        getBlogCategoryPagination({ page: 1, perPage: 100, column: "", search: "" }).then((res) =>
            setCategories(res.data)
        );
        getBlogTagPagination({ page: 1, perPage: 100, column: "", search: ""  }).then((res) =>
            setTags(res.data)
        );
    }, []);

    useEffect(() => {
        if (dataEdit) {
            setForm({
                id: dataEdit.id.toString(),
                title: dataEdit.title,
                content: dataEdit.content,
                coverImage: dataEdit.coverImage || "",
                status: dataEdit.status,
                categoryId: dataEdit.category?.id?.toString() || "",
                tagIds: dataEdit.tags?.map((t) => t.id.toString()) || [],
            });
        }
    }, [dataEdit]);

    const errorHandler = (err: unknown) => {
        if (err instanceof AxiosError) {
            if (err?.response?.data?.message) {
                if (typeof err.response.data.message === "string") {
                    setErrorMessage(err.response.data.message);
                } else {
                    setErrorMessage(err.response.data.message[0] || "Validation error");
                }
            }
        } else {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleSave = async () => {
        const result = await showConfirm(
            "Are you sure?",
            `You want to ${form.id ? "update" : "create"} this post?`,
            "Yes, save it!",
            "question"
        );
        if (!result) return;

        setIsLoading(true);
        openSwalLoading();

        try {
            const payload = {
                ...form,
                categoryId: form.categoryId ? Number(form.categoryId) : undefined,
                tagIds: form.tagIds,
            };

            if (form.id) {
                await updateBlogPost({ ...payload, id: Number(form.id), categoryId: Number(form.categoryId), tagIds: form.tagIds.map((item) => Number(item))  });
            } else {
                await createBlogPost({
                    ...payload,
                    categoryId: Number(form.categoryId),
                    tagIds: form.tagIds.map((item) => Number(item)),});
            }

            showSuccess(
                "Success",
                `Post has been ${form.id ? "updated" : "created"} successfully`
            );
            closeModalHandle();
        } catch (err) {
            errorHandler(err);
            closeSwalLoading();
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTag = (id: number) => {
        setForm((prev) => {
            const exists = prev.tagIds.includes(id.toString());
            return {
                ...prev,
                tagIds: exists
                    ? prev.tagIds.filter((tagId) => tagId !== id.toString())
                    : [...prev.tagIds, id.toString()],
            };
        });
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                        <h2 className="mb-4 text-lg font-semibold">
                            {form.id ? "Edit" : "Add"} Post
                        </h2>

                        {errorMessage && (
                            <Alert
                                variant={"error"}
                                title={"Error Validation"}
                                message={errorMessage}
                            />
                        )}

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                placeholder="Title"
                                className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                            />

                            <textarea
                                value={form.content}
                                onChange={(e) =>
                                    setForm({ ...form, content: e.target.value })
                                }
                                placeholder="Content"
                                rows={5}
                                className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                            />

                            <input
                                type="text"
                                value={form.coverImage}
                                onChange={(e) =>
                                    setForm({ ...form, coverImage: e.target.value })
                                }
                                placeholder="Cover Image URL"
                                className="w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                            />

                            <div>
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({ ...form, status: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) =>
                                        setForm({ ...form, categoryId: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-800"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Tags</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => toggleTag(tag.id)}
                                            type="button"
                                            className={`rounded-full px-3 py-1 text-xs font-medium border ${
                                                form.tagIds.includes(tag.id.toString())
                                                    ? "bg-brand-500 text-white border-brand-500"
                                                    : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-white"
                                            }`}
                                        >
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={closeModalHandle}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isLoading}
                                onClick={handleSave}
                                className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

