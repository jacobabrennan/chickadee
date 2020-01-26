

//==============================================================================

//-- Dependencies --------------------------------
import bcrypt from 'bcryptjs';
import database_fake from './fake_database.js';
import {
    ERROR_USERNAME_BAD,
    userNameCanonical,
} from './utilities.js';

//-- Project Constants ---------------------------
const SALT_ROUNDS = 10;
export const ERROR_USERNAME_COLLISION = 'Invalid User Name: already taken';
export const ERROR_PASSWORD_BAD = 'Invalid Password: password missing';
//------------------------------------------------
export async function authRegister(userNameRequested, passwordRaw, emailRaw) {
    // Cancel if password is bad (absent)
    if(!passwordRaw) { throw ERROR_PASSWORD_BAD;}
    // Generate ID from requested name; Cancel on bad names (ERROR_USERNAME_BAD)
    const userId = userNameCanonical(userNameRequested);
    // Cancel if the name is already taken
    const userCurrent = await database_fake.userGet(userId);
    if(userCurrent) { throw ERROR_USERNAME_COLLISION;}
    // Create the user in the database
    await database_fake.userCreate(userId, emailRaw);
    // Store password (hashed)
    const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
    await database_fake.credentialCreate(userId, hash);
    // Return the new user's ID
    return userId;
}
// export async function credentialAssociate(userNameRaw, passwordRaw) {
//     // Calculate userId for given name; this should throw, as the user should
//         // already exist by the time this function is called.
//     const userId = userNameCanonical(userNameRaw);
//     // Calculate hash from password
//     const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
//     await database_fake.credentialCreate(userId, hash);
//     // Return actual userId
//     return userId;
// }
export async function credentialValidate(userNameRaw, passwordRaw) {
    // Calculate userId for requested name, cancel on bad usernames
    let userId;
    try {
        userId = userNameCanonical(userNameRaw);
    }
    catch(error) {
        if(error === ERROR_USERNAME_BAD) {
            return false;
        }
    }
    // Retrieve password hash from database, cancel if non-exists
    const hash = await database_fake.credentialGet(userId);
    if(!hash) { return false;}
    // Compare password to hash, cancel if they don't match
    const result = await bcrypt.compare(passwordRaw, hash);
    if(!result) { return false;}
    // On validation, return actual userId
    return userId;
}
