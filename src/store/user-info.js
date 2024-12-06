import { defineStore } from 'pinia';
import * as api from '~/api/account';

export const useUserInfoStore = defineStore('user-info', {
    state: () => {
        return {
            displayName: localStorage.getItem('displayName'),
            token: localStorage.getItem('token'),
            expiresAt: localStorage.getItem('expiresAt'),
            refreshToken: localStorage.getItem('refreshToken'),
        };
    },
    getters: {},
    actions: {
        save() {
            localStorage.setItem('displayName', this.displayName);
            localStorage.setItem('token', this.token);
            localStorage.setItem('expiresAt', this.expiresAt);
            localStorage.setItem('refreshToken', this.refreshToken);
        },
        async login(username, password) {
            const data = await api.login(username, password);

            this.displayName = username;
            this.token = data.access_token;
            this.expiresAt = dayjs().add(data.expires_in, 'second').format();
            this.refreshToken = data.refresh_token;

            this.save();
        },
        loginByToken(displayName, accessToken, expiresIn, refreshToken) {
            this.displayName = displayName;
            this.token = accessToken;
            this.expiresAt = dayjs().add(expiresIn, 'second').format();
            this.refreshToken = refreshToken;

            this.save();
        },
        async refresh() {
            const data = await api.refreshToken(this.refreshToken);

            this.token = data.access_token;
            this.expiresAt = dayjs().add(data.expires_in, 'second').format();
            this.refreshToken = data.refresh_token;

            this.save();
        },
        async getToken() {
            if (dayjs() > dayjs(this.expiresAt)) {
                await this.refresh();
            }

            return this.token;
        },
        async isLoggedIn() {
            try {
                if (!this.token) {
                    return false;
                }

                if (dayjs() > dayjs(this.expiresAt)) {
                    await this.refresh();
                }

                return true;
            } catch {
                return false;
            }
        },
        async logout() {
            this.token = '';
            closeWebsocket();
            localStorage.removeItem('displayName');
            localStorage.removeItem('token');
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('refreshToken');
            await Promise.resolve();
        },
    },
});
