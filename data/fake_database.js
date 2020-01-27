

//==============================================================================

//------------------------------------------------
export const ERROR_NO_SUCH_USER = 'Invalid Reqest: specified user does not exist';

//------------------------------------------------
export default {
    users: {},
    posts: {},
    postCounter: 0,
    follows: {},
    credentials: {},
    
    //-- CRUD Users ----------------------------------
    async userGet(userId) {
        const userStored = this.users[userId];
        if(!userStored) { return null;}
        return userStored;
    },
    async userCreate(userId, email) {
        const userNew = {
            id: userId,
            email: email,
        };
        this.users[userId] = userNew;
    },
    
    //-- CRUD Credentials ----------------------------
    async credentialCreate(userId, hash) {
        if(!(await this.userGet(userId))) {
            throw new Error('Specified user does not exist');
        }
        this.credentials[userId] = hash;
        return true;
    },
    async credentialGet(userId) {
        const hash = this.credentials[userId];
        if(!hash) { return null;}
        return hash;
    },

    
    //-- CRUD Follows --------------------------------
    async followLinkAdd(userIdFollower, userIdTarget) {
        //
        if(!this.users[userIdFollower] || !this.users[userIdTarget]) {
            return null;
        }
        //
        const followHash = `${userIdFollower} : ${userIdTarget}`;
        if(this.follows[followHash]) { return null;}
        //
        const followNew = {
            userIdFollower: userIdFollower,
            userIdTarget: userIdTarget,
        };
        this.follows[followHash] = followNew;
        return true;
    },
    async followLinkRemove(userIdFollower, userIdTarget) {
        //
        const followHash = `${userIdFollower} : ${userIdTarget}`;
        //
        if(!this.follows[followHash]) { return null;}
        //
        delete this.follows[followHash];
        return true;
    },
    async followersGet(userId) {
        //
        if(!this.users[userId]) {
            return null;
        }
        //
        let result = Object.keys(this.follows);
        //
        result = result.map(key => this.follows[key]);
        //
        result = result.filter(function (followLink) {
            return followLink.userIdTarget === userId;
        });
        //
        result = result.map(function (followLink) {
            return followLink.userIdFollower;
        });
        //
        return result;
    },
    async followingGet(userId) {
        //
        if(!this.users[userId]) {
            return null;
        }
        //
        let result = Object.keys(this.follows);
        //
        result = result.map(key => this.follows[key]);
        //
        result = result.filter(function (followLink) {
            return followLink.userIdFollower === userId;
        });
        //
        result = result.map(function (followLink) {
            return followLink.userIdTarget;
        });
        //
        return result;
    },
};
