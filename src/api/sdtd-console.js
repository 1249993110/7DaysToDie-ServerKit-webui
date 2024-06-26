import http from '../utils/request';

export const sendConsoleCommand = function (command, inMainThread = false) {
    return http.post('/Server/ExecuteConsoleCommand', null, {
        params: {
            command: command,
            inMainThread: inMainThread,
        },
    });
};

export const sendGlobalMessage = function (message, senderName = 'Server') {
    return sendConsoleCommand(`ty-say \"${message}\" ${senderName}`);
};

export const sendMessageToPlayer = function (playerIdOrName, message, senderName = 'Server') {
    return sendConsoleCommand(`ty-pm ${playerIdOrName} \"${message}\" ${senderName}`);
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

export const kickPlayer = function (playerIdOrName) {
    return sendConsoleCommand(`kick ${playerIdOrName}`);
};

export const addAdmin = function (playerIdOrName, level, displayName) {
    return sendConsoleCommand(`admin add ${playerIdOrName} ${level} ${displayName}`);
};
