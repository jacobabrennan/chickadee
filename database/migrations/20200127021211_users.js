

/*== Create Users Table ========================================================

User:
    a unique Id: string, alphanumeric, lowercase

*/

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const TABLE_USERS = 'users';
const FIELD_USERID = 'userId';

//-- Migration Functions -------------------------
exports.up = function(knex) {
    return knex.schema.createTable(TABLE_USERS, table => {
        table.string(FIELD_USERID).unique().notNullable().primary();
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_USERS);
};
