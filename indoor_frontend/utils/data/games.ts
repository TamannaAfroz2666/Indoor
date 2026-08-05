export type GamePlayer = {
  name: string;
  initials: string;
  role?: "Host";
  color: string;
};

export type Game = {
  id: string;
  format: string;
  level: string;
  sport: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  distance: number;
  area: string;
  karma: number;
  capacity: number;
  equipment: string;
  message: string;
  booked?: boolean;
  players: GamePlayer[];
};

export const games: Game[] = [
  {
    id: "mixed-doubles-mirpur",
    format: "Mixed Doubles",
    level: "Regular",
    sport: "Badminton",
    title: "Mixed Doubles Badminton Activity",
    date: "Wednesday, 05 Aug 2026",
    time: "10:30 AM to 11:30 AM",
    venue: "FerroHub Sports, Mirpur",
    distance: 2.41,
    area: "Mirpur",
    karma: 101,
    capacity: 6,
    equipment: "Bring Your Own Equipment",
    message: "Friendly mixed doubles game. Please arrive 10 minutes early; shuttlecocks will be provided.",
    booked: true,
    players: [
      { name: "Thrisha", initials: "TH", role: "Host", color: "#f6a6b8" },
      { name: "Diejo Domison", initials: "DD", color: "#7ec8e3" },
      { name: "Jayanth V", initials: "JV", color: "#f3bf70" },
    ],
  },
  {
    id: "evening-doubles-banani",
    format: "Mixed Doubles",
    level: "Regular",
    sport: "Badminton",
    title: "Evening Mixed Doubles",
    date: "Wednesday, 05 Aug 2026",
    time: "6:00 PM to 7:00 PM",
    venue: "Wellness Sports Inc, Banani",
    distance: 0.46,
    area: "Banani",
    karma: 75,
    capacity: 4,
    equipment: "Rackets available at venue",
    message: "A relaxed after-work session. All regular players are welcome.",
    players: [
      { name: "Ruthra", initials: "RU", role: "Host", color: "#b5d8c5" },
    ],
  },
  {
    id: "weekend-doubles-uttara",
    format: "Mixed Doubles",
    level: "Regular",
    sport: "Badminton",
    title: "Weekend Badminton Social",
    date: "Saturday, 08 Aug 2026",
    time: "11:00 AM to 12:00 PM",
    venue: "Match Point Arena, Uttara",
    distance: 4.22,
    area: "Uttara",
    karma: 3556,
    capacity: 18,
    equipment: "Bring Your Own Equipment",
    message: "Social doubles with rotating partners. Two courts are reserved.",
    players: [
      { name: "BK", initials: "BK", role: "Host", color: "#d3c178" },
      { name: "Nabil", initials: "NA", color: "#8ac0d5" },
      { name: "Samiha", initials: "SA", color: "#d8a0c7" },
      { name: "Rafi", initials: "RA", color: "#90c68c" },
      { name: "Maliha", initials: "MA", color: "#f0a36e" },
      { name: "Tanim", initials: "TA", color: "#9eabd9" },
      { name: "Ayan", initials: "AY", color: "#e6c07b" },
      { name: "Nazia", initials: "NZ", color: "#7fb9a9" },
      { name: "Fahim", initials: "FA", color: "#cba0a0" },
      { name: "Jerin", initials: "JE", color: "#a2b6d4" },
    ],
  },
  {
    id: "doubles-bashundhara",
    format: "Doubles",
    level: "Regular",
    sport: "Badminton",
    title: "Doubles Challenge",
    date: "Sunday, 09 Aug 2026",
    time: "8:00 AM to 9:00 AM",
    venue: "Bashundhara Sports Arena",
    distance: 3.17,
    area: "Bashundhara",
    karma: 450,
    capacity: 4,
    equipment: "Bring Your Own Equipment",
    message: "One slot left. Intermediate and regular players preferred.",
    booked: true,
    players: [
      { name: "Sudarshana", initials: "SU", role: "Host", color: "#d3a08e" },
      { name: "Raisa", initials: "RS", color: "#8dbed8" },
      { name: "Fardin", initials: "FD", color: "#b9ca82" },
    ],
  },
  {
    id: "beginner-session-mohammadpur",
    format: "Doubles",
    level: "Beginner",
    sport: "Badminton",
    title: "Beginner Friendly Badminton",
    date: "Monday, 10 Aug 2026",
    time: "7:30 PM to 8:30 PM",
    venue: "Match Point, Mohammadpur",
    distance: 4.8,
    area: "Mohammadpur",
    karma: 288,
    capacity: 6,
    equipment: "Equipment can be rented",
    message: "New players are welcome. We will warm up and learn the rotation together.",
    players: [{ name: "Saumya", initials: "SM", role: "Host", color: "#b4a0d6" }],
  },
];

export function getGameById(gameId: string) {
  return games.find((game) => game.id === gameId);
}
