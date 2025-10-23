export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
}

export interface CreditCard {
  number: string;
  name: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
}


export const products: Product[] = [
  {
    id: "1",
    name: "Produto 1",
    description: "Descrição do produto 1",
    image_url: "https://picsum.photos/800/600",
    slug: "produto-1",
    price: 100,
    created_at: "2025-12-06T00:00:00",
  },
   {
    id: "2",
    name: "Produto 2",
    description: "Descrição do produto 1",
    image_url: "https://picsum.photos/800/600",
    slug: "produto-2",
    price: 100,
    created_at: "2025-12-06T00:00:00",
  },
];