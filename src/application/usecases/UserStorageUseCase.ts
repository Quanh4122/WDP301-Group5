import { UserToken } from '../../domain/entities/UserEntity';
import { UserStorageRepository } from '../repositories/UserStorageRepository';

export class UserStorageUseCase implements UserStorageUseCaseInterface {
    private userStorageUseCase: UserStorageRepository;

    constructor(userStorageRepo: UserStorageRepository) {
        this.userStorageUseCase = userStorageRepo;
    }

    getUserInfo(): UserToken | null {
        return this.userStorageUseCase.getUserInfo();
    }
    setUserInfo(user: UserToken): void {
        return this.userStorageUseCase.setUserInfo(user);
    }
    removeUserInfo(): void {
        return this.userStorageUseCase.removeUserInfo();
    }
    getUserRoles(): string[] {
        return this.userStorageUseCase.getUserRoles();
    }
    getAccessToken(): string {
        return this.userStorageUseCase.getAccessToken();
    }
    getRefreshToken(): string {
        return this.userStorageUseCase.getAccessToken();
    }
}

export interface UserStorageUseCaseInterface {
    getUserInfo(): UserToken | null;
    setUserInfo(user: UserToken): void;
    removeUserInfo(): void;
    getUserRoles(): string[];
    getAccessToken(): string;
    getRefreshToken(): string;
}
