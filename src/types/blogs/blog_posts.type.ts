import {BlogCategory} from "./blog_category.type.ts";
import {BlogTag} from "./blog_tag.type.ts";

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    coverImage: string;
    status: string;
    category: BlogCategory;
    tags: BlogTag[];
}