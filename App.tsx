import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  GestureResponderEvent,

  SafeAreaView,
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

    <SafeAreaView style={styles.safe}>
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
    </SafeAreaView>
  );
}

const Chart = ({ rows }: { rows: YearRow[] }) => {
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

  const endPoints = pointsFor((r) => r.endBalance);
  const contrPoints = pointsFor((r) => r.contribution);


  const handleTouch = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;
    const year = Math.round(
      ((x - padding.left) / (width - padding.left - padding.right)) * maxYear

    );
    if (year < 0 || year > maxYear) {
      setHover(null);
      setHoverX(null);
      return;
    }
    const row = rows.find((r) => r.year === year);
    if (row) {
      setHover(row);
      setHoverX(xScale(row.year));
    }
  };

  return (
    <Svg
      width={width}
      height={height}
      style={styles.chart}
      onStartShouldSetResponder={() => true}
      onResponderMove={handleTouch}
      onResponderGrant={handleTouch}
      onResponderRelease={() => {
        setHover(null);
        setHoverX(null);
      }}
    >

      {/* axes */}
      <Line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={height - padding.bottom}
        stroke="black"
      />
      <Line
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}

        stroke="black"
      />

      {/* y-axis ticks */}
      {yTicks.map((t) => (
        <G key={`y-${t.value}`}>
          <Line

            x1={padding.left - 5}
            y1={t.y}
            x2={padding.left}

            y2={t.y}
            stroke="black"
          />
          <SvgText

            x={padding.left - 8}

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

            y1={height - padding.bottom}
            x2={t.x}
            y2={height - padding.bottom + 5}

            stroke="black"
          />
          <SvgText
            x={t.x}

            y={height - padding.bottom + 15}

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

          x1={width - padding.right - 80}
          y1={padding.top}
          x2={width - padding.right - 60}
          y2={padding.top}

          stroke="blue"
          strokeWidth="2"
        />
        <SvgText

          x={width - padding.right - 50}
          y={padding.top + 4}

          fontSize="10"
        >
          End Balance
        </SvgText>
        <Line

          x1={width - padding.right - 80}
          y1={padding.top + 15}
          x2={width - padding.right - 60}
          y2={padding.top + 15}

          stroke="green"
          strokeWidth="2"
        />
        <SvgText

          x={width - padding.right - 50}
          y={padding.top + 19}

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

      {hover && hoverX !== null && (
        <G>
          <Line
            x1={hoverX}

            y1={padding.top}
            x2={hoverX}
            y2={height - padding.bottom}

            stroke="gray"
            strokeDasharray="4"
          />
          <Circle
            cx={hoverX}
            cy={yScale(hover.endBalance)}
            r={4}
            fill="blue"
          />
          <Rect
            x={hoverX + 5}
            y={yScale(hover.endBalance) - 30}
            width={100}
            height={30}
            fill="white"
            stroke="black"
          />
          <SvgText
            x={hoverX + 10}
            y={yScale(hover.endBalance) - 18}
            fontSize="10"
          >
            {`Year ${hover.year}`}
          </SvgText>
          <SvgText
            x={hoverX + 10}
            y={yScale(hover.endBalance) - 8}
            fontSize="10"
          >
            {`End ${formatAmount(hover.endBalance)}`}
          </SvgText>
        </G>
      )}

    </Svg>
  );
};

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingTop: 40,

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
    alignSelf: 'center',
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
