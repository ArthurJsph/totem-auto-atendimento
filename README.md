# Projeto Totem - Sistema Fullstack Completo

Este repositório contém o sistema **"Totem"**, uma aplicação fullstack robusta que integra **React com Vite** para o frontend, **Spring Boot** para o backend, **PostgreSQL** como banco de dados, utilizando **Docker e Docker Compose** para conteinerização e **Git** para controle de versão.

## Tecnologias Utilizadas

| Categoria              | Tecnologia     | Versão Recomendada |
| :--------------------- | :------------- | :----------------- |
| **Frontend** | React          | -                  |
|                        | Vite           | -                  |
|                        | npm            | 10.x               |
|                        | Node.js        | 22.x               |
| **Backend** | Spring Boot    | 2.2                |
|                        | Java           | 17                 |
|                        | Maven          | 3.8+               |
| **Banco de Dados** | PostgreSQL     | 15 ou superior     |
| **Contêineres** | Docker         | Mais recente      |
|                        | Docker Compose | Mais recente      |
| **Controle de Versão** | Git            | Mais recente      |

## Estrutura do Projeto

```

totem/
├── totem/             \# Backend - Spring Boot (com Dockerfile)
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── totem-front/       \# Frontend - React com Vite (com Dockerfile)
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml \# Orquestração dos serviços Docker
└── README.md

````

---

## 🚀 Executando o Projeto com Docker Compose

A forma mais recomendada de rodar o projeto é utilizando o Docker Compose, que orquestra todos os serviços (backend, frontend e banco de dados) de forma integrada.

### Pré-requisitos para Docker

Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina. Você pode baixá-los do [site oficial do Docker](https://www.docker.com/get-started/).

### Passo a Passo

1.  **Navegue até a pasta raiz do projeto:**

    ```bash
    cd totem
    ```

2.  **Inicie os serviços com Docker Compose:**

    Este comando irá construir as imagens (se não existirem) e iniciar todos os contêineres definidos no `docker-compose.yml`.

    ```bash
    docker compose up --build -d
    ```

    * `--build`: Força a reconstrução das imagens, garantindo que você tenha as versões mais recentes do seu código.
    * `-d`: Inicia os contêineres em segundo plano, liberando o terminal.

    **Observação:** O banco de dados PostgreSQL será automaticamente inicializado e populado com os dados do arquivo `schema.sql` (que deve estar dentro da imagem do backend ou ser montado como volume, conforme configurado nos Dockerfiles).

3.  **Aguarde a inicialização:**

    Pode levar alguns minutos para que todos os serviços estejam completamente online. Você pode verificar o status dos contêineres com:

    ```bash
    docker compose ps
    ```

    Para visualizar os logs de todos os serviços (útil para depuração):

    ```bash
    docker compose logs -f
    ```

### URLs de Acesso

Uma vez que todos os contêineres estejam rodando:

* **Backend (API Spring Boot):** `http://localhost:8080`
* **Frontend (Aplicação React):** `http://localhost:5173`

---

## ⚙️ Configurações e Variáveis de Ambiente

Os arquivos `.env` e `application.properties` foram incluídos diretamente no repositório para facilitar a configuração inicial em um ambiente acadêmico. Embora em projetos de produção seja comum ignorar esses arquivos via `.gitignore` por segurança, aqui eles garantem que todas as variáveis de ambiente necessárias já estejam configuradas.

**Importante:** Se precisar alterar portas ou outras configurações, edite os arquivos `.env` (para Docker Compose e Frontend) e `application.properties` (para Backend). **Não recomendamos alterar variáveis, a menos que seja estritamente necessário.**

---

## 📧 Serviço de Mensageria

O sistema inclui um serviço de mensageria para funcionalidades como recuperação de senha (tokens e timestamps). Atualmente, ele utiliza um serviço que intercepta o protocolo SMTP e redireciona para uma conta de e-mail de teste, o que é ideal para fins de desenvolvimento e testes sem a necessidade de configurar um serviço de e-mail real como o Gmail.

---

## 🔒 Autenticação e Rotas Protegidas

O backend implementa autenticação via **JWT (JSON Web Tokens)**. A maioria das rotas está protegida e requer um token de autenticação válido para acesso.

### Criando um Novo Usuário

Para interagir com a API, você precisará criar um usuário. Use uma ferramenta como **Postman** ou **Insomnia** para enviar uma requisição:

* **URL:** `http://localhost:8080/api/users/save`
* **Método:** `POST`
* **Body (JSON):**

    ```json
    {
        "name": "Seu Nome",
        "email": "seu.email@exemplo.com",
        "password": "sua_senha_segura",
        "phone": "99999999999",
        "cpf": "12345678900",
        "role": "ADMIN"
    }
    ```

    * **Importante:** Defina a `role` como `"ADMIN"` para ter acesso a todas as funcionalidades sem problemas de autorização durante os testes. A senha será criptografada automaticamente ao ser salva no banco de dados.

### Realizando Login

Após criar um usuário, você pode obter um token JWT para autenticação:

* **URL:** `http://localhost:8080/api/auth/login`
* **Método:** `POST`
* **Body (JSON):**

    ```json
    {
        "email": "seu.email@exemplo.com",
        "password": "sua_senha_segura"
    }
    ```

    Se o login for bem-sucedido, a resposta conterá um token no campo `"token"`.

### Usando o Token JWT em Requisições

Para acessar rotas protegidas, inclua o token JWT no cabeçalho `Authorization` de suas requisições, no formato `Bearer <seu_token_aqui>`.

**Exemplo no Postman/Insomnia:**

* **Header:** `Authorization`
* **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (substitua pelo seu token real)

---

## 🛑 Gerenciando os Contêineres Docker

Aqui estão alguns comandos úteis para gerenciar seus contêineres:

* **Parar os serviços (mantendo os dados e imagens):**
    ```bash
    docker compose stop
    ```

* **Remover os contêineres (mas manter as imagens e volumes):**
    ```bash
    docker compose down
    ```

* **Remover todos os serviços, redes e volumes (cuidado: isso apagará seus dados do banco de dados se o volume não for nomeado e persistente fora do escopo do compose):**
    ```bash
    docker compose down --volumes --rmi all
    ```

    * **Não recomendado para este projeto, pois pode apagar os dados que você inseriu!** Use `docker compose stop` ou `docker compose down` sem `--volumes` para manter os dados do banco de dados para a próxima execução.

* **Verificar os processos em execução:**
    ```bash
    docker compose ps
    ```

* **Acessar os logs (em tempo real):**
    ```bash
    docker compose logs -f
    ```

---

## ✅ Checklist Final para Execução

* [x] Docker e Docker Compose instalados e configurados.
* [x] Repositório clonado e diretório raiz acessado.
* [x] Comando `docker compose up --build -d` executado com sucesso.
* [x] Backend Spring Boot acessível em `http://localhost:8080`.
* [x] Frontend React/Vite acessível em `http://localhost:5173`.
* [x] Comunicação funcionando entre frontend, backend e banco de dados via Docker.

---

Se tiver alguma dúvida ou encontrar problemas, sinta-se à vontade para abrir uma issue no repositório!
