

//== GraphQL endpoint resolvers ================================================

//-- Dependencies --------------------------------
import * as dataPost from '../data/access_post.js';
import * as dataFollow from '../data/access_follow.js';
import * as dataUser from '../data/access_user.js';

//------------------------------------------------
export default {

    //-- Users ---------------------------------------
    async userGet(query, request) {
        // Construct parameters
        const userId = query.userId;
        const getData = ['userId','name','description'];
        // Retrieve Data
        const result = await dataUser.userGet(userId, getData);
        return result;
    },
    async userUpdate(query, request) {
        // Construct parameters
        const userId = request.session.userId;
        const name = query.name;
        const description = query.description;
        const updateData = {};
        if(name){ updateData.name = name;}
        if(description){ updateData.description = description;}
        // Retrieve Data
        await dataUser.userUpdate(userId, updateData);
        updateData.userId = userId;
        return updateData;
    },
    
    //-- Posts ---------------------------------------
    async postGet(query, request) {
        // Construct parameters
        const postId = query.postId;
        // Retrieve Data
        const result = await dataPost.postGet(postId);
        return result;
    },
    async postCreate(query, request) {
        // Construct parameters
        const userIdAuthor = request.session.userId;
        const postContent = {
            text: query.text,
        };
        // Retrieve Data
        const result = await dataPost.postCreate(userIdAuthor, postContent);
        return result;
    },
    
    //-- Feed ----------------------------------------
    async feedGet(query, request) {
        // Construct parameters
        const userId = query.userId;
        // Retrieve Data
        const result = await dataPost.feedGet(userId);
        return result;
    },
    
    //-- Followers -----------------------------------
    async followersGet(query, request) {
        // Construct parameters
        const userId = query.userId;
        // Retrieve Data
        const result = await dataFollow.followersGet(userId);
        return result;
    },
    async followLinkAdd(query, request) {
        // Construct parameters
        const followerId = request.session.userId;
        const targetId = query.targetId;
        // Retrieve Data
        const result = await dataFollow.followLinkAdd(followerId, targetId);
        return result;
    },
    async followLinkRemove(query, request) {
        // Construct parameters
        const followerId = request.session.userId;
        const targetId = query.targetId;
        // Retrieve Data
        const result = await dataFollow.followLinkRemove(followerId, targetId);
        return result;
    },
};
