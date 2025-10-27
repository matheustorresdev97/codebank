import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import { Product } from "./models";
import Link from "next/link";

export default async function ProductListPage() {
  const res = await fetch(`${process.env.STORE_API_URL}/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const products: Product[] = await res.json();
  
  return (
    <div>
      <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
        Produtos
      </Typography>
      <Grid container spacing={4}>
        {products.map((product, key) => (
          <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardMedia
                style={{ paddingTop: "56%" }}
                image={product.image_url}
              />
              <CardContent>
                <Typography component="h2" variant="h5" gutterBottom>
                  {product.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  component={Link}
                  href={`/products/${product.slug}`}
                >
                  Detalhes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}