import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

import Svg, { Polyline } from 'react-native-svg';

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
  const padding = 20;
  const maxY = Math.max(
    ...rows.map((r) => Math.max(r.endBalance, r.contribution))
  );
  const pointsFor = (selector: (r: YearRow) => number) =>
    rows
      .map((r, i) => {
        const x =
          padding + (i / Math.max(rows.length - 1, 1)) * (width - padding * 2);
        const y =
          height -
          padding -
          (selector(r) / maxY) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  const endPoints = pointsFor((r) => r.endBalance);
  const contrPoints = pointsFor((r) => r.contribution);
  return (
    <Svg width={width} height={height} style={styles.chart}>
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
