export function lightenColor(hexColor, factor) {
  // Remove '#' if present
  hexColor = hexColor.replace('#', '');

  // Parse the color into RGB components
  const red = parseInt(hexColor.slice(0, 2), 16);
  const green = parseInt(hexColor.slice(2, 4), 16);
  const blue = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the new RGB values by blending towards white
  const newRed = Math.round(red + (255 - red) * factor);
  const newGreen = Math.round(green + (255 - green) * factor);
  const newBlue = Math.round(blue + (255 - blue) * factor);

  // Convert RGB values back to HEX
  const newHexColor = `#${[newRed, newGreen, newBlue]
    .map((val) => val.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

  return newHexColor;
}

export function calculatePercentageChange(c, p) {
  const current = Number(c);
  const previous = Number(p);
  if (!previous || previous === 0) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
