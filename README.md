# loyalty-app

For Dev mode,
run yarn dev from root
cd frontend/ and run yarn start

backend should be running on localhost:8000 and frontend on localhost:3000

Endpoint to add new order: /webhook/order
Format: {
	"customerId": "192", 
	"customerName": "Spike Speigel", 
	"orderId": "T133", 
	"totalInCents": 58250, 
	"date": "2022-03-04T05:29:59.850Z" 
}

to check how the app will run on prod, run yarn heroku-postbuild, then run yarn dev
this will load the build app and serve it through the koa router

DB is postgresql and locally requires

DB_USER
DB_HOST
DB_DATABASE
DB_PASSWORD
DB_PORT

React locally requires a .env file in the frontend folder

REACT_APP_BASE_URL (with no trailing /)


When deployed to heroku, config vars should be

DATABASE_URL environment variable for psql
REACT_APP_BASE_URL

To set up DB Schema run these commands in psql terminal

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email VARCHAR(20),
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
	product_id SERIAL PRIMARY KEY,
	name VARCHAR(20),
	price DECIMAL(12,2)
);

CREATE TABLE orders (
	order_id VARCHAR(10) PRIMARY KEY,
	total_in_cents BIGINT,
	user_id INT,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
			REFERENCES users(user_id)
			ON DELETE CASCADE
);

CREATE TABLE order_item (
	id SERIAL PRIMARY KEY,
	quantity INT,
	order_id VARCHAR(10),
	product_id INT,
	CONSTRAINT fk_order
		FOREIGN KEY(order_id)
			REFERENCES orders(order_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_product
		FOREIGN KEY(product_id)
			REFERENCES products(product_id)
			ON DELETE CASCADE
);

CREATE TABLE tiers (
	tier_id INT PRIMARY KEY NOT NULL,
	tier_type VARCHAR(10),
	tier_req DECIMAL(12,2)
);

CREATE TABLE user_tier (
	id SERIAL PRIMARY KEY,
	start_date TIMESTAMPTZ,
	downgrade_date TIMESTAMPTZ,
	last_purchase TIMESTAMPTZ,
	amount_spent DECIMAL(12,2),
	year_spend DECIMAL(12,2),
	user_id INT,
	tier_id INT,
	CONSTRAINT fk_user_id
		FOREIGN KEY(user_id)
			REFERENCES users(user_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_tier
		FOREIGN KEY(tier_id)
			REFERENCES tiers(tier_id)
			ON DELETE CASCADE
);

INSERT INTO tiers(tier_id, tier_type, tier_req) VALUES (1, ‘Bronze’, 0.00);
INSERT INTO tiers(tier_id, tier_type, tier_req) VALUES (2, ‘Silver’, 100.00);
INSERT INTO tiers(tier_id, tier_type, tier_req) VALUES (3, ‘Gold’, 500.00);
