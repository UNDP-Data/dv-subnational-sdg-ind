export const getIndexGroup = (value?: number) => {
  if (value === undefined || value === null) return 'NA';
  if (value < 49.99) return 'Aspirant (0-49)';
  if (value < 64.99) return 'Performer (50-64)';
  if (value < 99.99) return 'Front Runner (65-99)';
  return 'Achiever (100)';
};
