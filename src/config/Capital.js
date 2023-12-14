export const capitalizeText = (text) => {
  return text.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const numberAddress = (number) => {
  return number.length < 2 ? `0${number}` : number;
}