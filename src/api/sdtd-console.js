import http from '../utils/request';

export const sendConsoleCommand = function (command, inMainThread = false) {
    return http.post('/Server/ExecuteConsoleCommand', null, {
        params: {
            command: command,
            inMainThread: inMainThread,
        },
    });
};

export const sendGlobalMessage = function (message) {
    return sendConsoleCommand(`ty-say \"${message}\"`);
};

export const sendMessageToPlayer = function (playerIdOrName, message) {
    return sendConsoleCommand(`ty-pm ${playerIdOrName} \"${message}\"`);
};

export const telePlayer = function (playerIdOrName, target) {
    return sendConsoleCommand(`tele ${playerIdOrName} ${target}`);
};

export const giveItem = function (playerIdOrName, itemName, count, quality = 0, durability = 0) {
    return sendConsoleCommand(`ty-gi ${playerIdOrName} ${itemName} ${count} ${quality} ${durability}`);
};

export const spawnEntity = function (playerNameOrEntityId, spawnEntityIdOrName) {
    return sendConsoleCommand(`se ${playerNameOrEntityId} ${spawnEntityIdOrName}`, true);
};

export const kickPlayer = function (playerIdOrName, reason) {
    return sendConsoleCommand(`kick ${playerIdOrName} \"${reason}\"`);
};

export const addAdmin = function (playerIdOrName, level, displayName) {
    return sendConsoleCommand(`admin add ${playerIdOrName} ${level} \"${displayName}\"`);
};

export const removeAdmin = function (playerIdOrName) {
    return sendConsoleCommand(`admin remove ${playerIdOrName}`);
};

export const changePlayerPoints = function (playerId, count) {
    return sendConsoleCommand(`ty-cpp ${playerId} ${count}`);
};

export const resetPlayer = function (playerId) {
    return sendConsoleCommand(`ty-rpp ${playerId}`);
};

export const removePlayerLandClaims = function (playerId) {
    return sendConsoleCommand(`ty-rplc ${playerId}`);
};

export const removePlayerLandClaim = function (x, y, z) {
    return sendConsoleCommand(`ty-rplc ${x} ${y} ${z}`);
};