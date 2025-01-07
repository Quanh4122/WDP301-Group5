import { UserStorageRepository } from "../../application/repositories/UserStorageRepository";
import { UserToken } from "../../domain/entities/UserEntity";

export class UserStorage implements UserStorageRepository {
  getUserInfo(): UserToken | null {
    if (!localStorage.getItem("user")) return null;
    return JSON.parse(localStorage.getItem("user") || "{}");
  }
  setUserInfo(user: UserToken): void {
    localStorage.setItem("user", JSON.stringify(user));
  }
  removeUserInfo(): void {
    localStorage.removeItem("user");
  }
  getUserRoles(): string[] {
    if (!localStorage.getItem("user")) return [];
    const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
    return userLocal?.user?.roles ?? [];
  }
  getAccessToken(): string {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token;
  }
  getRefreshToken(): string {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.refreshToken;
  }
}
