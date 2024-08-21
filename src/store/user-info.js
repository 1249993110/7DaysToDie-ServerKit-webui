import { defineStore } from 'pinia';
import * as api from '../api/account';
import { closeWebsocket } from '~/utils/websocket';

export const useUserInfoStore = defineStore('user-info', {
    state: () => {
        return {
            username: sessionStorage.getItem('username'),
            password: sessionStorage.getItem('password'),
            token: sessionStorage.getItem('token'),
            expiresIn: sessionStorage.getItem('expiresIn'),
        };
    },
    getters: {},
    actions: {
        async login(username, password) {
            const data = await api.login(username, password);

            this.username = username;
            this.password = password;
            this.token = data.access_token;
            this.expiresIn = dayjs()
                .add(data.expires_in / 2, 'second')
                .format();

            sessionStorage.setItem('username', this.username);
            sessionStorage.setItem('password', this.password);
            sessionStorage.setItem('token', this.token);
            sessionStorage.setItem('expiresIn', this.expiresIn);
        },
        async getToken() {
            if (dayjs() > dayjs(this.expiresIn)) {
                
                await this.login(this.username, this.password);
            }

            return this.token;
        },
        async isLoggedIn() {
            try {
                if (!this.username || !this.password) {
                    return false;
                }

                if (dayjs() > dayjs(this.expiresIn)) {
                    await this.login(this.username, this.password);
                }

                return true;
            } catch {
                return false;
            }
        },
        async logout() {
            this.token = '';
            closeWebsocket();
            sessionStorage.clear();
            await Promise.resolve();
        },
    },
});
