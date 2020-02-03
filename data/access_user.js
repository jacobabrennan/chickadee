

//==============================================================================

//-- Dependencies --------------------------------
import database from '../database/index.js';

//------------------------------------------------
export async function userGet(userId, selectionFields) {
    let result;
    try {
        result = await database('users')
            .where({userId: userId})
            .select(selectionFields)
            .first();
    } catch(error) {
        console.log('Not retrieved', error)
        return null;
    }
    return result;
}
