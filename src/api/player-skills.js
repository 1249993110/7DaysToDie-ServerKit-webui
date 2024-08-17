import http from '../utils/request';

export const getPlayerSkills = (playerId) =>{
    return http.get('/PlayerSkills/' + playerId);
}