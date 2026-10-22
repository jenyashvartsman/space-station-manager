export class NotFoundError extends Error {
  status = 404;
  code = 'NOT_FOUND';

  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  status = 400;
  code = 'VALIDATION_ERROR';

  constructor(message = 'Validation error') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  status = 409;
  code = 'CONFLICT';

  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}
