import { slugify } from './slugify.util';

describe('slugify', () => {
  it('normalizes accents, spacing, and punctuation', () => {
    expect(slugify('  Mamão Papaia Especial!!  ')).toBe(
      'mamao-papaia-especial',
    );
  });

  it('collapses repeated separators', () => {
    expect(slugify('Tomate --- Cereja /// Premium')).toBe(
      'tomate-cereja-premium',
    );
  });

  it('returns an empty string when there is no slug content', () => {
    expect(slugify('@@@')).toBe('');
  });
});
