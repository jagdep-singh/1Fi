import Link from "next/link"
import { getProducts } from "@/libs/api"
import {toNumber , formatINR} from "@/utils/format"


export default async function Home() {
  const products = await getProducts()

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/products/${product.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <div className="w-full h-48 flex items-center justify-center bg-white">
              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg text-gray-900">{product.name}</h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-green-800 font-bold">
                  {formatINR(toNumber(product.price))}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatINR(toNumber(product.mrp))}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}