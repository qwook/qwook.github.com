const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const base = chars.length;

export function numCrush(num) {
  let result = "";
  while (num > 0) {
    result = chars[num % base] + result;
    num = Math.floor(num / base);
  }
  return result || "0";
}

export function numDecrush(str) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result * base + chars.indexOf(str[i]);
  }
  return result;
}
