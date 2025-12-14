export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super(
      'USER_ALREADY_EXISTS',
      'User with this email or username already exists',
    );
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('INVALID_CREDENTIALS', 'Invalid credentials');
  }
}
