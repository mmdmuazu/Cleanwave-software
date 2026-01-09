/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Wallet", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("Users");
    table.decimal("balance", 14, 2).defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Wallet");
};
