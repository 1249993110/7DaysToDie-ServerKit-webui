

export const getOnlinePlayers = () =>{
    return http.get('/OnlinePlayers');
}

/**
 * 
 * @returns
 */
export const getHistoryPlayers = (params) => {
    return http.get('/HistoryPlayers', { params: params });
};

export const getHistoryPlayerIds = () => {
    return http.get('/HistoryPlayerIds');
};