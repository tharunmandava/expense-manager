CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE groups (
    group_id BIGSERIAL PRIMARY KEY,
    group_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    paid_by INTEGER NOT NULL,
    amount FLOAT NOT NULL,
    expense_date DATE DEFAULT CURRENT_TIMESTAMP,
    group_id BIGINT DEFAULT NULL,
    FOREIGN KEY (paid_by) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE SET NULL
);


/* SELECT currval(pg_get_serial_sequence('expenses', 'expense_id')); 
    currval used to retrieve the most recently entered expense_id
*/

CREATE TABLE expense_participants (
    expense_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (expense_id, user_id),
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE group_members (
    group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

/*

SELECT ep.expense_id, u.name AS user_name FROM expense_participants ep JOIN users u ON ep.user_id = u.user_id WHERE ep.expense_id = 1;

this returns a list of all the members of an expense but in the form of names instead of id


SELECT e.expense_id, e.amount, e.expense_date FROM expenses e JOIN expense_participants ep ON e.expense_id = ep.expense_id WHERE ep.user_id = 1;

SELECT expense_id, amount, expense_date FROM expenses WHERE paid_by = 1;

*/

