export default function dbInit() {
    return `PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_time TEXT, end_time TEXT);`
}