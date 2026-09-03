import {notFound} from "next/navigation"
import { getProductBySlug } from "@/libs/api"
import {ProductRaw} from "@/utils/format"
import ProductDetails from "@/components/ProductDetails"
import type { AxiosError } from "axios"
import Link from "next/link"

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
    return (
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We could not load this product right now. Please try again later.
        </p>
        <Link href="/" className="text-blue-600 font-semibold underline">Back to Home</Link>
      </main>
    )
  }
  return <ProductDetails product={product}/>
}