E-commerce Platform – Next.js & Spring Boot

🇺🇸 English

About

This is a full-stack e-commerce application built with Next.js (React) on the frontend and Spring Boot on the backend, using PostgreSQL as the database.

The project was designed to simulate a real-world online store, focusing on scalability, clean architecture, performance, and modern development practices. It demonstrates both frontend and backend skills, with special attention to API design, authentication, and data persistence.

Features

🛒 Product listing and product details

👤 User authentication and authorization

🛍️ Shopping cart and checkout flow

📦 Order management

🔐 Secure REST API with Spring Boot

⚡ Fast and optimized frontend with Next.js App Router

🎨 Modern, responsive, and clean UI

🗄️ Relational database with PostgreSQL

Tech Stack
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

Backend

Java

Spring Boot

Spring Web (REST API)

Spring Data JPA

Spring Security

Database

PostgreSQL

Getting Started
Frontend

Install dependencies and run the development server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


Open http://localhost:3000
 in your browser.

You can start editing the main page in:

app/page.tsx


Hot reload is enabled, so changes are applied instantly.

Backend

Configure the PostgreSQL connection in application.yml or application.properties

Run the Spring Boot application:

./mvnw spring-boot:run


The API will be available at:

http://localhost:8080

Deployment

Frontend: Vercel (recommended for Next.js)

Backend: Docker, VPS, or cloud providers (AWS, Railway, Render, etc.)

Database: Managed PostgreSQL or self-hosted

The project is structured to be production-ready and easily deployable.

🇧🇷 Português

Sobre

Esta é uma aplicação e-commerce full stack, desenvolvida com Next.js (React) no frontend e Spring Boot no backend, utilizando PostgreSQL como banco de dados.

O projeto foi pensado para simular uma loja virtual real, com foco em escalabilidade, organização de código, desempenho e boas práticas modernas de desenvolvimento. Ele demonstra habilidades tanto de frontend quanto de backend, com atenção especial à construção de APIs, autenticação e persistência de dados.

Funcionalidades

🛒 Listagem de produtos e página de detalhes

👤 Autenticação e autorização de usuários

🛍️ Carrinho de compras e fluxo de checkout

📦 Gerenciamento de pedidos

🔐 API REST segura com Spring Boot

⚡ Alta performance com Next.js App Router

🎨 Interface moderna, responsiva e limpa

🗄️ Banco de dados relacional com PostgreSQL

Tecnologias
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

Backend

Java

Spring Boot

Spring Web (API REST)

Spring Data JPA

Spring Security

Banco de Dados

PostgreSQL

Como rodar o projeto
Frontend

Instale as dependências e execute o servidor de desenvolvimento:

npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev


Acesse:

http://localhost:3000


A página principal pode ser editada em:

app/page.tsx


As alterações são refletidas automaticamente.

Backend

Configure a conexão com o PostgreSQL no application.yml ou application.properties

Execute a aplicação Spring Boot:

./mvnw spring-boot:run


A API ficará disponível em:

http://localhost:8080

Deploy

Frontend: Vercel (recomendado para Next.js)

Backend: Docker, VPS ou serviços em nuvem (AWS, Railway, Render, etc.)

Banco de Dados: PostgreSQL gerenciado ou local

O projeto está estruturado para uso em produção e fácil escalabilidade.

Author

Rubens
Full Stack Developer
Focus on Back-end

License

This project is intended for personal study and portfolio use.