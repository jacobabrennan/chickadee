

//==============================================================================

//-- Dependencies --------------------------------
import bcrypt from 'bcryptjs';
import { userNameCanonical } from './data_access.js';
import database_fake from './fake_database.js';

//-- Project Constants ---------------------------
const SALT_ROUNDS = 10;

//------------------------------------------------
export async function credentialCreate(userNameRequested, passwordRaw) {
    const userName = userNameCanonical(userNameRequested);
    const userId = await database_fake.userCreate(userName);
    if(!userId) {
        throw new Error('Invalid user name: already taken');
    }
    const hash = await bcrypt.hash(passwordRaw, SALT_ROUNDS);
    const result = await database_fake.credentialCreate(userId, hash);
    if(!result) { return false;}
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
