export function isNameValid(value: string): boolean {
  const words = value.split(' ');
  return words.length >= 2 && words.every((word) => word.length >= 3);
}

export function isPhoneValid(value: string): boolean {
  return /^\+[0-9]{9,}$/.test(value);
}

export function isAddressValid(value: string): boolean {
  const words = value.split(' ');
  return words.length >= 3 && words.every((word) => word.length >= 5);
}

export function isEmailValid(value: string): boolean {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
}

export function isCardValid(value: string): boolean {
  return /^[0-9]{16}$/.test(value);
}

export function isValidValid(value: string): boolean {
  return /^(0[1-9])|(1[0-2])\/[0-9]{2}$/.test(value);
}

export function isCvvValid(value: string): boolean {
  return /^[0-9]{3}$/.test(value);
}
