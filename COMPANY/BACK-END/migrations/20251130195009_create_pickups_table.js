/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("Pickups", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("Users");
    table
      .integer("agent_id")
      .notNullable()
      .references("id")
      .inTable("Users")
      .onDelete("SET NULL");
    table.decimal("kg", 14, 2).notNullable();
    table.string("category").notNullable();
    table.string("subcategory").nullable();
    table.string("address").notNullable();
    table.string("status").defaultTo("pending");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Pickups");
};
