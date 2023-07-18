class InternalServerError extends Error {
  constructor(status = 500, message = 'Internal Server Error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
  }
}

export default InternalServerError;
