export const formatUSD = (value: string) => {
  const numbers = value.replaceAll(/\D/g, "");

  const number = Number(numbers) / 100;

  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};