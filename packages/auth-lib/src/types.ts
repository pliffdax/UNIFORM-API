export type PublicUser = {
  id: string;
  username: string;
  email: string;
  isStaff: boolean;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  isStaff?: boolean;
};

export type LoginInput = {
  emailOrUsername: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResult = {
  user: PublicUser;
  tokens: AuthTokens;
};
