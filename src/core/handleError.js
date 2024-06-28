const ERORR_INFOR = {
    BAD_REQUEST: {
        name: 'Bad Rquest',
        status: 400
    },
    NOT_FOUND: {
        name: 'Not Found',
        status: 404
    },
    UNPROCESSABLE: {
        name: 'Unprocessable',
        status: 422
    },
    UNAUTHORIZED: {
        name: 'Unauthorized',
        status: 401
    },
    INTERNAL_SERVER: {
        name: 'Internal Server Error',
        status: 500
    }
};

class BadRequest extends Error {
    constructor(
        message = ERORR_INFOR.BAD_REQUEST.name,
        status = ERORR_INFOR.BAD_REQUEST.status
    ) {
        super(message);
        this.status = status;
    }
}
class NotFound extends Error {
    constructor(
        message = ERORR_INFOR.NOT_FOUND.name,
        status = ERORR_INFOR.NOT_FOUND.status
    ) {
        super(message);
        this.status = status;
    }
}
class Unprocessable extends Error {
    constructor(
        message = ERORR_INFOR.UNPROCESSABLE.name,
        status = ERORR_INFOR.UNPROCESSABLE.status
    ) {
        super(message);
        this.status = status;
    }
}
class Unauthorized extends Error {
    constructor(
        message = ERORR_INFOR.UNAUTHORIZED.name,
        status = ERORR_INFOR.UNAUTHORIZED.status
    ) {
        super(message);
        this.status = status;
    }
}
class InternalServerError extends Error {
    constructor(
        message = ERORR_INFOR.INTERNAL_SERVER.name,
        status = ERORR_INFOR.INTERNAL_SERVER.status
    ) {
        super(message);
        this.status = status;
    }
}

function handleErrorRequest(cb) {
    return (req, res, next) => {
        cb(req, res, next).catch((err) => next(err));
    };
}
module.exports = {
    BadRequest,
    handleErrorRequest,
    NotFound,
    Unprocessable,
    Unauthorized,
    InternalServerError
};
