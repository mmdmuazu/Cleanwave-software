/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    // table.integer("user_id").unsigned().notNullable();
    table.integer("user_id").notNullable().references("id").inTable("Users");
    table.decimal("amount", 14, 2).notNullable();
    table.string("type").notNullable(); // e.g., 'credit' or 'debit'
    table.string("status").defaultTo("pending");
    table.timestamps(true, true);
  });
};

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("transactions");
};
