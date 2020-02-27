

/*== Error Handling Middleware =================================================

This module is a stub left over from a previous error handling strategy. It is
in the process of being replaced.

*/

//-- Http Error ----------------------------------
// class httpError extends Error {
//     constructor(statusCode) {
//         super();
//         this.statusCode = statusCode;
//     }
// }

//-- Error Handler -------------------------------
export default {
    handler(error, request, response, next) {
        if(response.headersSent) {
            return next(error);
        }
        // if(!(error instanceof httpError)) {
            return next(error);
        // }
        // response.status(error.statusCode);
        // response.end();
    },
    // httpError: httpError
};
