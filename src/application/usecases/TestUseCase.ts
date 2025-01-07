import { TimeSleep } from '../../domain/entities/TestEntity';
import { TestRepository } from '../repositories/TestRepository';

export class TestUseCase implements TestUseCaseInterface {
    private testRepo: TestRepository;
    constructor(testRepo: TestRepository) {
        this.testRepo = testRepo;
    }

    async getModeratorAccess(): Promise<any> {
        return this.testRepo.getModeratorAccess();
    }
    async getAdminAccess(): Promise<any> {
        return this.testRepo.getAdminAccess();
    }
    async getUserAccess(): Promise<any> {
        return this.testRepo.getUserAccess();
    }
    async getPublicAccess(): Promise<any> {
        return this.testRepo.getPublicAccess();
    }
    async getTimeSleep(params: TimeSleep): Promise<any> {
        return this.testRepo.getTimeSleep(params);
    }
}
export interface TestUseCaseInterface {
    getModeratorAccess(): Promise<any>;
    getAdminAccess(): Promise<any>;
    getUserAccess(): Promise<any>;
    getPublicAccess(): Promise<any>;
    getTimeSleep(params: TimeSleep): Promise<any>;
}
