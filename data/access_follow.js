

/*== Follow Data Access ========================================================

This module provides data access for user follow relations, including:
    making one user follow or unfollow another user,
    getting a list of users that follow a specified user,
    and getting a list of users that a specified user follows.

*/

//-- Dependencies --------------------------------
import database from '../database/index.js';
import { userNameCanonical } from './utilities.js';


//== Access Functions ==========================================================

//-- Follow --------------------------------------
export async function followLinkAdd(userNameFollower, userNameTarget) {
    let userIdFollower = userNameCanonical(userNameFollower);
    let userIdTarget = userNameCanonical(userNameTarget);
    // Throws error on duplicate follow
    try {
        await database('follows').insert({
            followerId: userIdFollower,
            targetId: userIdTarget,
        });
    } catch {
        return false;
    }
    return true;
}

//-- Unfollow ------------------------------------
export async function followLinkRemove(userNameFollower, userNameTarget) {
    let userIdFollower = userNameCanonical(userNameFollower);
    let userIdTarget = userNameCanonical(userNameTarget);
    // Doesn't throw; returns 1 or 0 as success flag
    const result = await database('follows')
        .where({followerId: userIdFollower, targetId: userIdTarget})
        .del();
    if(result) { return true;}
    else { return false;}
}

//-- Get Followers -------------------------------
export async function followersGet(userName) {
    let userId = userNameCanonical(userName);
    const result = await database('follows')
        .select('followerId')
        .where({targetId: userId});
    return result.map(data => data.followerId);
}

//-- Get users specified user is following -------
export async function followingGet(userName) {
    let userId = userNameCanonical(userName);
    const result = await database('follows')
        .select('targetId')
        .where({followerId: userId});
    return result.map(data => data.targetId);
}
