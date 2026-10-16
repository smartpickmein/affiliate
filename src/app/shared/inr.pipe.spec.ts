import { InrPipe } from './inr.pipe';

describe('InrPipe', () => {
  const pipe = new InrPipe();

  it('formats a number as INR', () => {
    expect(pipe.transform(59999)).toContain('59,999');
  });

  it('returns a dash for null/undefined/NaN', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
    expect(pipe.transform(Number.NaN)).toBe('—');
  });
});
