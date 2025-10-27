import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Product } from "@/app/models";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.STORE_API_URL}/products`);
  const products: Product[] = await res.json();

  return products.map((p) => ({
    slug: p.slug,
  }));
}

// Página de detalhes
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const res = await fetch(`${process.env.STORE_API_URL}/products/${slug}`, {
    next: { revalidate: 120 }, // ISR — revalida a cada 2 minutos
  });

  if (!res.ok) {
    notFound();
  }

  const product: Product = await res.json();

  return (
    <div>
      <Card>
        <CardHeader
          title={product.name.toUpperCase()}
          subheader={`R$ ${product.price}`}
        />
        <CardActions>
          <Button
            size="small"
            color="primary"
            component={Link}
            href={`/products/${product.slug}/order`}
          >
            Comprar
          </Button>
        </CardActions>
        <CardMedia sx={{ paddingTop: "56%" }} image={product.image_url} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export const revalidate = 120;
export const dynamicParams = true;
