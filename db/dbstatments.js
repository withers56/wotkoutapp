export const DEFAULT_EXERCISES = [
  { name: "Push-Up" },
  { name: "Pull-Up" },
  { name: "Chin-Up" },
  { name: "Dips" },
  { name: "Bench Press" },
  { name: "Incline Bench Press" },
  { name: "Decline Bench Press" },
  { name: "Overhead Press" },
  { name: "Arnold Press" },
  { name: "Military Press" },
  { name: "Dumbbell Shoulder Press" },
  { name: "Lateral Raise" },
  { name: "Front Raise" },
  { name: "Rear Delt Fly" },
  { name: "Chest Fly" },
  { name: "Cable Crossover" },
  { name: "Pec Deck Machine" },
  { name: "Dumbbell Pullover" },
  { name: "Barbell Curl" },
  { name: "Dumbbell Curl" },
  { name: "Hammer Curl" },
  { name: "Zottman Curl" },
  { name: "Concentration Curl" },
  { name: "Preacher Curl" },
  { name: "Incline Dumbbell Curl" },
  { name: "Tricep Kickback" },
  { name: "Overhead Tricep Extension" },
  { name: "Skull Crusher" },
  { name: "Close-Grip Bench Press" },
  { name: "Cable Tricep Pushdown" },
  { name: "Face Pull" },
  { name: "Shrug" },
  { name: "Upright Row" },
  { name: "Bent-Over Row" },
  { name: "Barbell Row" },
  { name: "Dumbbell Row" },
  { name: "T-Bar Row" },
  { name: "Pendlay Row" },
  { name: "Seal Row" },
  { name: "Lat Pulldown" },
  { name: "Pull-Over Machine" },
  { name: "Squat" },
  { name: "Front Squat" },
  { name: "Goblet Squat" },
  { name: "Overhead Squat" },
  { name: "Sumo Squat" },
  { name: "Box Squat" },
  { name: "Hack Squat" },
  { name: "Smith Machine Squat" },
  { name: "Deadlift" },
  { name: "Romanian Deadlift" },
  { name: "Sumo Deadlift" },
  { name: "Deficit Deadlift" },
  { name: "Rack Pull" },
  { name: "Block Pull" },
  { name: "Trap Bar Deadlift" },
  { name: "Good Morning" },
  { name: "Hip Thrust" },
  { name: "Glute Bridge" },
  { name: "Step-Up" },
  { name: "Walking Lunge" },
  { name: "Stationary Lunge" },
  { name: "Bulgarian Split Squat" },
  { name: "Curtsy Lunge" },
  { name: "Side Lunge" },
  { name: "Leg Press" },
  { name: "Leg Extension" },
  { name: "Leg Curl" },
  { name: "Standing Calf Raise" },
  { name: "Seated Calf Raise" },
  { name: "Donkey Calf Raise" },
  { name: "Glute Kickback" },
  { name: "Fire Hydrant" },
  { name: "Cable Pull-Through" },
  { name: "Reverse Hyperextension" },
  { name: "Farmer’s Carry" },
  { name: "Suitcase Carry" },
  { name: "Overhead Carry" },
  { name: "Yoke Walk" },
  { name: "Front Rack Carry" },
  { name: "Zercher Squat" },
  { name: "Jefferson Squat" },
  { name: "Sissy Squat" },
  { name: "Hack Lift" },
  { name: "Jefferson Deadlift" },
  { name: "Clean" },
  { name: "Clean and Jerk" },
  { name: "Snatch" },
  { name: "Power Clean" },
  { name: "Push Press" },
  { name: "Split Jerk" },
  { name: "Thruster" },
  { name: "Turkish Get-Up" },
  { name: "Windmill" },
  { name: "Overhead Lunge" },
  { name: "Weighted Pull-Up" },
  { name: "Weighted Dip" }
  ]

export default function dbInit() {
    return `

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
        workout_id INTEGER,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
        );

    
    
      `
}

export function exercisesInitInsert() {
    return `
        INSERT INTO exercises (name) VALUES (?)',
        ['Squat', 'Bench', 'Deadlift'];
    `
}

export function getWorkoutInfoById(id) {
  return `
      SELECT w.id, w.start_time, w.end_time, s.weight, s.reps, e.name 
      FROM workouts AS w 
      LEFT OUTER JOIN sets AS s ON w.id = s.workout_id 
      LEFT OUTER JOIN exercises AS e ON s.exercise_id = e.id
      WHERE w.id = ${id};
  `
}

export function getAllWorkoutInfo() {
  return `
      SELECT w.id, w.start_time, s.weight, s.reps, e.name AS ename, w.name AS wname 
      FROM workouts AS w 
      LEFT OUTER JOIN sets AS s ON w.id = s.workout_id 
      LEFT OUTER JOIN exercises AS e ON s.exercise_id = e.id;
  `
}



// CREATE TABLE IF NOT EXISTS WorkoutExercises (
    //     workout_id INTEGE
    //     exercise_id INTEGER,
    //     PRIMARY KEY (workout_id, exercise_id),
    //     FOREIGN KEY (workout_id) REFERENCES workouts(id),
    //     FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    // );

    //   CREATE TABLE IF NOT EXISTS workout_sets (
    //     workout_id INTEGER NOT NULL,
    //     set_id INTEGER NOT NULL,
    //     FOREIGN KEY (workout_id) REFERENCES workouts(id),
    //     FOREIGN KEY (set_id) REFERENCES sets(id),
    //     PRIMARY KEY (workout_id, set_id)
    // );  