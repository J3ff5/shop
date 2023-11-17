export interface Product {
    id: number;
    title: string;
    created_at: number;
    updated_at: number;
    options: string[];
    values: string[][];
    variants: Variant[];
    image_url: string;
    images: Image[];
    currency: string;
}

interface Variant {
    id: number;
    product_id: number;
    price: string;
    sku: string | null;
    position: number;
    compare_at_price: string;
    values: string[];
    created_at: string; // Consider converting to a Date object if needed
    updated_at: string; // Consider converting to a Date object if needed
    barcode: string | null;
    image_id: number;
    weight: string;
    inventory_quantity: number;
    image_url: string;
}

interface Image {
    id: number;
    product_id: number;
    position: number;
    alt: string[];
    src: string;
}
