

//==============================================================================

//------------------------------------------------
export default {
    users: {},
    posts: {},
    postCounter: 0,
    follows: {},
    credentials: {},
    
    //------------------------------------------------
    async userGet(userId) {
        const userStored = this.users[userId];
        if(!userStored) { return null;}
        return userStored;
    },
    async userCreate(userId) {
        if(this.users[userId]) {
            return null;
        }
        const userNew = {id: userId};
        this.users[userId] = userNew;
        return userId;
    },
    
    //------------------------------------------------
    async credentialCreate(userId, hash) {
        if(!(await this.userGet(userId))) {
            throw new Error('Specified user does not exist');
        }
        this.credentials[userId] = hash;
        return true;
    },
    async credentialGet(userId) {
        console.log('----', this.credentials)
        if(!(await this.userGet(userId))) {
            console.log(this.users)
            throw new Error('Specified user does not exist');
        }
        const hash = this.credentials[userId];
        if(!hash) {
            throw new Error('Specified user credentials do not exist');
        }
        return hash;
    },
    
    //------------------------------------------------
    async postGet(postId) {
        const postStored = this.posts[postId];
        if(!postStored) { return null;}
        return postStored;
    },
    async postCreate(userIdAuthor, postContent) {
        //
        if(!this.users[userIdAuthor]) {
            return null;
        }
        //
        const postNew = {
            id: this.postCounter,
            userIdAuthor: userIdAuthor,
            content: postContent,
        };
        this.postCounter++;
        return postNew.id;
    },
    
    //------------------------------------------------
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
