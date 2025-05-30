```markdown
# 🟢 Projeto Totem - Sistema Fullstack com React (Vite), Spring Boot e PostgreSQL

Este repositório contém um sistema completo chamado **Totem**, utilizando **React com Vite** no frontend, **Spring Boot** no backend e **PostgreSQL** como banco de dados.

---

## ✅ Pré-requisitos

Antes de rodar o projeto, certifique-se de que os seguintes softwares estão instalados em sua máquina:

| Ferramenta       | Versão recomendada |
|------------------|--------------------|
| Java             | 17                 |
| PostgreSQL       | 15 ou superior     |
| Maven            | 3.8+               |
| Node.js          | 22.x               |
| npm              | 10.x               |
| Git              | mais recente       |

---

## 📁 Estrutura do Projeto

```

totem/
├── totem/                 # Backend - Spring Boot
│   ├── src/
│   └── pom.xml
├── totem-front/  # Frontend - React com Vite
│   ├── src/
│   └── package.json
└── README.md

````

---

## 🛠️ Passo a Passo para Executar o Projeto

### 🔹 1. Criar o Banco de Dados PostgreSQL

#### A. Usando terminal SQL:

```sql
CREATE DATABASE Totem;
EU COLOQUEI POR PADRÃO O USERNAME: postgres
EU COLOQUEI PRO PADRÃO A SENHA: (sem senha)
TODA A ESTRUTURA DO BANCO DE DADOS ESTA NO ARQUIVO CHAMADO schema.sql(database, table e insert)
````

---

### 🔹 2. Rodar o Backend (Spring Boot)

1. Acesse a pasta do backend:

```bash
cd totem
```

2. O `application.properties` Já esta configurado:

```

3. Execute o backend com Maven:

```bash
./mvnw spring-boot:run
```

> Se estiver usando Maven instalado globalmente:

```bash
mvn spring-boot:run
```

> A API estará disponível em: `http://localhost:8080`

---

### 🔹 3. Rodar o Frontend (React com Vite)

1. Acesse a pasta do frontend:

```bash
cd ../totem-front
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run dev
```

> A aplicação estará disponível em: `http://localhost:5173`

---

## ✅ Checklist Final

* [x] PostgreSQL com banco `Totem` e usuário `postregres e arquivo schema.sql com todos os scripts do banco de dados`
* [x] Backend Spring Boot rodando na porta `8080`
* [x] Frontend Vite rodando na porta `5173
* [x] Comunicação funcionando entre front e back

---
