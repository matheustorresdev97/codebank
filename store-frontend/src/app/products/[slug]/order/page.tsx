import React from "react";
import {
    Typography,
    Button,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Box,
} from "@mui/material";
import { notFound } from "next/navigation";
import type { Product } from "@/app/models";
import OrderForm from "@/app/components/OrderForm";

interface OrderPageProps {
    params: Promise<{ slug: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
    const { slug } = await params;

    const res = await fetch(`${process.env.STORE_API_URL}/products/${slug}`, {
        next: { revalidate: 120 },
    });

    if (!res.ok) {
        notFound();
    }

    const product: Product = await res.json();

    return (
        <Box sx={{ p: 4 }}>
            <Typography component="h1" variant="h3" gutterBottom>
                Checkout
            </Typography>

            <ListItem>
                <ListItemAvatar>
                    <Avatar src={product.image_url} />
                </ListItemAvatar>
                <ListItemText
                    primary={product.name}
                    secondary={`R$ ${product.price.toLocaleString("pt-BR")}`}
                />
            </ListItem>

            <Typography component="h2" variant="h6" gutterBottom mt={3}>
                Pague com cartão de crédito
            </Typography>

            <OrderForm product={product} />
        </Box>
    );
}

export const revalidate = 120;
export const dynamicParams = true;