export type TransactionKind = "Sale" | "Expense" | "Cash in" | "Cash out";
export type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  kind: TransactionKind;
  date: string;
  channel: string;
};

export type Merchant = {
  id: number;
  name: string;
  category: string;
  county: string;
  city: string;
  lat: number;
  lng: number;
  active: boolean;
  lastSeen: string;
};

const today = new Date();
const day = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
};

export const initialTransactions: Transaction[] = [
  { id: "mw-01", description: "Daily market sales", category: "Sales", amount: 8450, kind: "Sale", date: day(0), channel: "Cash" },
  { id: "mw-02", description: "Orange Money received", category: "Mobile money", amount: 3250, kind: "Cash in", date: day(0), channel: "Orange Money" },
  { id: "mw-03", description: "Wholesale rice & flour", category: "Inventory", amount: 4120, kind: "Expense", date: day(0), channel: "Cash" },
  { id: "mw-04", description: "Shop rent contribution", category: "Rent", amount: 1800, kind: "Expense", date: day(1), channel: "Cash" },
  { id: "mw-05", description: "Weekend produce sales", category: "Sales", amount: 12600, kind: "Sale", date: day(1), channel: "Cash" },
  { id: "mw-06", description: "Float top-up", category: "Mobile money", amount: 5000, kind: "Cash in", date: day(2), channel: "Orange Money" },
  { id: "mw-07", description: "Transport to Duala market", category: "Transport", amount: 650, kind: "Expense", date: day(2), channel: "Cash" },
  { id: "mw-08", description: "Fresh produce sales", category: "Sales", amount: 7200, kind: "Sale", date: day(3), channel: "Cash" },
  { id: "mw-09", description: "Family cash withdrawal", category: "Personal", amount: 1400, kind: "Cash out", date: day(3), channel: "Cash" },
  { id: "mw-10", description: "Bottled water delivery", category: "Inventory", amount: 2875, kind: "Expense", date: day(4), channel: "Cash" },
  { id: "mw-11", description: "Shop sales", category: "Sales", amount: 9850, kind: "Sale", date: day(5), channel: "Cash" },
  { id: "mw-12", description: "Mobile money cash-out", category: "Mobile money", amount: 2200, kind: "Cash out", date: day(6), channel: "Orange Money" },
  { id: "mw-13", description: "Market-day sales", category: "Sales", amount: 11300, kind: "Sale", date: day(7), channel: "Cash" },
  { id: "mw-14", description: "Soap and cooking oil stock", category: "Inventory", amount: 3900, kind: "Expense", date: day(8), channel: "Cash" },
  { id: "mw-15", description: "New week opening float", category: "Mobile money", amount: 2500, kind: "Cash in", date: day(9), channel: "Orange Money" },
  { id: "mw-16", description: "Community shop sales", category: "Sales", amount: 7800, kind: "Sale", date: day(10), channel: "Cash" },
];

const towns: [string, string, number, number][] = [
  ["Montserrado", "Monrovia", 6.3004, -10.7969],
  ["Montserrado", "Paynesville", 6.2806, -10.7044],
  ["Bong", "Gbarnga", 6.9954, -9.4712],
  ["Nimba", "Sanniquellie", 7.3622, -8.7133],
  ["Margibi", "Kakata", 6.531, -10.3508],
  ["Grand Bassa", "Buchanan", 5.8808, -10.0467],
  ["Lofa", "Voinjama", 8.4219, -9.7474],
  ["Grand Cape Mount", "Robertsport", 6.7533, -11.3671],
  ["Sinoe", "Greenville", 5.0111, -9.0388],
  ["Maryland", "Harper", 4.3782, -7.7168],
  ["Grand Gedeh", "Zwedru", 6.0685, -8.1356],
  ["River Gee", "Fish Town", 5.1974, -7.8752],
  ["Rivercess", "Cestos City", 5.456, -9.5817],
  ["Grand Kru", "Barclayville", 4.6744, -8.2331],
  ["Gbarpolu", "Bopolu", 7.0667, -10.4875],
];
const merchantTypes = ["Grocery & provisions", "Market produce", "Tailoring", "Food & refreshments", "Mobile money", "Pharmacy", "Household goods", "Bakery"];
const merchantNames = ["Kollie", "Massaquoi", "Johnson", "Koroma", "Sherman", "Kamara", "Doe", "Saye", "Dolo", "Williams", "Flomo", "Tamba"];

export const merchants: Merchant[] = Array.from({ length: 160 }, (_, index) => {
  const [county, city, lat, lng] = towns[index % towns.length]!;
  const seed = index + 1;
  const latOffset = ((seed * 37) % 31 - 15) * 0.006;
  const lngOffset = ((seed * 23) % 37 - 18) * 0.007;
  const active = index < 126;
  return {
    id: seed,
    name: `${merchantNames[index % merchantNames.length]} ${merchantTypes[(index * 3) % merchantTypes.length].split(" ")[0]} ${String(seed).padStart(3, "0")}`,
    category: merchantTypes[(index * 3) % merchantTypes.length]!,
    county,
    city,
    lat: lat + latOffset,
    lng: lng + lngOffset,
    active,
    lastSeen: active ? `${(index % 8) + 1} min ago` : `${(index % 6) + 2} days ago`,
  };
});

export const counties = towns.map(([county, city, lat, lng]) => ({
  county: county as string,
  city: city as string,
  lat: lat as number,
  lng: lng as number,
}));
