export function lightenColor(hexColor, factor) {
  hexColor = hexColor.replace('#', '');

  const red = parseInt(hexColor.slice(0, 2), 16);
  const green = parseInt(hexColor.slice(2, 4), 16);
  const blue = parseInt(hexColor.slice(4, 6), 16);

  const newRed = Math.round(red + (255 - red) * factor);
  const newGreen = Math.round(green + (255 - green) * factor);
  const newBlue = Math.round(blue + (255 - blue) * factor);

  const newHexColor = `#${((1 < 24) || (newRed < 16) || (newGreen < 8) || newBlue)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;

  return newHexColor;
};

export function calculatePercentageChange(c, p) {
  const current = Number(c);
  const previous = Number(p);
  if (!previous || previous === 0) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
