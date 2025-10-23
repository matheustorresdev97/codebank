"use client";

import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    ListItem,
    ListItemAvatar,
    Avatar,
    TextField,
    Grid,
    ListItemText,
    Box,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import type { Product, CreditCard } from "@/app/models";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function OrderPage() {
  const router = useRouter();
  const { slug } = useParams(); // ✅ pega o slug diretamente
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm<CreditCard>();
  const [product, setProduct] = useState<Product | null>(null);

 useEffect(() => {
    if (!slug) return;

    async function loadProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products/${slug}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data: Product = await res.json();
        setProduct(data);
      } catch (e) {
        enqueueSnackbar("Produto não encontrado.", { variant: "error" });
        router.push("/products");
      }
    }

    loadProduct();
  }, [slug, enqueueSnackbar, router]);

    if (!product) return <Typography>Carregando...</Typography>;

    const onSubmit = async (data: CreditCard) => {
        try {
            const res = await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credit_card: data,
                    items: [{ product_id: product.id, quantity: 1 }],
                }),
            });

            if (!res.ok) {
                throw new Error("Erro ao processar pedido");
            }

            const order = await res.json();
            router.push(`/orders/${order.id}`);
        } catch (e) {
            console.error(e);
            enqueueSnackbar("Erro ao realizar sua compra.", { variant: "error" });
        }
    };

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

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField {...register("name")} required label="Nome" fullWidth />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            {...register("number")}
                            label="Número do cartão"
                            required
                            fullWidth
                            inputProps={{ maxLength: 16 }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField {...register("cvv")} required type="number" label="CVV" fullWidth />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={3}>
                            <Grid size={6}>
                                <TextField
                                    {...register("expiration_month")}
                                    required
                                    type="number"
                                    label="Mês de expiração"
                                    fullWidth
                                    onChange={(e) => setValue("expiration_month", parseInt(e.target.value))}
                                />
                            </Grid>

                            <Grid size={6}>
                                <TextField
                                    {...register("expiration_year")}
                                    required
                                    type="number"
                                    label="Ano de expiração"
                                    fullWidth
                                    onChange={(e) => setValue("expiration_year", parseInt(e.target.value))}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Pagar
                    </Button>
                </Box>
            </form>
        </Box>
    );
}