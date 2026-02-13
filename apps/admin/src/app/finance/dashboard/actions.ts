import { createClient } from '@/lib/supabase/server';

export async function getCashFlowData(year: number) {
  const supabase = await createClient();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const { data: lines, error } = await supabase
    .from('ledger_lines')
    .select(`
            debit,
            credit,
            chart_of_accounts!inner (
                type
            ),
            ledger_entries!inner (
                transaction_date
            )
        `)
    .gte('ledger_entries.transaction_date', startDate)
    .lte('ledger_entries.transaction_date', endDate);

  if (error) {
    return [];
  }

  // Group by month
  const monthlyData: Record<string, { revenue: number; expenses: number }> = {};
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  lines.forEach((line: any) => {
    const date = new Date(line.ledger_entries.transaction_date);
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    // Explicitly check for undefined to satisfy TS (though getMonth() is 0-11)
    if (month && !monthlyData[month]) {
      monthlyData[month] = { revenue: 0, expenses: 0 };
    }

    if (!month) return;

    const debit = Number(line.debit) || 0;
    const credit = Number(line.credit) || 0;
    const type = line.chart_of_accounts.type;

    // The if (!month) check above ensures month is defined, and the if (!monthlyData[month])
    // block ensures the entry exists. TS might not infer it across the closure/flow.
    const entry = monthlyData[month];
    if (entry) {
      if (type === 'revenue') {
        entry.revenue += credit - debit;
      } else if (type === 'expense') {
        entry.expenses += debit - credit;
      }
    }
  });

  return monthNames.map((month) => ({
    month,
    revenue: monthlyData[month]?.revenue || 0,
    expenses: monthlyData[month]?.expenses || 0,
  }));
}
