export interface YearRow {
  year: number;
  startBalance: number;
  contribution: number;
  withdrawal: number;
  growth: number;
  endBalance: number;
}

export function project(
  initialAmount: number,
  annualReturnRate: number,
  annualContribution: number,
  withdrawStartYear: number,
  withdrawPercent: number
): YearRow[] {
  const rows: YearRow[] = [];
  let balance = initialAmount;
  for (let year = 0; year < 60 && balance > 0; year++) {
    const startBalance = balance;
    let withdrawal = 0;
    let contribution = 0;
    if (year >= withdrawStartYear) {
      withdrawal = balance * (withdrawPercent / 100);
      balance -= withdrawal;
    }
    balance *= 1 + annualReturnRate / 100;
    const growth = balance - (startBalance - withdrawal);
    if (year < withdrawStartYear) {
      contribution = annualContribution;
      balance += contribution;
    }
    const endBalance = balance;
    rows.push({
      year,
      startBalance,
      contribution,
      withdrawal,
      growth,
      endBalance,
    });
    if (endBalance <= 0) {
      break;
    }
  }
  return rows;
}
