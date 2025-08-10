import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  GestureResponderEvent,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Polyline,
  Line,
  Text as SvgText,
  G,
  Circle,
  Rect,
} from 'react-native-svg';
import { project, YearRow } from './project';
import DataTableCard from "./components/DataTableCard";

export default function App() {
  const [tableCollapsed, setTableCollapsed] = useState(false);
  const [plotColumns, setPlotColumns] = useState({
    endBalance: true,
    contribution: true,
    withdrawal: false,
    growth: false,
    startBalance: false,
  });

  const handleToggleColumn = (col: keyof typeof plotColumns) => {
    setPlotColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };
  const [initialAmount, setInitialAmount] = useState('10000');
  const [annualReturnRate, setAnnualReturnRate] = useState('7');
  const [annualContribution, setAnnualContribution] = useState('0');
  const [withdrawStartYear, setWithdrawStartYear] = useState('0');
  const [withdrawType, setWithdrawType] = useState<'percent' | 'amount'>('percent');
  const [withdrawPercent, setWithdrawPercent] = useState('4');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [rows, setRows] = useState<YearRow[]>([]);

  React.useEffect(() => {
    if (rows.length > 0) setTableCollapsed(false);
  }, [rows.length]);

  const handleCalculate = () => {
    const results = project(
      Number(initialAmount) || 0,
      Number(annualReturnRate) || 0,
      Number(annualContribution) || 0,
      parseInt(withdrawStartYear, 10) || 0,
      withdrawType === 'percent' ? Number(withdrawPercent) || 0 : 0,
      withdrawType === 'amount' ? Number(withdrawAmount) || 0 : undefined
    );
    setRows(results);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Fire Calculator</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Initial Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Initial Amount"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          value={initialAmount}
          onChangeText={setInitialAmount}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Annual Return Rate (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Annual Return Rate (%)"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          value={annualReturnRate}
          onChangeText={setAnnualReturnRate}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Annual Contribution</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Annual Contribution"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          value={annualContribution}
          onChangeText={setAnnualContribution}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Withdraw Start Year</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Withdraw Start Year"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          value={withdrawStartYear}
          onChangeText={setWithdrawStartYear}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Withdraw Type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <TouchableOpacity
            style={[styles.toggleButton, withdrawType === 'percent' && styles.toggleButtonActive]}
            onPress={() => setWithdrawType('percent')}
          >
            <Text style={styles.toggleButtonText}>Percent (%)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, withdrawType === 'amount' && styles.toggleButtonActive]}
            onPress={() => setWithdrawType('amount')}
          >
            <Text style={styles.toggleButtonText}>Amount ($)</Text>
          </TouchableOpacity>
        </View>
        {withdrawType === 'percent' ? (
          <View>
            <Text style={styles.inputLabel}>Withdraw Percent (%)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Withdraw Percent (%)"
              placeholderTextColor="#888"
              keyboardAppearance="dark"
              value={withdrawPercent}
              onChangeText={setWithdrawPercent}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.inputLabel}>Withdraw Amount ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Withdraw Amount ($)"
              placeholderTextColor="#888"
              keyboardAppearance="dark"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
          </View>
        )}
      </View>

      {/* Section for choosing columns to plot */}
      <View style={styles.plotSection}>
        <Text style={styles.plotLabel}>Choose columns to plot:</Text>
        <View style={styles.plotOptions}>
          <TouchableOpacity style={styles.plotOption} onPress={() => handleToggleColumn('endBalance')}>
            <View style={[styles.checkbox, plotColumns.endBalance && styles.checkedBox]} />
            <Text style={styles.plotOptionText}>End Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plotOption} onPress={() => handleToggleColumn('contribution')}>
            <View style={[styles.checkbox, plotColumns.contribution && styles.checkedBox]} />
            <Text style={styles.plotOptionText}>Contribution</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plotOption} onPress={() => handleToggleColumn('withdrawal')}>
            <View style={[styles.checkbox, plotColumns.withdrawal && styles.checkedBox]} />
            <Text style={styles.plotOptionText}>Withdrawal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plotOption} onPress={() => handleToggleColumn('growth')}>
            <View style={[styles.checkbox, plotColumns.growth && styles.checkedBox]} />
            <Text style={styles.plotOptionText}>Growth</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plotOption} onPress={() => handleToggleColumn('startBalance')}>
            <View style={[styles.checkbox, plotColumns.startBalance && styles.checkedBox]} />
            <Text style={styles.plotOptionText}>Start Balance</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Project</Text>
      </TouchableOpacity>
      {rows.length > 0 && <Chart rows={rows} plotColumns={plotColumns} />}
      {rows.length > 0 && (
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={() => setTableCollapsed((prev) => !prev)}
        >
          <Text style={styles.collapseButtonText}>
            {tableCollapsed ? 'Show Data Table' : 'Hide Data Table'}
          </Text>
        </TouchableOpacity>
      )}
      {rows.length > 0 && !tableCollapsed && 
      //  <DataTableCard rows={rows} />
      (
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Year</Text>
            <Text style={styles.headerCell}>Start</Text>
            <Text style={styles.headerCell}>Contr</Text>
            <Text style={styles.headerCell}>Withdr</Text>
            <Text style={styles.headerCell}>Growth</Text>
            <Text style={styles.headerCell}>End</Text>
          </View>
          {rows.map((r) => (
            <View key={r.year} style={styles.row}>
              <Text style={styles.cell}>{r.year}</Text>
              <Text style={styles.cell}>{r.startBalance.toFixed(2)}</Text>
              <Text style={styles.cell}>{r.contribution.toFixed(2)}</Text>
              <Text style={styles.cell}>{r.withdrawal.toFixed(2)}</Text>
              <Text style={styles.cell}>{r.growth.toFixed(2)}</Text>
              <Text style={styles.cell}>{r.endBalance.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )
      }
      </ScrollView>
    </SafeAreaView>
  );
}

const Chart = ({ rows, plotColumns }: { rows: YearRow[]; plotColumns: Record<string, boolean> }) => {
  const { width: screenWidth } = useWindowDimensions();
  if (rows.length === 0) return null;
  const width = screenWidth - 40; // account for container padding
  const height = 200;
  const padding = { top: 40, right: 40, bottom: 40, left: 60 };
  const maxY = Math.max(
    ...rows.map((r) => Math.max(r.endBalance, r.contribution))
  );
  const maxYear = rows[rows.length - 1].year;

  const [hover, setHover] = useState<YearRow | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const xScale = (year: number) =>
    padding.left +
    (year / Math.max(maxYear, 1)) *
      (width - padding.left - padding.right);
  const yScale = (value: number) =>
    height - padding.bottom -
    (value / maxY) * (height - padding.top - padding.bottom);

  const pointsFor = (selector: (r: YearRow) => number) =>
    rows.map((r) => `${xScale(r.year)},${yScale(selector(r))}`).join(' ');

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = (maxY / 4) * i;
    return { value, y: yScale(value) };
  });

  const tickYears = Array.from(
    new Set([
      0,
      ...Array.from(
        { length: Math.floor(maxYear / 10) },
        (_, i) => (i + 1) * 10
      ),
      maxYear,
    ])
  );
  const xTicks = tickYears.map((year) => ({ year, x: xScale(year) }));

  const formatAmount = (n: number) =>
    Math.round(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Bar width and spacing
  const barWidth = Math.max(8, (width - padding.left - padding.right) / rows.length / 2);
  const barSpacing = ((width - padding.left - padding.right) / rows.length) - barWidth;

  // Define colors for each column
  const columnColors: Record<string, string> = {
    endBalance: '#00C805',
    contribution: '#555',
    withdrawal: '#FF9800',
    growth: '#2196F3',
    startBalance: '#9C27B0',
  };

  // List of columns to plot, in order
  const columnsToPlot = Object.keys(plotColumns).filter((col) => plotColumns[col]);

  // Map column name to YearRow property
  const getValue = (row: YearRow, col: string) => {
    switch (col) {
      case 'endBalance': return row.endBalance;
      case 'contribution': return row.contribution;
      case 'withdrawal': return row.withdrawal;
      case 'growth': return row.growth;
      case 'startBalance': return row.startBalance;
      default: return 0;
    }
  };

  // Render each column in a separate chart with its own y-axis scale
  return (
    <>
      {columnsToPlot.map((col) => {
        // Calculate max value for this column
        const maxColValue = Math.max(...rows.map((r) => getValue(r, col)));
        // Calculate yTicks for this column
        const colYTicks = Array.from({ length: 5 }, (_, i) => {
          // Round value to avoid floating point key collisions
          const value = Math.round((maxColValue / 4) * i * 100) / 100;
          return { value, y: height - padding.bottom - (value / maxColValue) * (height - padding.top - padding.bottom) };
        });
        // yScale for this column
        const colYScale = (value: number) =>
          height - padding.bottom - (value / maxColValue) * (height - padding.top - padding.bottom);

        return (
          <View key={`chart-${col}`} style={{ marginBottom: 24 }}>
            <Svg
              width={width}
              height={height}
              style={styles.chart}
            >
              {/* axes */}
              <Line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                stroke="#888"
              />
              <Line
                x1={padding.left}
                y1={height - padding.bottom}
                x2={width - padding.right}
                y2={height - padding.bottom}
                stroke="#888"
              />

              {/* y-axis ticks for this column */}
              {colYTicks.map((t, idx) => (
                <G key={`y-${col}-${t.value}-${idx}`}>
                  <Line
                    x1={padding.left - 5}
                    y1={t.y}
                    x2={padding.left}
                    y2={t.y}
                    stroke="#888"
                  />
                  <SvgText
                    x={padding.left - 8}
                    y={t.y}
                    fontSize="10"
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fill="#fff"
                  >
                    {formatAmount(t.value)}
                  </SvgText>
                </G>
              ))}

              {/* x-axis ticks */}
              {xTicks.map((t) => (
                <G key={`x-${t.year}`}>
                  <Line
                    x1={t.x}
                    y1={height - padding.bottom}
                    x2={t.x}
                    y2={height - padding.bottom + 5}
                    stroke="#888"
                  />
                  <SvgText
                    x={t.x}
                    y={height - padding.bottom + 15}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#fff"
                  >
                    {t.year}
                  </SvgText>
                </G>
              ))}

              {/* Bars for this column */}
              {rows.map((r, i) => (
                <Rect
                  key={`bar-${col}-${r.year}`}
                  x={xScale(r.year) - barWidth / 2}
                  y={colYScale(getValue(r, col))}
                  width={barWidth}
                  height={height - padding.bottom - colYScale(getValue(r, col))}
                  fill={columnColors[col]}
                  opacity={0.85}
                  stroke="#222"
                  strokeWidth={1}
                />
              ))}
            </Svg>
            {/* Legend for this chart */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 }}>
                <View style={{ width: 20, height: 8, backgroundColor: columnColors[col], marginRight: 6, borderRadius: 2 }} />
                <Text style={{ color: '#fff', fontSize: 12 }}>{col.charAt(0).toUpperCase() + col.slice(1)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  collapseButton: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  collapseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#222',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  toggleButtonActive: {
    backgroundColor: '#00C805',
    borderColor: '#00C805',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  plotSection: {
    marginBottom: 18,
  },
  plotLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  plotOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  plotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  plotOptionText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 3,
    backgroundColor: '#222',
    marginRight: 4,
  },
  checkedBox: {
    backgroundColor: '#00C805',
    borderColor: '#00C805',
  },
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#fff',
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 4,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00C805',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
  },
  chart: {
    marginTop: 20,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
  },
  cell: {
    flex: 1,
    color: '#fff',
  },
});
