export function getRandomColor(opacity: number): string {
  // Ensure opacity is within a valid range
  opacity = Math.max(0, Math.min(1, opacity));

  const getRandomValue = () => Math.floor(Math.random() * 256); // 256 for inclusive 0–255
  const r = getRandomValue();
  const g = getRandomValue();
  const b = getRandomValue();

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function getRandomHexColor(): string {
  const getRandomValue = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  const r = getRandomValue();
  const g = getRandomValue();
  const b = getRandomValue();

  return `#${r}${g}${b}`;
}
