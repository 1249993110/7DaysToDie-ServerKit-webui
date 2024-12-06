<template>
    <div></div>
</template>

<script>
export default {
    name: 'loginSuccess',
};
</script>

<script setup>
const route = useRoute();
const router = useRouter();

const query = route.query;
const steamId = query.steamId;
const playerName = query.playerName;
const accessToken = query.accessToken;
const expiresIn = query.expiresIn;
const refreshToken = query.refreshToken;
const redirect = query.redirect;

const userInfoStore = useUserInfoStore();
userInfoStore.loginByToken(playerName ?? steamId, accessToken, expiresIn, refreshToken);

router.push(redirect ?? '/');
</script>
