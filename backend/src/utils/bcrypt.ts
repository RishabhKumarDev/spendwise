import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRound: number = 10) => {
  return bcrypt.hash(value, saltRound);
};

export const compareValue = async (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue);
};
