import { MGUser } from '../../domain/entities/UserEntity';

export class UserUseCase implements UserUseCaseInterface {
    async getUserList(): Promise<MGUser[]> {
        const results: MGUser[] = [];

        for (let i = 0; i < 10; i++) {
            const model: MGUser = {
                id: i + 1,
                username: '山田太郎' + 1,
                displayName: 'Taro' + 1,
                mail: 'taro.yamada＠**co.jp',
                companyName: '＊＊＊株式会社',
                authority: 'システム管理者（NRBX）',
                flag: true,
            };
            results.push(model);
        }
        return results;
    }
}
export interface UserUseCaseInterface {
    getUserList(): Promise<MGUser[]>;
}
