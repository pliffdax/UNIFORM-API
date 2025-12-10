export type UserRecord = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  isStaff: boolean;
};

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findByUsername(username: string): Promise<UserRecord | null>;
  createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
    isStaff: boolean;
  }): Promise<UserRecord>;
}
