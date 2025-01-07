import { TestRepository } from '../../application/repositories/TestRepository';
import axiosConfig from '../config/axios';
import { TimeSleep } from '../models/TestModel';

export class TestAPI implements TestRepository {
    async getModeratorAccess(): Promise<any> {
        const API_URL = '/moderator';
        const response = await axiosConfig.getAxiosConfig().get(API_URL);
        return response.data;
    }
    async getAdminAccess(): Promise<any> {
        const API_URL = '/admin';
        const response = await axiosConfig.getAxiosConfig().get(API_URL);
        return response.data;
    }
    async getUserAccess(): Promise<any> {
        const API_URL = '/user';
        const response = await axiosConfig.getAxiosConfig().get(API_URL);
        return response.data;
    }
    async getPublicAccess(): Promise<any> {
        const API_URL = '/all';
        const response = await axiosConfig.getAxiosConfig().get(API_URL);
        return response.data;
    }
    async getTimeSleep(params: TimeSleep): Promise<any> {
        const API_URL = '/time-sleep';
        const response = await axiosConfig.getAxiosConfig().get(API_URL, { params });
        return response.data;
    }
}
