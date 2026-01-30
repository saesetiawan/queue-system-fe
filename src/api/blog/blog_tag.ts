import axiosClient from "../../clients/axios_client.ts";
import {BlogTag} from "../../types/blogs/blog_tag.type.ts";

interface ResponseBlogTagPagination {
    data: BlogTag[];
    total: number;
    page: number;
    perPage: number;
}

const baseUrl = '/blog/tag';

interface Query {
    page: number;
    perPage: number;
    column: string;
    search: string,
}

export interface PayloadBlogTag {
    name: string;
    slug: string;
}

export interface UpdatePayloadBlogTag {
    id: number;
    name: string;
    slug: string;
}

export const getBlogTagPagination = async ({ page, perPage, column, search}: Query): Promise<ResponseBlogTagPagination> => {
    const searchParams = `?page=${page}&perPage=${perPage}&search=${search}&column=${column}`;
    const res = await axiosClient.get<ResponseBlogTagPagination>(`${baseUrl}${searchParams}`);
    return res.data;
};

export const createBlogTag = async (payload: PayloadBlogTag): Promise<PayloadBlogTag> => {
    const res = await axiosClient.post<BlogTag>(`${baseUrl}`, {
        ...payload
    });
    return res.data;
};

export const updateBlogTag = async (payload: UpdatePayloadBlogTag): Promise<BlogTag> => {
    const res = await axiosClient.put<BlogTag>(`${baseUrl}`, {
        ...payload
    });
    return res.data;
};


export const deleteBlogTag = async (id: string): Promise<BlogTag> => {
    const res = await axiosClient.delete<BlogTag>(`${baseUrl}/${id}`);
    return res.data;
};
