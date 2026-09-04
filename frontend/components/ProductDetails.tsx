"use client";

import { useState } from "react"
import type { ProductRaw, VariantRaw, EmiPlanRaw } from "@/utils/format"
import { toNumber, formatINR } from "@/utils/format"
import Link from "next/link"

export default function ProductDetail({ product }: { product: ProductRaw }) {
  const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];

  const [selectedVariant, setSelectedVariant] =useState<VariantRaw>(defaultVariant);
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
    <div className="min-h-screen">

      <div
        className="flex items-center justify-end px-6 md:px-10 py-5"
      >
        <Link
          href="/"
          className="text-muted flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
        >
          ← back to products
        </Link>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 md:px-10 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-10 md:gap-[72px]">
          {/* img*/}
          <div className="md:sticky md:top-8 md:self-start">
            <div
              className="aspect-square flex items-center justify-center overflow-hidden mb-5"
              
            >
              <img
                draggable={false}
                src={selectedVariant.image_url}
                alt={product.name}
                className="w-[82%] h-[82%] object-contain transition-opacity duration-200"
              />
            </div>
          </div>

          
          <div>
            <div className="text-[13px] mb-1.5 text-muted">
              {product.name.split(" ")[0] || "Product"}
            </div>

            <h1
              className="text-[36px] leading-[1.08] tracking-[-0.01em] mb-1.5 font-medium"
            >
              {product.name}
            </h1>

            <p
              className="text-[14.5px] leading-relaxed max-w-[44ch] mb-7 text-muted"
            >
              {product.description}
            </p>

            <div
              className="pb-6 mb-7 border-b border-line"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[30px] font-medium">
                  {formatINR(toNumber(selectedVariant.price))}
                </span>
                <span
                  className="text-[15px] line-through text-muted decoration-black"
                >
                  {formatINR(toNumber(selectedVariant.mrp))}
                </span>
              </div>
              <div
                className="text-[12.5px] mt-1 text-green"
              >
                Save{" "}
                {formatINR(
                  toNumber(selectedVariant.mrp) -
                    toNumber(selectedVariant.price)
                )}
              </div>
            </div>

            <div
              className="text-[13px] mb-3.5 text-muted"
            >
              Storage & colour
            </div>
            <div className="flex gap-2.5 flex-wrap mb-8">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  className="px-4 py-2.5 rounded-md text-[13.5px] transition-all duration-150"
                  style={{
                    border:
                      selectedVariant.id === variant.id
                        ? "1px solid var(--emi-selection)"
                        : "1px solid var(--line)",
                    background:
                      selectedVariant.id === variant.id
                        ? "var(--emi-selection-tint)"
                        : "var(--panel)",
                    color:
                      selectedVariant.id === variant.id
                        ? "var(--emi-selection)"
                        : "inherit",
                    fontWeight: selectedVariant.id === variant.id ? 500 : 400,
                  }}
                >
                  {variant.storage} | {variant.color}
                </button>
              ))}
            </div>

            <div
              className="text-[13px] mb-3.5 flex items-baseline justify-between text-muted"
            >
              <span>EMI plans backed by mutual funds</span>
              <span className="text-xs text-[#9C9690]">
                Select one to continue
              </span>
            </div>

            <div className="border-t border-line">
              {selectedVariant.emi_plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedEmiPlan(plan)}
                  className="grid grid-cols-[22px_1fr_auto] items-center gap-4 py-4 px-1 cursor-pointer transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid var(--line)",
                    background:
                      selectedEmiPlan?.id === plan.id
                        ? "var(--emi-selection-tint)"
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedEmiPlan?.id !== plan.id) {
                      e.currentTarget.style.background = "#FBFAF8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedEmiPlan?.id !== plan.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div
                    className="relative flex-shrink-0"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border:
                        selectedEmiPlan?.id === plan.id
                          ? "1.5px solid var(--emi-selection)"
                          : "1.5px solid #C9C4BA",
                    }}
                  >
                    {selectedEmiPlan?.id === plan.id && (
                      <span
                        className="absolute inset-[3px] rounded-full bg-emi-selection"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="text-[15px] tracking-[-0.01em]">
                      {formatINR(toNumber(plan.monthly_amount))}{" "}
                      <span
                        className="text-[13px] text-muted"
                      >
                        × {plan.tenure_months} months
                      </span>
                    </div>
                    {toNumber(plan.cashback) > 0 && (
                      <div className="text-[12.5px] text-green">
                        + {formatINR(toNumber(plan.cashback))} cashback
                      </div>
                    )}
                  </div>

                  <div
                    className="text-right text-[13.5px]"
                    style={{
                      color:
                        toNumber(plan.interest_rate) === 0
                          ? "var(--green)"
                          : "var(--muted)",
                    }}
                  >
                    {toNumber(plan.interest_rate) === 0
                      ? "0% interest"
                      : `${plan.interest_rate}% interest`}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-5">
              <span className="text-[13px] text-muted">
                {selectedEmiPlan ? (
                  <>
                    <b className="text-foreground">
                      {formatINR(toNumber(selectedEmiPlan.monthly_amount))}/mo
                    </b>{" "}
                    for {selectedEmiPlan.tenure_months} months
                  </>
                ) : (
                  "Choose a plan to see your monthly total"
                )}
              </span>
              <button
                onClick={handleProceed}
                disabled={!selectedEmiPlan}
                className="whitespace-nowrap px-7 py-3.5 rounded-md text-[14.5px] font-medium transition-all duration-150"
                style={{
                  background: selectedEmiPlan ? "var(--foreground)" : "#E1DED6",
                  color: selectedEmiPlan ? "#fff" : "#9C9690",
                  cursor: selectedEmiPlan ? "pointer" : "not-allowed",
                  border: "none",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (selectedEmiPlan) {
                    e.currentTarget.style.background = "var(--emi-selection)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEmiPlan) {
                    e.currentTarget.style.background = "var(--foreground)";
                  }
                }}
              >
                {selectedEmiPlan ? "Proceed with this plan" : "Select a plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
