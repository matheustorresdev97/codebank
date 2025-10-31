"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import useSWR from "swr";
import { CreditCard, Invoice } from "../models";

import {
  Typography,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  SelectChangeEvent,
} from "@mui/material";

interface FaturasClientUIProps {
  creditCards: CreditCard[];
}

// URL base da API
const baseUrl = process.env.NEXT_PUBLIC_INVOICES_API_URL;

const fetcher = async (resource: string) => {
  if (!baseUrl) throw new Error("NEXT_PUBLIC_INVOICES_API_URL não configurada");

  const response = await fetch(`${baseUrl}/${resource}`);
  if (!response.ok) throw new Error("Erro ao buscar dados");

  return response.json();
};

export default function FaturasClientUI({ creditCards }: FaturasClientUIProps) {
  const [creditCardNumber, setCreditCardNumber] = useState<string>(
    creditCards.length ? creditCards[0].number : ""
  );

  const { data: invoices = [], error } = useSWR<Invoice[]>(
    creditCardNumber ? `credit-cards/${creditCardNumber}/invoices` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    document.title = creditCards.length
      ? `Fatura - ${creditCardNumber}`
      : "Fatura - Nenhum cartão encontrado";
  }, [creditCardNumber, creditCards.length]);

  if (!creditCards.length) {
    return (
      <Typography variant="h4" color="text.primary" gutterBottom>
        Nenhum cartão encontrado
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h4" color="text.primary" gutterBottom>
        Fatura
      </Typography>

      <Select
        fullWidth
        value={creditCardNumber}
        onChange={(event: SelectChangeEvent<string>) =>
          setCreditCardNumber(event.target.value as string)
        }
      >
        {creditCards.map((c, key) => (
          <MenuItem key={key} value={c.number}>
            {c.number}
          </MenuItem>
        ))}
      </Select>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{xs: 12, sm:6, md:4}}>
          <List>
            {error && (
              <ListItem>
                <ListItemText primary="Falha ao carregar faturas." />
              </ListItem>
            )}

            {invoices.map((invoice, key) => (
              <ListItem key={key} divider>
                <ListItemText
                  primary={format(parseISO(invoice.payment_date), "dd/MM/yyyy")}
                  secondary={invoice.store}
                />
                <ListItemSecondaryAction>
                  <Typography variant="body2">
                    R$ {invoice.amount.toFixed(2)}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}
