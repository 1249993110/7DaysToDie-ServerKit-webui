import http from '../utils/request';

export const getOnlinePlayers = () =>{
    return http.get('/OnlinePlayers');
}

export const getOnlinePlayerDetails = (playerId) =>{
    return http.get('/OnlinePlayers/' + playerId + '/Details');
}

/**
 * 分页获取历史玩家
 * @returns
 */
export const getHistoryPlayers = (params) => {
    return http.get('/HistoryPlayers', { params: params });
};

export const getHistoryPlayerDetails = (playerId) =>{
    return http.get('/HistoryPlayers/' + playerId + '/Details');
}