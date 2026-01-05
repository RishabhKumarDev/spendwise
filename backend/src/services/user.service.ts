import UserModel from "../models/user.model";

export const findByIdUserSevrice = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};
