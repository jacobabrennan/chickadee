

//==============================================================================

//-- Dependencies --------------------------------
import database_fake, { userNameCanonical } from './fake_database.js';

//------------------------------------------------

//------------------------------------------------
export default {
    // async userGet(userName) {
    //     let userId = userNameCanonical(userName);
    //     return database_fake.userGet(userId);
    // },
    
    //------------------------------------------------
    async postGet(postId) {
        return database_fake.postGet(postId);
    },
    async postCreate(userNameAuthor, postContent) {
        let userIdAuthor = userNameCanonical(userNameAuthor);
        return database_fake.postCreate(userIdAuthor, postContent);
    },
    
    //------------------------------------------------
    async followLinkAdd(userNameFollower, userNameTarget) {
        let userIdFollower = userNameCanonical(userNameFollower);
        let userIdTarget = userNameCanonical(userNameTarget);
        return database_fake.followLinkAdd(userIdFollower, userIdTarget);
    },
    async followLinkRemove(userNameFollower, userNameTarget) {
        let userIdFollower = userNameCanonical(userNameFollower);
        let userIdTarget = userNameCanonical(userNameTarget);
        return database_fake.followLinkRemove(userIdFollower, userIdTarget);
    },
    async followersGet(userName) {
        let userId = userNameCanonical(userName);
        return database_fake.followersGet(userId);
    },
    async followingGet(userName) {
        let userId = userNameCanonical(userName);
        return database_fake.followingGet(userId);
    },
};
