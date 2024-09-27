import * as sdtdConsole from '~/api/sdtd-console';
import { sendPrivateMessage } from '~/api/server';
import { showPlayerInventory } from '~/components/InventoryDialog/index';
import { showPlayerDetails } from '~/components/PlayerDetailsDialog/index';
import { showPlayerSkills } from '~/components/PlayerSkillsDialog/index';
import { batchBan } from '~/components/BatchAddBlacklist/index';
import { batchGiveItem } from '~/components/BatchGiveItem/index';
import { i18n } from '~/plugins/i18n';

export const sendMessageToPlayers = async (playerIds) => {
    const val = await myprompt('', i18n.global.t('global.message.inputText'));
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sendPrivateMessage(playerId, val);
    }
    ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
};

export const giveItemToPlayers = async (playerIds, displayNames) => {
    batchGiveItem(playerIds, displayNames);
};

export const changePlayerPoints = async (playerIds) => {
    const count = await myprompt(i18n.global.t('utils.playerHelper.title'), i18n.global.t('utils.playerHelper.inputCount'), '', '', /^-?\d+$/);
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.changePlayerPoints(playerId, count);
        if (count < 0) {
            await sendPrivateMessage(playerId, i18n.global.t('utils.playerHelper.deductPoints', [-count]));
        } else {
            await sendPrivateMessage(playerId, i18n.global.t('utils.playerHelper.addPoints', [count]));
        }
    }
    ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
};

export const spawnEntityToPlayers = async (entityIds) => {
    const spawnEntityIdOrName = await myprompt(i18n.global.t('global.message.example') + ': zombieNurse', i18n.global.t('utils.playerHelper.inputEntityIdOrName'));
    for (let i = 0; i < entityIds.length; i++) {
        const entityId = entityIds[i];
        await sdtdConsole.spawnEntity(entityId, spawnEntityIdOrName);
    }
    ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
};

export const telePlayers = async (playerIds) => {
    const target = await myprompt(i18n.global.t('global.message.example') + ': EOS_XXX', i18n.global.t('utils.playerHelper.teleportTarget'));
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.telePlayer(playerId, target);
    }
    ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
};

export const kickPlayers = async (playerIds) => {
    const reason = await myprompt(i18n.global.t('utils.playerHelper.kickPlayerReason'), i18n.global.t('utils.playerHelper.kickPlayerConfirm'));

    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.kickPlayer(playerId, reason);
    }
    ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
};

export const banPlayers = async (playerIds, displayNames) => {
    batchBan(playerIds, displayNames);
};

export const setSuperAdmins = async (playerIds, displayNames) => {
    if (await myconfirm(i18n.global.t('utils.playerHelper.setSuperAdminConfirm'), i18n.global.t('global.message.title'), 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            const displayName = displayNames[i];
            await sdtdConsole.addAdmin(playerId, 0, 'Admin-' + displayName);
        }
        ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
    }
};

export const cancelAdmins = async (playerIds) => {
    if (await myconfirm(i18n.global.t('utils.playerHelper.cancelAdminConfirm'), i18n.global.t('global.message.title'), 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.removeAdmin(playerId);
        }
        ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
    }
};

export const removePlayerLandClaims = async (playerIds) => {
    if (await myconfirm(i18n.global.t('utils.playerHelper.removeLandClaimConfirm'), i18n.global.t('global.message.title'), 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.removePlayerLandClaims(playerId);
        }
        ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
    }
};

export const resetPlayers = async (playerIds) => {
    if (await myconfirm(i18n.global.t('utils.playerHelper.resetPlayerConfirm'), i18n.global.t('global.message.title'), 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.resetPlayer(playerId);
        }
        ElMessage.success(i18n.global.t('global.message.cmdSentSuccess'));
    }
};

export { showPlayerInventory, showPlayerDetails, showPlayerSkills };
