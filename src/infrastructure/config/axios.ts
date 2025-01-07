import axios from 'axios';
import queryString from 'query-string';
import { ENV } from './CONSTANTS';
import { UserStorage } from '../storages/UserStorage';
// https://lightrains.com/blogs/axios-intercepetors-react/

class AxiosConfig {
    private controller;
    private userStorage;
    private axiosConfig;
    private countFetching;

    constructor() {
        this.controller = new AbortController();
        this.userStorage = new UserStorage();
        this.countFetching = 0;
        this.axiosConfig = this.initialAxiosInstance(this);
        this.initInterceptor(this);
    }

    initialAxiosInstance(self: AxiosConfig) {
        return axios.create({
            baseURL: process.env.REACT_APP_API_END_POINT,
            timeout: ENV.TIMEOUT,
            signal: self.controller.signal,
            paramsSerializer: (params) => queryString.stringify(params),
        });
    }

    initInterceptor(self: AxiosConfig) {
        self.axiosConfig.interceptors.request.use(
            (config) => {
                self.countFetching++;
                console.log(self.countFetching);
                if (self.countFetching === 1) {
                    // calling api
                    window.addEventListener('popstate', () => self.abortFetching());
                }
                const token = self.userStorage.getAccessToken();
                if (token && config.headers) {
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
                if (config.headers) {
                    config.headers['Content-Type'] = 'application/json';
                }
                return config;
            },
            (error) => {
                Promise.reject(error);
            },
        );

        self.axiosConfig.interceptors.response.use(
            (response) => {
                self.countFetching--;
                console.log(self.countFetching);

                if (self.countFetching === 0) {
                    window.removeEventListener('popstate', () => self.abortFetching());
                }
                return response;
            },
            async (error) => {
                self.countFetching--;
                console.log(self.countFetching);

                if (self.countFetching === 0) {
                    window.removeEventListener('popstate', () => self.abortFetching());
                }
                if (!window.navigator.onLine) {
                    window.location.reload();
                    return;
                }
                if (error?.response?.status === 401) {
                    self.controller.abort(); // stop other when
                    try {
                        const response = await axios.post(
                            '/auth/refresh',
                            {
                                refreshToken: self.userStorage.getRefreshToken(),
                            },
                            {
                                headers: {
                                    Authorization: 'Bearer ' + self.userStorage.getAccessToken(), //the token is a variable which holds the token
                                },
                                baseURL: process.env.REACT_APP_API_END_POINT,
                                timeout: ENV.TIMEOUT,
                            },
                        );
                        localStorage.removeItem('user');
                        localStorage.setItem('user', JSON.stringify(response.data.results));
                        window.location.reload();
                    } catch (error) {
                        window.localStorage.removeItem('user');
                        window.location.replace('/');
                        return Promise.reject(error);
                    }
                } else {
                    throw error?.response?.data ? error.response.data : error.response;
                }
            },
        );
    }

    public abortFetching() {
        this.controller.abort();
        this.resetConfig();
    }

    public resetConfig() {
        this.controller = new AbortController();
        this.axiosConfig = this.initialAxiosInstance(this);
        this.initInterceptor(this);
    }

    getAxiosConfig() {
        return this.axiosConfig;
    }
}

const axiosConfig = new AxiosConfig();
export default axiosConfig;
