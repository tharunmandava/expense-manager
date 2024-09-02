#create a table users with user_id name(unique)

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL);

#create a table expenses with expense id, paid by, amount and expense date

CREATE TABLE expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    paid_by VARCHAR(255) NOT NULL,
    amount FLOAT NOT NULL,
    expense_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (paid_by) references users(name));

