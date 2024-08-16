import * as sdtdConsole from '~/api/sdtd-console';
import { showPlayerInventory } from '~/components/InventoryDialog/index';
import { showPlayerDetails } from '~/components/PlayerDetailsDialog/index';
import { showPlayerSkills } from '~/components/PlayerSkillsDialog/index';
import myprompt from '~/utils/myprompt';
import myconfirm from '~/utils/myconfirm';
import { batchBan } from '~/components/BatchAddBlacklist/index';
import { batchGiveItem } from '~/components/BatchGiveItem/index';

export const sendMessageToPlayers = async (playerIds) => {
    const val = await myprompt('', '请输入文本');
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.sendMessageToPlayer(playerId, val);
    }
    ElMessage.success('发送命令成功');
};

export const giveItemToPlayers = async (playerIds, displayNames) => {
    batchGiveItem(playerIds, displayNames);
};

export const changePlayerPoints = async (playerIds) => {
    const count = await myprompt('为负数将扣除积分', '请输入积分数量', '', '', /^-?\d+$/);
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.changePlayerPoints(playerId, count);
        if (count < 0) {
            await sdtdConsole.sendMessageToPlayer(playerId, `您被扣除了 ${-count} 积分`);
        } else {
            await sdtdConsole.sendMessageToPlayer(playerId, `您成功充值了 ${count} 积分`);
        }
    }
    ElMessage.success('发送命令成功');
};

export const spawnEntityToPlayers = async (entityIds) => {
    const spawnEntityIdOrName = await myprompt('如: zombieNurse', '请输入实体Id或名称');
    for (let i = 0; i < entityIds.length; i++) {
        const entityId = entityIds[i];
        await sdtdConsole.spawnEntity(entityId, spawnEntityIdOrName);
    }
    ElMessage.success('发送命令成功');
};

export const telePlayers = async (playerIds) => {
    const target = await myprompt('如: 路人甲 或 EOS_XXX 或 x y z', '请输入目标, 可为玩家昵称、玩家Id或三维坐标');
    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.telePlayer(playerId, target);
    }
    ElMessage.success('发送命令成功');
};

export const kickPlayers = async (playerIds) => {
    const reason = await myprompt('如: 您因为左脚先踏出被踢出服务器', '此操作将踢出选定玩家, 是否继续? 请输入原因');

    for (let i = 0; i < playerIds.length; i++) {
        const playerId = playerIds[i];
        await sdtdConsole.kickPlayer(playerId, reason);
    }
    ElMessage.success('发送命令成功');
};

export const banPlayers = async (playerIds, displayNames) => {
    batchBan(playerIds, displayNames);
};

export const setSuperAdmins = async (playerIds, displayNames) => {
    if (await myconfirm('此操作将把选定玩家设置为超级管理员, 是否继续?', '提示', 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            const displayName = displayNames[i];
            await sdtdConsole.addAdmin(playerId, 0, '超级管理员-' + displayName);
        }
        ElMessage.success('发送命令成功');
    }
};

export const cancelAdmins = async (playerIds) => {
    if (await myconfirm('此操作将取消选定玩家的管理员权限, 是否继续?', '提示', 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.removeAdmin(playerId);
        }
        ElMessage.success('发送命令成功');
    }
};

export const removeLandClaims = async (playerIds) => {
    if (await myconfirm('此操作将移除选定玩家的所有领地石, 是否继续?', '提示', 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.removePlayerLandClaims(playerId);
        }
        ElMessage.success('发送命令成功');
    }
};

export const resetPlayers = async (playerIds) => {
    if (await myconfirm('此操作将重置选定玩家的存档, 是否继续?', '提示', 'warning')) {
        for (let i = 0; i < playerIds.length; i++) {
            const playerId = playerIds[i];
            await sdtdConsole.resetPlayer(playerId);
        }
        ElMessage.success('发送命令成功');
    }
};

export { showPlayerInventory, showPlayerDetails, showPlayerSkills };
