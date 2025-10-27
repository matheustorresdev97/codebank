"use client";

import React from "react";
import { Button, TextField, Grid, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import type { Product, CreditCard } from "@/app/models";

interface OrderFormProps {
    product: Product;
}

export default function OrderForm({ product }: OrderFormProps) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit } = useForm<CreditCard>();

    const onSubmit = async (data: CreditCard) => {
        try {
                       const res = await fetch(`${process.env.NEXT_PUBLIC_STORE_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credit_card: {
                        number: data.number,
                        name: data.name,
                        expiration_month: Number(data.expiration_month),
                        expiration_year: Number(data.expiration_year),
                        cvv: data.cvv,
                    },
                    items: [
                        { 
                            product_id: product.id, 
                            quantity: 1 
                        }
                    ],
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Erro ao processar pedido");
            }

            const order = await res.json();
            enqueueSnackbar("Pedido realizado com sucesso!", { variant: "success" });
            router.push(`/orders/${order.id}`);
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : "Erro ao realizar sua compra.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (
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
                    <TextField 
                        {...register("cvv")} 
                        required 
                        label="CVV" 
                        fullWidth 
                        inputProps={{ maxLength: 4 }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={3}>
                        <Grid size={6}>
                            <TextField
                                {...register("expiration_month")}
                                required
                                type="number"
                                label="Mês"
                                fullWidth
                                inputProps={{ min: 1, max: 12 }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <TextField
                                {...register("expiration_year")}
                                required
                                type="number"
                                label="Ano"
                                fullWidth
                                inputProps={{ min: 2025 }}
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
    );
}