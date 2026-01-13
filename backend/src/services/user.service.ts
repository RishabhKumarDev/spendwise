import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/app-error";
import { UpdateUserType } from "../validators/user.validators";

export const findByIdUserSevrice = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

export const updateUserService = async (
  userId: string,
  body: UpdateUserType,
  profilePic: Express.Multer.File | undefined
) => {
  let user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (profilePic) {
    user.profilePicture = profilePic.path;
  }

  if (body.name) {
    user.set({
      name: body.name,
    });
  }

  await user.save();

  return user.omitPassword();
};
