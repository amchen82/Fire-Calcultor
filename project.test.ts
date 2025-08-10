import { project } from './project';

describe('project', () => {
  it('accumulates contributions before withdrawals', () => {
    const rows = project(1000, 10, 100, 2, 4);
    expect(rows[0]).toMatchObject({
      year: 0,
      startBalance: 1000,
      contribution: 100,
      withdrawal: 0,
      growth: 100,
      endBalance: 1200,
    });
    expect(rows[1]).toMatchObject({
      year: 1,
      startBalance: 1200,
      contribution: 100,
      withdrawal: 0,
      growth: 120,
      endBalance: 1420,
    });
  });

  it('handles immediate withdrawals', () => {
    const rows = project(1000, 0, 0, 0, 10);
    expect(rows[0]).toMatchObject({
      year: 0,
      startBalance: 1000,
      withdrawal: 100,
      endBalance: 900,
    });
  });

  it('handles negative return rates', () => {
    const rows = project(1000, -10, 0, 1, 0);
    expect(rows[0]).toMatchObject({
      growth: -100,
      endBalance: 900,
    });
  });

  it('stops when balance reaches zero', () => {
    const rows = project(1000, 5, 0, 0, 100);
    expect(rows).toHaveLength(1);
    expect(rows[0].endBalance).toBe(0);
  });
});
