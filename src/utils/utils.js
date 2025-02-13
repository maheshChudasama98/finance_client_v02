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

  // Convert the RGB values back to a hex color
  const newHexColor = `#${((1 << 24) | (newRed << 16) | (newGreen << 8) | newBlue)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;

  return newHexColor;
}
