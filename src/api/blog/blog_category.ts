import axiosClient from "../../clients/axios_client.ts";
import {BlogCategory} from "../../types/blogs/blog_category.type.ts";

interface ResponseBlogCategoryPagination {
    data: BlogCategory[];
    total: number;
    page: number;
    perPage: number;
}

interface Query {
    page: number;
    perPage: number;
    column: string;
    search: string,
}

export const getBlogCategoryPagination = async ({ page, perPage, column, search}: Query): Promise<ResponseBlogCategoryPagination> => {
    const searchParams = `?page=${page}&perPage=${perPage}&search=${search}&column=${column}`;
    const res = await axiosClient.get<ResponseBlogCategoryPagination>(`/blog/category${searchParams}`);
    return res.data;
};

export interface PayloadBlogCategory {
    name: string;
    slug: string;
}

export const createBlogCategory = async (payload: PayloadBlogCategory): Promise<BlogCategory> => {
    const res = await axiosClient.post<BlogCategory>(`/blog/category`, {
        ...payload
    });
    return res.data;
};

export const updateBlogCategory = async (payload: PayloadBlogCategory): Promise<BlogCategory> => {
    const res = await axiosClient.put<BlogCategory>(`/blog/category`, {
        ...payload
    });
    return res.data;
};


export const deleteBlogCategory = async (id: string): Promise<BlogCategory> => {
    const res = await axiosClient.delete<BlogCategory>(`/blog/category/${id}`);
    return res.data;
};
