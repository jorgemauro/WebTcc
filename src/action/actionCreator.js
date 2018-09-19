export const login = (user) => {
    return {user, type: 'LOGIN'}
};
export const getId = (user)=>{
  return{userId:user.uid,type: 'getId'}
};
export const logout = () => {return {type:'LOGOUT'}};