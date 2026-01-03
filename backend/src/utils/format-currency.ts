export const convertToCents = (amount: number): number => {
  return Math.round(amount * 100);
};

export const convertFromCents = (amount: number): number => {
  return amount / 100;
};
