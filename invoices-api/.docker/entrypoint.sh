#!/bin/bash

# Copiar .env se não existir
if [ ! -f ".env" ]; then
    cp .env.example .env
fi

# Instalar dependências
npm install

# Aguardar o banco de dados estar pronto
echo "Aguardando o banco de dados..."
sleep 5

# Executar migrations
npm run typeorm migration:run -- -d src/data-source.ts

# Iniciar aplicação em modo desenvolvimento
npm run start:dev