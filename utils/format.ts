export interface EmiPlanRaw{
    id : number
    variant_id : number
    monthly_amount : string
    tenure_months : number 
    interest_rate : string
    cashback : string
}

export interface VariantRaw{
    id : number
    product_id : number
    storage : string
    color : string
    mrp : string
    price : string
    image_url : string
    is_default : boolean
    emi_plans : EmiPlanRaw[]
}

export interface ProductRaw{
    id : number
    slug : string
    name : string
    description : string
    variants: VariantRaw[]
}
export interface ProductSummaryRaw{
    id : number
    slug : string
    name : string
    price : string
    mrp : string
    image_url: string
}


export function toNumber(val: string) : number{
    return Number(val)
}

export function formatINR(amount: number): string{
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}