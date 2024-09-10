CREATE TABLE groups (
    group_id VARCHAR(22) PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    group_currency VARCHAR(5), 
    group_description TEXT,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
    group_id VARCHAR(22) NOT NULL,
    user_id BIGSERIAL UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    paid_by BIGINT NOT NULL,  
    amount DECIMAL(10, 2) NOT NULL,
    expense_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    group_id VARCHAR(22) NOT NULL,
    description TEXT,
    FOREIGN KEY (paid_by) REFERENCES group_members(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE
);

CREATE TABLE expense_participants (
    expense_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) DEFAULT 0.00,
    PRIMARY KEY (expense_id, user_id),
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES group_members(user_id) ON DELETE CASCADE
);


