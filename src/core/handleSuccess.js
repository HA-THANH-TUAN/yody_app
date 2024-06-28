const ResponseApi = require('./response');

const SUCCESS_INFOR = {
    CREATED: {
        name: 'CREATED',
        status: 201
    },
    OK: {
        name: 'OK',
        status: 200
    }
};

class ResponseRequest {
    constructor(metadata, message, status) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }
    send(res) {
        const rsp = new ResponseApi(this.metadata, this.message, this.status);
        res.status(this.status);
        res.json(rsp);
    }
}

class CREATED extends ResponseRequest {
    constructor(
        metadata = undefined,
        message = SUCCESS_INFOR.CREATED.name,
        status = SUCCESS_INFOR.CREATED.status
    ) {
        super(metadata, message, status);
    }
}
class OK extends ResponseRequest {
    constructor(
        metadata = undefined,
        message = SUCCESS_INFOR.OK.name,
        status = SUCCESS_INFOR.OK.status
    ) {
        super(metadata, message, status);
    }
}

module.exports = {
    CREATED,
    OK
};
