/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.up = function (knex) {};

// /**
//  * @param { import("knex").Knex } knex
//  * @returns { Promise<void> }
//  */
// exports.down = function (knex) {};

exports.up = function (knex) {
  return knex.schema.createTable("Users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone").notNullable().unique();
    table.string("password").notNullable();
    table.string("gender").notNullable();
    table.string("role").defaultTo("user");
    table.string("state").nullable();
    table.string("lga").nullable();
    table.string("address").nullable();
    table.integer("age").nullable();
    table.decimal("capacity", 14, 2).defaultTo(0);
    table
      .integer("created_by")
      .unsigned()
      .references("id")
      .inTable("Users")
      .onDelete("SET NULL");
    table.boolean("is_verified").defaultTo(false);
    table.string("verification_token").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Users");
};
