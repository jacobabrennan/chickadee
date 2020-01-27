

/*== Create Users Table ========================================================

*/

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const TABLE_CREDENTIALS = 'credentials';
const FIELD_PASSWORD_HASH = 'hash';
// Foreign
const TABLE_USERS = 'users';
const FIELD_USERID = 'userId';

//-- Migration Functions -------------------------
exports.up = function(knex) {
    return knex.schema.createTable(TABLE_CREDENTIALS, table => {
        table.string(FIELD_USERID)
            .references(FIELD_USERID)
            .inTable(TABLE_USERS)
            .unique()
            .notNullable()
            .primary();
        table.string(FIELD_PASSWORD_HASH);
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_CREDENTIALS);
};
