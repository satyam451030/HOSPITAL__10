import bcrypt  from "bcryptjs";

export const  authHassedPassword = (password) => {
    const passwordHassed = bcrypt.hashSync(password,8);
    return passwordHassed;
};
export const  comparePassword = (password,user) => {
    const PasswordCompare = bcrypt.compareSync(password,user.password);
    return PasswordCompare;
};