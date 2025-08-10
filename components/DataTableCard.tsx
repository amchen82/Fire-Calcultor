import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Platform } from "react-native";

type Row = {
  year: number;
  startBalance: number;
  contribution: number;
  withdrawal: number;
  growth: number;
  endBalance: number;
};

export default function DataTableCard({ rows }: { rows: Row[] }) {
  const nf = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const num = (n: number) => nf.format(n);

  const Header = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.hCell, styles.left]}>Year</Text>
      <Text style={styles.hCell}>Start</Text>
      <Text style={styles.hCell}>Contrib</Text>
      <Text style={styles.hCell}>Withdr</Text>
      <Text style={styles.hCell}>Growth</Text>
      <Text style={styles.hCell}>End</Text>
    </View>
  );

  const Item = ({ item, index }: { item: Row; index: number }) => (
    <View style={[styles.row, index % 2 ? styles.altRow : null]}>
      <Text style={[styles.cell, styles.left]}>{item.year}</Text>
      <Text style={styles.cell}>{num(item.startBalance)}</Text>
      <Text style={styles.cell}>{num(item.contribution)}</Text>
      <Text style={styles.cell}>{num(item.withdrawal)}</Text>
      <Text style={styles.cell}>{num(item.growth)}</Text>
      <Text style={[styles.cell, styles.bold]}>{num(item.endBalance)}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Horizontal scroll if screen is narrow */}
      <ScrollView horizontal bounces showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: 560 }}>
          <Header />
          <FlatList
            data={rows}
            keyExtractor={(r) => String(r.year)}
            renderItem={Item}
            scrollEnabled={false} // table scrolls with page; set true if you want its own scroll
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: "#141414",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2a2a",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: "#1f1f1f",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a2a2a",
  },
  altRow: { backgroundColor: "#151515" },
  hCell: {
    flex: 1,
    color: "#cfcfcf",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "right",
    fontVariant: ["tabular-nums"], // monospaced numerals
  },
  cell: {
    flex: 1,
    color: "#eee",
    fontSize: 13,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  left: { textAlign: "left", width: 64, flex: 0 },
  bold: { fontWeight: "600" },
});
