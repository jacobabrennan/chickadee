

//== Database Access Utilities =================================================

//-- Project Constants ---------------------------
export const ERROR_USERNAME_BAD = 'Invalid User Name: name is empty or non-alphanumeric';

//-- Utility Functions ---------------------------
export function userNameCanonical(nameRaw) {
    if(!nameRaw) {
        throw ERROR_USERNAME_BAD;
    }
    let nameStripped = nameRaw.replace(/[^a-z0-9]/gi,'');
    if(nameStripped !== nameRaw) {
        throw ERROR_USERNAME_BAD;
    }
    return nameStripped.toLowerCase();
}
