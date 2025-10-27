"use client";

import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import theme from "./theme";
import { SnackbarProvider } from "notistack";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="theme-color" content="#000000" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <Navbar />
            <Container>
              <Box marginTop={1}>{children}</Box>
            </Container>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
