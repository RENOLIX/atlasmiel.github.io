export function isMeaningfulOptionValue(value?: string) {
  return Boolean(value && value.trim() && value !== "Unique");
}

export function formatProductSelections(options: {
  size?: string;
  shoeSize?: string;
  color?: string;
}) {
  if (isMeaningfulOptionValue(options.size)) {
    return `Poids : ${options.size}`;
  }

  return "Poids non precise";
}
