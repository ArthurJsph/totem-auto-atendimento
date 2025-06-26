BEGIN;

SET session_replication_role = 'replica';

DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS orders_product CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS menu_category CASCADE;
DROP TABLE IF EXISTS restaurant CASCADE;
DROP TABLE IF EXISTS manager CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    cpf VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manager (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MANAGER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    avatar_image_url TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL,
    manager_id INTEGER
);

CREATE TABLE IF NOT EXISTS menu_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    restaurant_id INTEGER NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS product (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image_url TEXT NOT NULL,
    ingredients TEXT[],
    amount INTEGER,
    restaurant_id INTEGER NOT NULL,
    menu_category_id INTEGER NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    price DOUBLE PRECISION,
    total DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    consumption_method VARCHAR(20) NOT NULL,
    restaurant_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    payment_id INTEGER,
    user_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders_product (
    id SERIAL PRIMARY KEY,
    name TEXT,
    product_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    status TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    method VARCHAR(100) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    order_id INTEGER NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE restaurant ADD CONSTRAINT fk_restaurant_manager
    FOREIGN KEY (manager_id) REFERENCES manager(id) ON DELETE SET NULL;

ALTER TABLE menu_category ADD CONSTRAINT fk_menu_category_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE;

ALTER TABLE product ADD CONSTRAINT fk_product_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE;

ALTER TABLE product ADD CONSTRAINT fk_product_menu_category
    FOREIGN KEY (menu_category_id) REFERENCES menu_category(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_order_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_order_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT fk_order_payment
    FOREIGN KEY (payment_id) REFERENCES payment(id) ON DELETE SET NULL;

ALTER TABLE orders_product ADD CONSTRAINT fk_order_product_product
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE;

ALTER TABLE orders_product ADD CONSTRAINT fk_order_product_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE payment ADD CONSTRAINT fk_payment_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE password_reset_tokens ADD CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Inserção de Dados Essenciais (Restaurant, Menu Categories, Products)

-- Restaurante (ID 1, manager_id será NULO até você criar um manager via API e vincular)
INSERT INTO restaurant (id, name, slug, description, avatar_image_url, cover_image_url, created_at, updated_at, manager_id) VALUES
(1, 'Pizzaria Bella', 'pizzaria-bella', 'As melhores pizzas artesanais.', '/images/bella-avatar.png', '/images/bella-cover.jpg', NOW(), NOW(), NULL);

SELECT setval('restaurant_id_seq', (SELECT COALESCE(MAX(id), 1) FROM restaurant), true);

-- Categorias de Menu para o restaurante 1
INSERT INTO menu_category (id, name, restaurant_id, created_at, updated_at) VALUES
(1, 'Bebidas', 1, NOW(), NOW()),
(2, 'Sobremesas', 1, NOW(), NOW()),
(3, 'Lanches', 1, NOW(), NOW()),
(4, 'Almoço', 1, NOW(), NOW());

SELECT setval('menu_category_id_seq', (SELECT COALESCE(MAX(id), 1) FROM menu_category), true);

-- Produtos para o restaurante 1
INSERT INTO product (
  name, description, price, image_url, ingredients, amount, restaurant_id, menu_category_id, created_at, updated_at
) VALUES
('Café Expresso', 'Café puro e encorpado.', 4.50, 'cafe-expresso.jpg', ARRAY['Grãos de café'], 1, 1, 1, NOW(), NOW()),
('Cappuccino Tradicional', 'Café com leite vaporizado e espuma de leite.', 8.00, 'cappuccino.jpg', ARRAY['Café', 'Leite'], 1, 1, 1, NOW(), NOW()),
('Latte Macchiato', 'Leite quente com um toque de café e espuma.', 8.50, 'latte-macchiato.jpg', ARRAY['Leite', 'Café'], 1, 1, 1, NOW(), NOW()),
('Mocha Gelado', 'Bebida gelada de café, chocolate e leite.', 9.50, 'mocha-gelado.jpg', ARRAY['Café', 'Chocolate', 'Leite', 'Gelo'], 1, 1, 1, NOW(), NOW()),
('Chá de Camomila', 'Chá calmante de camomila.', 5.00, 'cha-camomila.jpg', ARRAY['Camomila', 'Água quente'], 1, 1, 1, NOW(), NOW()),
('Torta de Limão', 'Fatia de torta de limão com merengue.', 7.00, 'torta-limao.jpg', ARRAY['Biscoito', 'Limão', 'Leite condensado', 'Merengue'], 1, 1, 2, NOW(), NOW()),
('Cheesecake de Frutas Vermelhas', 'Cheesecake cremoso com calda de frutas vermelhas.', 9.00, 'cheesecake-frutas.jpg', ARRAY['Cream cheese', 'Biscoito', 'Frutas vermelhas'], 1, 1, 2, NOW(), NOW()),
('Brownie com Sorvete', 'Brownie quente com uma bola de sorvete de creme.', 10.00, 'brownie-sorvete.jpg', ARRAY['Chocolate', 'Farinha', 'Sorvete de creme'], 1, 1, 2, NOW(), NOW()),
('Muffin de Blueberry', 'Muffin fofinho com mirtilos frescos.', 5.50, 'muffin-blueberry.jpg', ARRAY['Farinha', 'Mirtilo', 'Ovos'], 1, 1, 2, NOW(), NOW()),
('Cookie com Gotas de Chocolate', 'Cookie crocante com muitas gotas de chocolate.', 4.00, 'cookie-chocolate.jpg', ARRAY['Farinha', 'Chocolate', 'Manteiga'], 1, 1, 2, NOW(), NOW()),
('Pão de Queijo Recheado', 'Pão de queijo com recheio cremoso de requeijão.', 6.00, 'pao-queijo-recheado.jpg', ARRAY['Polvilho', 'Queijo', 'Requeijão'], 1, 1, 3, NOW(), NOW()),
('Mini Pizza de Queijo', 'Pequena pizza individual com queijo mussarela.', 7.00, 'mini-pizza.jpg', ARRAY['Massa de pizza', 'Molho de tomate', 'Queijo mussarela'], 1, 1, 3, NOW(), NOW()),
('Cachorro Quente Gourmet', 'Salsicha especial com molho e batata palha.', 12.00, 'cachorro-quente.jpg', ARRAY['Pão', 'Salsicha', 'Molho', 'Batata palha'], 1, 1, 3, NOW(), NOW()),
('Wrap de Frango com Salada', 'Wrap recheado com frango grelhado e mix de folhas.', 11.00, 'wrap-frango.jpg', ARRAY['Tortilla', 'Frango', 'Alface', 'Tomate'], 1, 1, 3, NOW(), NOW()),
('Salada de Frutas Frescas', 'Mix de frutas da estação picadas.', 8.00, 'salada-frutas.jpg', ARRAY['Morango', 'Manga', 'Uva', 'Maçã'], 1, 1, 4, NOW(), NOW()),
('Iogurte com Granola e Mel', 'Iogurte natural com granola crocante e mel.', 7.50, 'iogurte-granola.jpg', ARRAY['Iogurte natural', 'Granola', 'Mel'], 1, 1, 4, NOW(), NOW()),
('Sopa de Legumes da Horta', 'Sopa caseira com legumes frescos.', 10.00, 'sopa-legumes.jpg', ARRAY['Cenoura', 'Batata', 'Abobrinha', 'Caldo de legumes'], 1, 1, 4, NOW(), NOW()),
('Água de Coco Natural', 'Água de coco fresca e gelada.', 6.00, 'agua-coco.jpg', ARRAY['Água de coco'], 1, 1, 4, NOW(), NOW()),
('Refrigerante Lata', 'Diversos sabores de refrigerante em lata.', 5.00, 'refrigerante-lata.jpg', ARRAY['Refrigerante'], 1, 1, 1, NOW(), NOW()),
('Cerveja Artesanal', 'Seleção de cervejas artesanais locais.', 15.00, 'cerveja-artesanal.jpg', ARRAY['Cerveja'], 1, 1, 1, NOW(), NOW());

SELECT setval('product_id_seq', (SELECT COALESCE(MAX(id), 1) FROM product), true);

COMMIT;

SET session_replication_role = 'origin';