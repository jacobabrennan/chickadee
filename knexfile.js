

/*== Knex Configuration ========================================================

NOTE: Knex current does not support ES6 modules. This is only a problem when
running the knex command via npm, such as when migrating or seeding data. To run
the knex command, temporarily remove the following line from package.json:
    "type": "module",

*/

//------------------------------------------------
module.exports = {
    "development": {
        "client": "sqlite3",
        "useNullAsDefault": true,
        "connection": {
            "filename": "./database/dev.sqlite3"
        },
        "migrations": {
            "directory": "./database/migrations"
        },
        "seeds": {
            "directory": "./database/seeds"
        }
    }
}
