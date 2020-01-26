

//==============================================================================

//-- Dependencies --------------------------------
import database_fake from './fake_database.js';
import {
    ERROR_USERNAME_BAD,
    userNameCanonical,
} from './utilities.js';

//------------------------------------------------
export default {
    async postGet(postId) {
        return database_fake.postGet(postId);
    },
    async postCreate(userNameAuthor, postContent) {
        let userIdAuthor = userNameCanonical(userNameAuthor);
        return database_fake.postCreate(userIdAuthor, postContent);
    },
};
