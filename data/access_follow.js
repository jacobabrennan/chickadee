

//==============================================================================

//-- Dependencies --------------------------------
import database from '../database/index.js';
import { userNameCanonical } from './utilities.js';

//------------------------------------------------
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
export async function followersGet(userName) {
    let userId = userNameCanonical(userName);
    const result = await database('follows')
        .select('followerId')
        .where({targetId: userId});
    return result.map(data => data.followerId);
}
export async function followingGet(userName) {
    let userId = userNameCanonical(userName);
    const result = await database('follows')
        .select('targetId')
        .where({followerId: userId});
    return result.map(data => data.targetId);
}
