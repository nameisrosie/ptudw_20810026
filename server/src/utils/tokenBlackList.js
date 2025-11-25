//blacklist luu token da bi thu hoi
const tokenBlackList = new Set();

//add token vao blacklist
const addTokenToBlackList = (token) => {
    tokenBlackList.add(token);
};
//Kiếm tra token
const isTokenBlackListed = (token) => {
    return tokenBlackList.has(token);
};

//xoa token khoi blacklist
const removeTokenFromBlackList = (token) => {
    tokenBlackList.delete(token);
}
module.exports = { addTokenToBlackList, isTokenBlackListed, removeTokenFromBlackList };
