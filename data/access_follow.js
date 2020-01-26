

//==============================================================================

//-- Dependencies --------------------------------
import database_fake from './fake_database.js';
import {
    userNameCanonical,
} from './utilities.js';

//------------------------------------------------

//------------------------------------------------
export default {
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
