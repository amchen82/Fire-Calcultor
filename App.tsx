import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import Svg, { Polyline, Line, Text as SvgText, G } from 'react-native-svg';
import { project, YearRow } from './project';

export default function App() {
  const [initialAmount, setInitialAmount] = useState('10000');
  const [annualReturnRate, setAnnualReturnRate] = useState('7');
  const [annualContribution, setAnnualContribution] = useState('0');
  const [withdrawStartYear, setWithdrawStartYear] = useState('0');
  const [withdrawPercent, setWithdrawPercent] = useState('4');
  const [rows, setRows] = useState<YearRow[]>([]);

  const handleCalculate = () => {
    const results = project(
      Number(initialAmount) || 0,
      Number(annualReturnRate) || 0,
      Number(annualContribution) || 0,
      parseInt(withdrawStartYear, 10) || 0,
      Number(withdrawPercent) || 0
    );
    setRows(results);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fire Calculator</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Initial Amount"
        value={initialAmount}
        onChangeText={setInitialAmount}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Annual Return Rate (%)"
        value={annualReturnRate}
        onChangeText={setAnnualReturnRate}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Annual Contribution"
        value={annualContribution}
        onChangeText={setAnnualContribution}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Withdraw Start Year"
        value={withdrawStartYear}
        onChangeText={setWithdrawStartYear}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Withdraw Percent (%)"
        value={withdrawPercent}
        onChangeText={setWithdrawPercent}
      />
      <Button title="Project" onPress={handleCalculate} />
      {rows.length > 0 && (
        <>
          <Chart rows={rows} />
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
        </>
      )}
    </ScrollView>
  );
}

const Chart = ({ rows }: { rows: YearRow[] }) => {
  if (rows.length === 0) return null;
  const width = 300;
  const height = 200;
  const padding = 40;
  const maxY = Math.max(
    ...rows.map((r) => Math.max(r.endBalance, r.contribution))
  );
  const maxYear = rows[rows.length - 1].year;

  const xScale = (year: number) =>
    padding + (year / Math.max(maxYear, 1)) * (width - padding * 2);
  const yScale = (value: number) =>
    height - padding - (value / maxY) * (height - padding * 2);

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

  const endPoints = pointsFor((r) => r.endBalance);
  const contrPoints = pointsFor((r) => r.contribution);

  return (
    <Svg width={width} height={height} style={styles.chart}>
      {/* axes */}
      <Line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="black"
      />
      <Line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="black"
      />

      {/* y-axis ticks */}
      {yTicks.map((t) => (
        <G key={`y-${t.value}`}>
          <Line
            x1={padding - 5}
            y1={t.y}
            x2={padding}
            y2={t.y}
            stroke="black"
          />
          <SvgText
            x={padding - 8}
            y={t.y}
            fontSize="10"
            textAnchor="end"
            alignmentBaseline="middle"
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
            y1={height - padding}
            x2={t.x}
            y2={height - padding + 5}
            stroke="black"
          />
          <SvgText
            x={t.x}
            y={height - padding + 15}
            fontSize="10"
            textAnchor="middle"
          >
            {t.year}
          </SvgText>
        </G>
      ))}

      {/* legend */}
      <G>
        <Line
          x1={width - padding - 80}
          y1={padding}
          x2={width - padding - 60}
          y2={padding}
          stroke="blue"
          strokeWidth="2"
        />
        <SvgText
          x={width - padding - 50}
          y={padding + 4}
          fontSize="10"
        >
          End Balance
        </SvgText>
        <Line
          x1={width - padding - 80}
          y1={padding + 15}
          x2={width - padding - 60}
          y2={padding + 15}
          stroke="green"
          strokeWidth="2"
        />
        <SvgText
          x={width - padding - 50}
          y={padding + 19}
          fontSize="10"
        >
          Contribution
        </SvgText>
      </G>

      {/* data lines */}
      <Polyline
        points={endPoints}
        stroke="blue"
        strokeWidth="2"
        fill="none"
      />
      <Polyline
        points={contrPoints}
        stroke="green"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  table: {
    marginTop: 20,
  },
  chart: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
  },
});
