class ServerError extends Error {
    constructor(message, error) {
        super(message);
        this.success = false;
        this.error = error;
        Error.captureStackTrace(this, ServerError);
    }
}

exports.ServerError = ServerError;