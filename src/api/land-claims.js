

/**
 * 获取所有领地石
 * @returns
 */
export const getLandClaims = () => {
    return http.get('/LandClaims');
};

/**
 * 获取指定玩家的领地石
 * @returns
 */
export const getLandClaimsByPlayerId = (playerId) => {
    return http.get('/LandClaims/' + playerId);
};
