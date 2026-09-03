"use client";

import { useState } from "react";
import type { ProductRaw, VariantRaw, EmiPlanRaw } from "@/utils/format";
import { toNumber, formatINR } from "@/utils/format";
import Link from 'next/link'

export default function ProductDetail({ product }: { product: ProductRaw }) {
  const defaultVariant =
    product.variants.find((v) => v.is_default) || product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState<VariantRaw>(defaultVariant);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState<EmiPlanRaw | null>(null);

  const handleVariantChange = (variant: VariantRaw) => {
    setSelectedVariant(variant);
    setSelectedEmiPlan(null);
  };

  const handleProceed = () => {
    if (!selectedEmiPlan) return;
    alert(
      `Proceeding with:\n` +
      `${selectedVariant.storage} ${selectedVariant.color}\n` +
      `EMI: ${formatINR(toNumber(selectedEmiPlan.monthly_amount))}/mo × ${selectedEmiPlan.tenure_months} months\n` +
      `Cashback: ${formatINR(toNumber(selectedEmiPlan.cashback))}`
    );
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link 
        href="/"
        className="inline-block mb-6"
      >
        ← 
      </Link>
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <img 
          src={selectedVariant.image_url} 
          alt={product.name}
          className="w-full h-full md:w-1/2 object-contain bg-white rounded-lg border border-gray-100"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Select Variant</h2>
            <div className="flex gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedVariant.id === variant.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-400'
                    }`}>
                      {variant.storage} / {variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
              <span className="text-2xl font-bold">
                {formatINR(toNumber(selectedVariant.price))}
              </span>
              <span className="ml-3 text-gray-500 line-through">
                {formatINR(toNumber(selectedVariant.mrp))}
              </span>
          </div>

          <div>
            <h2 className="font-semibold mb-3">Choose an EMI Plan</h2>
            <div className="space-y-3">
              {selectedVariant.emi_plans.map((plan) => (
                <div 
                  key = {plan.id}
                  onClick={() => setSelectedEmiPlan(plan)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedEmiPlan?.id === plan.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className='flex justify-between items-center'>
                     <div>
                      <span className="text-lg font-bold">
                        {formatINR(toNumber(plan.monthly_amount))}/mo
                      </span>
                      <span className="ml-2 text-gray-500">
                        × {plan.tenure_months} months
                      </span>
                    </div>
                    <div className="text-right">
                      {toNumber(plan.interest_rate) === 0 ? (
                        <span className="text-green-600 font-semibold">No Interest</span>
                      ) : (
                        <span className="text-gray-600">
                          {plan.interest_rate}% interest
                        </span>
                      )}
                      {toNumber(plan.cashback) > 0 && (
                        <span className="block text-sm text-green-600">
                          ₹{toNumber(plan.cashback).toLocaleString("en-IN")} cashback
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleProceed}
        disabled={!selectedEmiPlan}
        className={`w-full py-3 rounded-3xl text-lg font-semibold transition-colors ${
          selectedEmiPlan
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {selectedEmiPlan ? "Proceed" : "Select an EMI Plan to Continue"}
      </button>
    </main>
  )
}

