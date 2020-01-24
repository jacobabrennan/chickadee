

//==============================================================================

//-- Dependencies --------------------------------
import bcrypt from 'bcryptjs';
import database_fake from './fake_database.js';
import fake_database from './fake_database.js';

//-- Project Constants ---------------------------
const SALT_ROUNDS = 10;
export const ERROR_USERNAME_COLLISION = 'Invalid User Name: already taken';
export const ERROR_USERNAME_BAD = 'Invalid User Name: name is empty or non-alphanumeric';
export const ERROR_PASSWORD_BAD = 'Invalid Password: password missing';

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
export async function authRegister(userNameRequested, passwordRaw, emailRaw) {
    // Cancel if password is bad (absent)
    if(!passwordRaw) { throw ERROR_PASSWORD_BAD;}
    // Generate ID from requested name; Cancel on bad names (ERROR_USERNAME_BAD)
    const userId = userNameCanonical(userNameRequested);
    // Cancel if the name is already taken
    const userCurrent = await database_fake.userGet(userId);
    if(userCurrent) { throw ERROR_USERNAME_COLLISION;}
    // Create the user in the database
    await database_fake.userCreate(userName, emailRaw);
    // Store password (hashed)
    const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
    await database_fake.credentialCreate(userId, hash);
    // Return the new user's ID
    return userId;
}
export async function credentialAssociate(userNameRaw, passwordRaw) {
    const userId = userNameCanonical(userNameRaw);
    const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
    const result = await database_fake.credentialCreate(userId, hash);
    if(!result) { return false;}
    return userId;
}
export async function credentialValidate(userNameRaw, passwordRaw) {
    const userId = userNameCanonical(userNameRaw);
    const hash = await database_fake.credentialGet(userId);
    const result = await bcrypt.compare(passwordRaw, hash);
    if(!result) { return false;}
    return userId;
}
