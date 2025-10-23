import { Button, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        404 - Página não encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ops! A página que você está procurando não existe.
      </Typography>
      <Button variant="contained" color="primary" component={Link} href="/">
        Voltar para Home
      </Button>
    </div>
  );
}
