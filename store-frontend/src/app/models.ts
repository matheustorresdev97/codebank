export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Produto 1",
    description: "Descrição do produto 1",
    image_url: "https://source.unsplash.com/random?product",
    slug: "produto-1",
    price: 100,
    created_at: "2025-12-06T00:00:00",
  },
];