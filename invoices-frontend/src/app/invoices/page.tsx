import FaturasClientUI from "../components/FaturasClientUI";
import { CreditCard } from "../models";
import NotFoundPage from "../not-found";


export const revalidate = 30;

async function getCreditCards(): Promise<CreditCard[]> {
  const baseUrl = process.env.NEXT_PUBLIC_INVOICES_API_URL;
  if (!baseUrl) {
    throw new Error("Erro de configuração: NEXT_PUBLIC_API_URL não definida.");
  }

  // Usamos fetch nativo
  const response = await fetch(`${baseUrl}/credit-cards`);

  // Tratamento de 404 (substitui 'return { notFound: true }')
  if (response.status === 404) {
    NotFoundPage();
  }

  if (!response.ok) {
    throw new Error("Falha ao buscar os cartões de crédito.");
  }

  return response.json();
}


export default async function FaturasPage() {
  const creditCards = await getCreditCards();
  return <FaturasClientUI creditCards={creditCards} />;
}