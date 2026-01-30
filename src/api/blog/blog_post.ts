import axiosClient from "../../clients/axios_client.ts";
import {BlogPost} from "../../types/blogs/blog_posts.type.ts";
import {BlogCategory} from "../../types/blogs/blog_category.type.ts";
import {BlogTag} from "../../types/blogs/blog_tag.type.ts";

interface ResponseBlogPostPagination {
    data: BlogPost[];
    total: number;
    page: number;
    perPage: number;
}

const baseUrl = '/blog/post';

interface Query {
    page: number;
    perPage: number;
    column: string;
    search: string,
}

export interface PayloadBlogPost {
    title: string;
    content: string;
    coverImage: string;
    status: string;
    categoryId: number;
    tagIds: number[];
}

export interface UpdatePayloadBlogPost {
    id: number;
    title: string;
    content: string;
    coverImage: string;
    status: string;
    categoryId: number;
    tagIds: number[];
}

export const getBlogPostPagination = async ({ page, perPage, column, search}: Query): Promise<ResponseBlogPostPagination> => {
    const searchParams = `?page=${page}&perPage=${perPage}&search=${search}&column=${column}`;
    const res = await axiosClient.get<ResponseBlogPostPagination>(`${baseUrl}${searchParams}`);
    return res.data;
};

export const createBlogPost = async (payload: PayloadBlogPost): Promise<BlogPost> => {
    const res = await axiosClient.post<BlogPost>(`${baseUrl}`, {
        ...payload
    });
    return res.data;
};

export const updateBlogPost = async (payload: UpdatePayloadBlogPost): Promise<BlogPost> => {
    const res = await axiosClient.put<BlogPost>(`${baseUrl}`, {
        ...payload
    });
    return res.data;
};


export const deleteBlogPost = async (id: string): Promise<BlogPost> => {
    const res = await axiosClient.delete<BlogPost>(`${baseUrl}/${id}`);
    return res.data;
};
