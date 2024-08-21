

export const getPlayerSkills = (playerId) =>{
    return http.get('/PlayerSkills/' + playerId);
}