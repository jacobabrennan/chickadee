

//==============================================================================

//------------------------------------------------
class httpError extends Error {
    constructor(statusCode) {
        super();
        this.statusCode = statusCode;
    }
}

//------------------------------------------------
export default {
    handler(error, request, response, next) {
        if(response.headersSent) {
            return next(error);
        }
        if(!(error instanceof httpError)) {
            return next(error);
        }
        response.status(error.statusCode);
        response.end();
    },
    httpError: httpError
};
