

//== Create Users Table ========================================================

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const TABLE_FOLLOWS = 'follows';
const FIELD_FOLLOWER = 'followerId';
const FIELD_TARGET = 'targetId';
// Foreign
const TABLE_USERS = 'users';
const FIELD_USERID = 'userId';

//-- Migration Functions -------------------------
exports.up = function(knex) {
    return knex.schema.createTable(TABLE_FOLLOWS, table => {
        table.string(FIELD_FOLLOWER)
            .references(FIELD_USERID)
            .inTable(TABLE_USERS)
            .notNullable();
        table.string(FIELD_TARGET)
            .references(FIELD_USERID)
            .inTable(TABLE_USERS)
            .notNullable();
        table.unique([FIELD_FOLLOWER, FIELD_TARGET])
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_FOLLOWS);
};
