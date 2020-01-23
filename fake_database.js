export default {
    users: {},
    posts: {},
    postCounter: 0,
    follows: {},
    userGet(userId) {
        const userStored = this.users[userId];
        if(!userStored) { return null;}
        return userStored;
    },
    userCreate(userId) {
        if(this.users[userId]) {
            return null;
        }
        const userNew = {id: userId};
        this.users[userId] = userNew;
        return userId;
    },
    postGet(postId) {
        const postStored = this.posts[postId];
        if(!postStored) { return null;}
        return postStored;
    },
    postCreate(userIdAuthor, postContent) {
        const postNew = {
            id: this.postCounter,
            userIdAuthor: userIdAuthor,
            content: postContent,
        };
        this.postCounter++;
        return postNew.id;
    },
    followLinkAdd(userIdFollower, userIdTarget) {
        const followHash = `${userIdFollower} : ${userIdTarget}`;
        if(this.follows[followHash]) { return null;}
        const followNew = {
            userIdFollower: userIdFollower,
            userIdTarget: userIdTarget,
        };
        this.follows[followHash] = followNew;
        return true;
    },
    followLinkRemove(userIdFollower, userIdTarget) {
        const followHash = `${userIdFollower} : ${userIdTarget}`;
        if(!this.follows[followHash]) { return null;}
        delete this.follows[followHash];
        return true;
    },
    followersGet(userId) {
        let result = Object.keys(this.follows);
        result = result.filter(function (followLink) {
            return followLink.userIdTarget === userId;
        });
        result = result.map(function (followLink) {
            return followLink.userIdFollower;
        });
        return result;
    },
    followingGet(userId) {
        let result = Object.keys(this.follows);
        result = result.filter(function (followLink) {
            return followLink.userIdFollower === userId;
        });
        result = result.map(function (followLink) {
            return followLink.userIdTarget;
        });
        return result;
    },
}