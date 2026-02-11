export const toJettonAmount = (
  amount: number | string,
  decimals: number
): bigint => {
  const [whole, frac = ''] = String(amount).split('.');
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt(whole + fracPadded);
};

export const fromJettonAmount = (amount: bigint, decimals: number): string => {
  const s = amount.toString().padStart(decimals + 1, '0');
  const whole = s.slice(0, -decimals);
  const frac = s.slice(-decimals).replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : whole;
};
