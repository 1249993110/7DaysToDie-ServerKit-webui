

export const getPlayerSkills = (playerId, lang) =>{
    return http.get('/PlayerSkills/' + playerId, { params: { language: lang } });
}