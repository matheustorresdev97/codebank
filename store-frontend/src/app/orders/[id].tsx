import React from "react";
import {
  Avatar,
  Chip,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { notFound } from "next/navigation";
import { Order, OrderStatus } from "@/app/models";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.STORE_API_URL}/orders/${id}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    notFound();
  }

  const order: Order = await res.json();
  const product = order.items[0].product;

  return (
    <Box sx={{ p: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Pedido #{order.id}
      </Typography>

      <Chip
        label={order.status === OrderStatus.Approved ? "Aprovado" : "Pendente"}
        color={order.status === OrderStatus.Approved ? "primary" : "default"}
        sx={{ mb: 3 }}
      />

      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={product.name} src={product.image_url} />
        </ListItemAvatar>
        <ListItemText
          primary={product.name}
          secondary={`R$ ${order.items[0].price.toLocaleString("pt-BR")}`}
        />
      </ListItem>

      <Typography component="h2" variant="h6" gutterBottom mt={3}>
        Detalhes do cartão de crédito
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography gutterBottom fontWeight="bold">
            Número
          </Typography>
          <Typography>{order.credit_card.number}</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography gutterBottom fontWeight="bold">
            Expiração
          </Typography>
          <Typography>
            {`${order.credit_card.expiration_month}/${order.credit_card.expiration_year}`}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export const revalidate = 600;
export const dynamicParams = true;
