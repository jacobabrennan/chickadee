

/*== Create Users Table ========================================================

*/

//-- Dependencies --------------------------------

//-- Project Constants ---------------------------
const TABLE_POSTS = 'posts';
const FIELD_POSTID = 'postId';
const FIELD_CREATED = 'created';
const FIELD_CONTENT_TEXT = 'text';
const LIMIT_CONTENT_TEXT = 255;
// Foreign
const TABLE_USERS = 'users';
const FIELD_USERID = 'userId';

//-- Migration Functions -------------------------
exports.up = function(knex) {
    return knex.schema.createTable(TABLE_POSTS, table => {
        table.increments(FIELD_POSTID);
        table.string(FIELD_USERID)
            .references(FIELD_USERID)
            .inTable(TABLE_USERS)
            .notNullable();
        table.string(FIELD_CONTENT_TEXT, LIMIT_CONTENT_TEXT);
        table.datetime(FIELD_CREATED)
            .notNullable()
            .defaultTo(knex.fn.now());
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable(TABLE_POSTS);
};
