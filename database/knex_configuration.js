export default {
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
