import { UserToken } from "../../domain/entities/UserEntity";

export interface UserStorageRepository {
  getUserInfo(): UserToken | null;
  setUserInfo(user: UserToken): void;
  removeUserInfo(): void;
  getUserRoles(): string[];
  getAccessToken(): string;
  getRefreshToken(): string;
}
