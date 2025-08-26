export default function dbInit() {
    return `PRAGMA journal_mode = WAL;

      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        start_time TEXT,
        end_time TEXT
        );
      
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
        );

      CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reps INTEGER,
        weight INTEGER,
        exercise_id INTEGER,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );

      CREATE TABLE IF NOT EXISTS workout_exercises (
        workout_id INTEGER NOT NULL,
        exercise_id INTEGER NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id),
        FOREIGN KEY (exercise_id) REFERENCES exercises(id),
        PRIMARY KEY (workout_id, exercise_id)
    );  
    
      `
}

export function exercisesInitInsert() {
    return `
        INSERT INTO exercises (name) VALUES (?)',
        ['Squat', 'Bench', 'Deadlift'];
    `
}



// CREATE TABLE IF NOT EXISTS WorkoutExercises (
    //     workout_id INTEGE
    //     exercise_id INTEGER,
    //     PRIMARY KEY (workout_id, exercise_id),
    //     FOREIGN KEY (workout_id) REFERENCES workouts(id),
    //     FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    // );