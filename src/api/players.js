import http from '../utils/request';

export const getOnlinePlayers = () =>{
    return http.get('/OnlinePlayers');
}

/**
 * 分页获取历史玩家
 * @returns
 */
export const getHistoryPlayers = (params) => {
    return http.get('/HistoryPlayers', { params: params });
};

