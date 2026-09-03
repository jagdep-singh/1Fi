import {notFound} from "next/navigation"
import { getProductBySlug } from "@/libs/api"
import {ProductRaw} from "@/utils/format"
import ProductDetails from "@/components/ProductDetails"
import type { AxiosError } from "axios"

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error
}

export default async function ProductPage({params} : {params : Promise<{slug: string}>}) {
  const {slug} = await params
  let product : ProductRaw
  try{
    product = await getProductBySlug(slug)
  }catch(error: unknown){ 
    if(isAxiosError(error) && error.response?.status === 404){
      notFound()
    }
  throw error
  }
  return <ProductDetails product={product}/>
}