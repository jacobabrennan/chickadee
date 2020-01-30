

/*== Create Users Table ========================================================

User:
    a unique Id: string, alphanumeric, lowercase

*/

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const TABLE_USERS = 'users';
const FIELD_USERID = 'userId';
const FIELD_NAME = 'name';
const FIELD_DESCRIPTION = 'description';
const LIMIT_NAME = 63;
const LIMIT_DESCRIPTION = 255;

//-- Migration Functions -------------------------
exports.up = function(knex) {
    return knex.schema.createTable(TABLE_USERS, table => {
        table.string(FIELD_USERID).unique().notNullable().primary();
        table.string(FIELD_NAME, LIMIT_NAME);
        table.string(FIELD_DESCRIPTION, LIMIT_DESCRIPTION);
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_USERS);
};
