export const DEFAULT_FOODS = [
  {
    name: "Chicken Breast",
    servingSize: "100g",
    protein: 31,
    carbs: 0,
    fat: 3.6,
    calories: 165
  },
  {
    name: "Brown Rice",
    servingSize: "100g (cooked)",
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    calories: 111
  },
  {
    name: "Broccoli",
    servingSize: "100g (raw)",
    protein: 2.8,
    carbs: 6.6,
    fat: 0.3,
    calories: 55
  },
  {
    name: "Avocado",
    servingSize: "100g",
    protein: 2,
    carbs: 9,
    fat: 15,
    calories: 160
  },
  {
    name: "Salmon",
    servingSize: "100g",
    protein: 20,
    carbs: 0,
    fat: 13,
    calories: 208
  }
];



export const DEFAULT_EXERCISES = [
  { id: 1, name: "Push-Up" },
  { id: 2, name: "Pull-Up" },
  { id: 3, name: "Chin-Up" },
  { id: 4, name: "Dips" },
  { id: 5, name: "Bench Press" },
  { id: 6, name: "Incline Bench Press" },
  { id: 7, name: "Decline Bench Press" },
  { id: 8, name: "Overhead Press" },
  { id: 9, name: "Arnold Press" },
  { id: 10, name: "Military Press" },
  { id: 11, name: "Dumbbell Shoulder Press" },
  { id: 12, name: "Lateral Raise" },
  { id: 13, name: "Front Raise" },
  { id: 14, name: "Rear Delt Fly" },
  { id: 15, name: "Chest Fly" },
  { id: 16, name: "Cable Crossover" },
  { id: 17, name: "Pec Deck Machine" },
  { id: 18, name: "Dumbbell Pullover" },
  { id: 19, name: "Barbell Curl" },
  { id: 20, name: "Dumbbell Curl" },
  { id: 21, name: "Hammer Curl" },
  { id: 22, name: "Zottman Curl" },
  { id: 23, name: "Concentration Curl" },
  { id: 24, name: "Preacher Curl" },
  { id: 25, name: "Incline Dumbbell Curl" },
  { id: 26, name: "Tricep Kickback" },
  { id: 27, name: "Overhead Tricep Extension" },
  { id: 28, name: "Skull Crusher" },
  { id: 29, name: "Close-Grip Bench Press" },
  { id: 30, name: "Cable Tricep Pushdown" },
  { id: 31, name: "Face Pull" },
  { id: 32, name: "Shrug" },
  { id: 33, name: "Upright Row" },
  { id: 34, name: "Bent-Over Row" },
  { id: 35, name: "Barbell Row" },
  { id: 36, name: "Dumbbell Row" },
  { id: 37, name: "T-Bar Row" },
  { id: 38, name: "Pendlay Row" },
  { id: 39, name: "Seal Row" },
  { id: 40, name: "Lat Pulldown" },
  { id: 41, name: "Pull-Over Machine" },
  { id: 42, name: "Squat" },
  { id: 43, name: "Front Squat" },
  { id: 44, name: "Goblet Squat" },
  { id: 45, name: "Overhead Squat" },
  { id: 46, name: "Sumo Squat" },
  { id: 47, name: "Box Squat" },
  { id: 48, name: "Hack Squat" },
  { id: 49, name: "Smith Machine Squat" },
  { id: 50, name: "Deadlift" },
  { id: 51, name: "Romanian Deadlift" },
  { id: 52, name: "Sumo Deadlift" },
  { id: 53, name: "Deficit Deadlift" },
  { id: 54, name: "Rack Pull" },
  { id: 55, name: "Block Pull" },
  { id: 56, name: "Trap Bar Deadlift" },
  { id: 57, name: "Good Morning" },
  { id: 58, name: "Hip Thrust" },
  { id: 59, name: "Glute Bridge" },
  { id: 60, name: "Step-Up" },
  { id: 61, name: "Walking Lunge" },
  { id: 62, name: "Stationary Lunge" },
  { id: 63, name: "Bulgarian Split Squat" },
  { id: 64, name: "Curtsy Lunge" },
  { id: 65, name: "Side Lunge" },
  { id: 66, name: "Leg Press" },
  { id: 67, name: "Leg Extension" },
  { id: 68, name: "Leg Curl" },
  { id: 69, name: "Standing Calf Raise" },
  { id: 70, name: "Seated Calf Raise" },
  { id: 71, name: "Donkey Calf Raise" },
  { id: 72, name: "Glute Kickback" },
  { id: 73, name: "Fire Hydrant" },
  { id: 74, name: "Cable Pull-Through" },
  { id: 75, name: "Reverse Hyperextension" },
  { id: 76, name: "Farmer’s Carry" },
  { id: 77, name: "Suitcase Carry" },
  { id: 78, name: "Overhead Carry" },
  { id: 79, name: "Yoke Walk" },
  { id: 80, name: "Front Rack Carry" },
  { id: 81, name: "Zercher Squat" },
  { id: 82, name: "Jefferson Squat" },
  { id: 83, name: "Sissy Squat" },
  { id: 84, name: "Hack Lift" },
  { id: 85, name: "Jefferson Deadlift" },
  { id: 86, name: "Clean" },
  { id: 87, name: "Clean and Jerk" },
  { id: 88, name: "Snatch" },
  { id: 89, name: "Power Clean" },
  { id: 90, name: "Push Press" },
  { id: 91, name: "Split Jerk" },
  { id: 92, name: "Thruster" },
  { id: 93, name: "Turkish Get-Up" },
  { id: 94, name: "Windmill" },
  { id: 95, name: "Overhead Lunge" },
  { id: 96, name: "Weighted Pull-Up" },
  { id: 97, name: "Weighted Dip" }
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


      CREATE TABLE IF NOT EXISTS weight (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        body_weight REAL,
        unit_of_measure TEXT,
        date TEXT
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
      SELECT w.id, w.start_time, w.end_time, s.weight, s.reps, s.exercise_id, e.name, w.name AS wName 
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

export function getExercisePB(exerciseid) {
  return `
  SELECT weight, exercise_id 
  FROM sets 
  WHERE exercise_id = ${exerciseid} 
  ORDER BY weight 
  DESC LIMIT 1;
  `
}

// export function getExercisePBbyName(exerciseName) {
//   return `
//   SELECT weight, exercise_id 
//   FROM sets 
//   WHERE exercise_id = ${exerciseid} 
//   ORDER BY weight 
//   DESC LIMIT 1;
//   `
// }

export function getExerciseIdByName(name) {
  return `
  SELECT id
  FROM exercises
  WHERE name = '${name}';
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