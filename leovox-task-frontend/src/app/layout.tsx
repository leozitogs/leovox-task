import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Leovox Task — Orquestrador de Tarefas com IA",
  description:
    "Gerenciador de produtividade de última geração com inteligência artificial. Crie e organize tarefas usando linguagem natural.",
  authors: [{ name: "Leonardo Gonçalves Sobral" }],
  icons: {
    icon: "/assets/IsotipoLeovoxverde.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/IsotipoLeovoxverde.svg" type="image/svg+xml" />
        {/* Preload JetBrains Mono from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
