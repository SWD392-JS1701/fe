export const formatVND = (amount: number): string => {
  // Convert to VND (multiply by 1000)
  const vndAmount = amount * 1000;
  
  // Format with thousands separator
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(vndAmount);
};

export const formatVNDWithoutSymbol = (amount: number): string => {
  // Convert to VND (multiply by 1000)
  const vndAmount = amount * 1000;
  
  // Format with thousands separator but without currency symbol
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(vndAmount);
}; 