

//==============================================================================

//-- Dependencies --------------------------------
import database_fake from './fake_database.js';

//------------------------------------------------
export function userNameCanonical(nameRaw) {
    if(!nameRaw) {
        throw new Error('invalid user name: empty string');
    }
    let nameStripped = nameRaw.replace(/[^a-z0-9]/gi,'');
    if(nameStripped !== nameRaw) {
        throw new Error('invalid user name: contains invalid characters');
    }
    return nameStripped.toLowerCase();
}

//------------------------------------------------
export default {
    async userGet(userName) {
        let userId = userNameCanonical(userName);
        return database_fake.userGet(userId);
    },
    
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
