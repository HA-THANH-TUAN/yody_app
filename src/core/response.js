class ResponseApi {
    constructor(metadata, message, status) {
        this.message = message;
        this.status = status;
        this.metadata = metadata;
    }
}

module.exports = ResponseApi;
