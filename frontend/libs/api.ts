import axios from "axios";
import type {ProductRaw , ProductSummaryRaw} from "@/utils/format";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export async function getProducts(): Promise<ProductSummaryRaw[]>{
    const {data} = await api.get<ProductSummaryRaw[]>("/products")
    return data
}

export async function getProductBySlug(slug: string): Promise<ProductRaw>{
    const {data} = await api.get<ProductRaw>(`/products/${slug}`)
    return data
}
