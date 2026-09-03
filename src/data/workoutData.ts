export interface ExerciseDetail {
  num: number;
  name: string;
  tag: string;
  category: 'push' | 'pull' | 'legs-core' | 'daily';
  categoryLabel: string;
  image: string;
  primary: string;
  secondary: string;
  steps: string[];
  cue: string;
}

export interface DayExercise {
  num: number;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  target: string;
  exerciseId?: number;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  subtitle: string;
  focus: string;
  color: string;
  exercises: DayExercise[];
  techniqueTip?: string;
  isRest?: boolean;
  restActivities?: { activity: string; duration: string }[];
}

export interface NightRoutineItem {
  id: number;
  exercise: string;
  setsReps: string;
  frequency: string;
  purpose: string;
}

export interface ProgressionMethod {
  method: string;
  example: string;
}

export interface EffortGuideline {
  type: string;
  guideline: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: 'metric' | 'split' | 'biomechanics' | 'technique' | 'exercise';
}

export const WORKOUT_METADATA = {
  title: "6-Day PPL × 2 — 6 kg Dumbbells + Pull-Up Ledge",
  equipment: "2 × 6 kg dumbbells + pull-up ledge/bar + floor",
  duration: "~60 minutes",
  schedule: "6 training days + 1 rest day",
  strategy: "High reps, unilateral movements, 2–3s eccentric tempo, pauses, and controlled rest.",
};

export const WEEKLY_SCHEDULE: { day: string; workout: string; focus: string; id: string }[] = [
  { day: "Day 1", workout: "Push A", focus: "Chest + Shoulders + Triceps", id: "day-1" },
  { day: "Day 2", workout: "Pull A", focus: "Back + Biceps + Rear Delts + Grip", id: "day-2" },
  { day: "Day 3", workout: "Legs + Core A", focus: "Quads + Hamstrings + Glutes + Front Abs", id: "day-3" },
  { day: "Day 4", workout: "Push B", focus: "Chest + Shoulder Hypertrophy + Triceps", id: "day-4" },
  { day: "Day 5", workout: "Pull B", focus: "Back + Biceps + Rear Delts + Forearms", id: "day-5" },
  { day: "Day 6", workout: "Legs + Core B", focus: "Unilateral Legs + Glutes + Obliques + Deep Core + Neck", id: "day-6" },
  { day: "Day 7", workout: "Rest", focus: "Recovery, Walking & Stretching", id: "day-7" },
];

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: "day-1",
    dayNumber: 1,
    title: "Push A",
    subtitle: "Chest + Shoulders + Triceps",
    focus: "Horizontal Pressing & Shoulder Strength",
    color: "from-blue-600 to-indigo-700",
    exercises: [
      { num: 1, name: "Dumbbell Floor Press", sets: 3, reps: "12–20", rest: "75 sec", target: "Chest, triceps, front delts", exerciseId: 1 },
      { num: 2, name: "Close-Grip Dumbbell Press", sets: 3, reps: "12–20", rest: "60 sec", target: "Chest, triceps", exerciseId: 2 },
      { num: 3, name: "Dumbbell Shoulder Press", sets: 3, reps: "12–20", rest: "75 sec", target: "Front & side delts, triceps", exerciseId: 3 },
      { num: 4, name: "Dumbbell Lateral Raise", sets: 3, reps: "15–25", rest: "45 sec", target: "Side delts", exerciseId: 4 },
      { num: 5, name: "Push-Ups", sets: 2, reps: "12–25", rest: "60 sec", target: "Chest, shoulders, triceps", exerciseId: 5 },
      { num: 6, name: "Overhead Dumbbell Triceps Extension", sets: 2, reps: "12–20", rest: "60 sec", target: "Triceps (long head)", exerciseId: 6 },
      { num: 7, name: "Dumbbell Skull Crushers", sets: 2, reps: "12–20", rest: "60 sec", target: "Triceps", exerciseId: 7 },
    ],
    techniqueTip: "Use a 2–3 second lowering phase on floor press and shoulder press to maximize tension with 6 kg.",
  },
  {
    id: "day-2",
    dayNumber: 2,
    title: "Pull A",
    subtitle: "Back + Biceps + Rear Delts + Traps",
    focus: "Vertical Pulling, Back Thickness & Upper Traps",
    color: "from-emerald-600 to-teal-700",
    exercises: [
      { num: 1, name: "Pull-Ups", sets: 4, reps: "4–10", rest: "90–120 sec", target: "Lats, upper back, biceps", exerciseId: 12 },
      { num: 2, name: "Two-Arm Dumbbell Row", sets: 3, reps: "12–20", rest: "75 sec", target: "Lats, rhomboids, mid-back", exerciseId: 13 },
      { num: 3, name: "Dumbbell Pullover", sets: 2, reps: "15–20", rest: "60 sec", target: "Lats, serratus", exerciseId: 14 },
      { num: 4, name: "Bent-Over Rear Delt Fly", sets: 3, reps: "15–25", rest: "45 sec", target: "Rear delts, upper back", exerciseId: 15 },
      { num: 5, name: "Dumbbell Curls", sets: 3, reps: "12–20", rest: "60 sec", target: "Biceps", exerciseId: 16 },
      { num: 6, name: "Hammer Curls", sets: 2, reps: "12–20", rest: "60 sec", target: "Brachialis, forearms", exerciseId: 17 },
      { num: 7, name: "Dumbbell Shrugs", sets: 3, reps: "15–25", rest: "45–60 sec", target: "Upper traps, neck support", exerciseId: 43 },
      { num: 8, name: "Dumbbell Wide-Grip Upright Row", sets: 3, reps: "12–20", rest: "60 sec", target: "Side delts, upper traps, upper back", exerciseId: 44 },
    ],
    techniqueTip: "Pull-up Progression: If you can already do 10+ clean reps, use a slower descent (3 sec). For Upright Rows, keep grip wide and stop at mid-chest level.",
  },
  {
    id: "day-3",
    dayNumber: 3,
    title: "Legs + Core A",
    subtitle: "Quads + Hamstrings + Glutes + Front Abs",
    focus: "Bilateral Leg Power & Front Core",
    color: "from-amber-600 to-orange-700",
    exercises: [
      { num: 1, name: "Goblet Dumbbell Squat", sets: 3, reps: "15–25", rest: "75 sec", target: "Quads, glutes, core", exerciseId: 25 },
      { num: 2, name: "Dumbbell Romanian Deadlift", sets: 3, reps: "15–25", rest: "75 sec", target: "Hamstrings, glutes", exerciseId: 26 },
      { num: 3, name: "Dumbbell Reverse Lunges", sets: 3, reps: "12–15 / leg", rest: "60 sec", target: "Quads, glutes", exerciseId: 27 },
      { num: 4, name: "Standing Dumbbell Calf Raise", sets: 3, reps: "20–30", rest: "45 sec", target: "Calves", exerciseId: 28 },
      { num: 5, name: "Hanging Knee/Leg Raises", sets: 3, reps: "8–15", rest: "60 sec", target: "Lower abs", exerciseId: 29 },
      { num: 6, name: "Weighted Crunch", sets: 2, reps: "15–25", rest: "45 sec", target: "Rectus abdominis", exerciseId: 30 },
      { num: 7, name: "Plank", sets: 2, reps: "45–60 sec", rest: "45 sec", target: "Deep core", exerciseId: 31 },
    ],
    techniqueTip: "For squats and RDLs, use slow eccentrics + pauses at the bottom rather than simply rushing through reps.",
  },
  {
    id: "day-4",
    dayNumber: 4,
    title: "Push B",
    subtitle: "Chest + Shoulder Hypertrophy + Triceps",
    focus: "Unilateral Push & Shoulder Sculpting",
    color: "from-purple-600 to-indigo-800",
    exercises: [
      { num: 1, name: "Single-Arm Dumbbell Floor Press", sets: 3, reps: "12–20 / arm", rest: "60 sec", target: "Chest, triceps, core", exerciseId: 8 },
      { num: 2, name: "Dumbbell Floor Chest Fly", sets: 3, reps: "15–20", rest: "60 sec", target: "Chest", exerciseId: 9 },
      { num: 3, name: "Dumbbell Shoulder Press", sets: 2, reps: "15–20", rest: "60 sec", target: "Front & side delts", exerciseId: 3 },
      { num: 4, name: "Dumbbell Lateral Raise", sets: 3, reps: "15–25", rest: "45 sec", target: "Side delts", exerciseId: 4 },
      { num: 5, name: "Dumbbell Front Raise", sets: 3, reps: "12–18", rest: "45 sec", target: "Front delts, upper chest", exerciseId: 42 },
      { num: 6, name: "Incline Dumbbell Y-Raise", sets: 2, reps: "15–20", rest: "45 sec", target: "Upper back, scapular stabilizers", exerciseId: 10 },
      { num: 7, name: "Diamond Push-Ups", sets: 2, reps: "12–25", rest: "60 sec", target: "Triceps, chest", exerciseId: 11 },
      { num: 8, name: "Overhead Dumbbell Triceps Extension", sets: 2, reps: "15–20", rest: "60 sec", target: "Triceps", exerciseId: 6 },
    ],
  },
  {
    id: "day-5",
    dayNumber: 5,
    title: "Pull B",
    subtitle: "Back + Biceps + Rear Delts + Forearms",
    focus: "Underhand Grip, Unilateral Rows & Forearms",
    color: "from-cyan-600 to-blue-800",
    exercises: [
      { num: 1, name: "Chin-Ups", sets: 4, reps: "4–10", rest: "90–120 sec", target: "Lats, biceps", exerciseId: 18 },
      { num: 2, name: "Single-Arm Dumbbell Row", sets: 3, reps: "12–20 / arm", rest: "60 sec", target: "Lats, rhomboids", exerciseId: 19 },
      { num: 3, name: "Dumbbell Renegade Row", sets: 2, reps: "8–15 / arm", rest: "60 sec", target: "Back, core, shoulders", exerciseId: 20 },
      { num: 4, name: "Rear Delt Fly", sets: 3, reps: "15–25", rest: "45 sec", target: "Rear delts, upper back", exerciseId: 21 },
      { num: 5, name: "Concentration Curl", sets: 3, reps: "12–20 / arm", rest: "45 sec", target: "Biceps", exerciseId: 22 },
      { num: 6, name: "Hammer Curl", sets: 2, reps: "12–20", rest: "45 sec", target: "Brachialis, forearms", exerciseId: 17 },
      { num: 7, name: "Wrist Curl", sets: 2, reps: "15–25", rest: "45 sec", target: "Forearm flexors", exerciseId: 23 },
      { num: 8, name: "Reverse Wrist Curl", sets: 2, reps: "15–25", rest: "45 sec", target: "Forearm extensors", exerciseId: 24 },
    ],
  },
  {
    id: "day-6",
    dayNumber: 6,
    title: "Legs + Core B",
    subtitle: "Unilateral Legs + Glutes + Obliques + Deep Core + Neck",
    focus: "Unilateral Legs, Obliques & Deep Stability",
    color: "from-rose-600 to-pink-700",
    exercises: [
      { num: 1, name: "Bulgarian Split Squat", sets: 3, reps: "12–20 / leg", rest: "75 sec", target: "Quads, glutes", exerciseId: 32 },
      { num: 2, name: "Dumbbell Sumo Squat", sets: 3, reps: "15–25", rest: "60 sec", target: "Glutes, quads, adductors", exerciseId: 33 },
      { num: 3, name: "Single-Leg Dumbbell RDL", sets: 2, reps: "12–15 / leg", rest: "60 sec", target: "Hamstrings, glutes, balance", exerciseId: 34 },
      { num: 4, name: "Single-Leg Calf Raise", sets: 3, reps: "15–25 / leg", rest: "45 sec", target: "Calves", exerciseId: 35 },
      { num: 5, name: "Side Plank", sets: 2, reps: "30–45 sec / side", rest: "45 sec", target: "Obliques, QL", exerciseId: 36 },
      { num: 6, name: "Weighted Russian Twist", sets: 2, reps: "15–20 / side", rest: "45 sec", target: "Obliques", exerciseId: 37 },
      { num: 7, name: "Standing Dumbbell Oblique Crunch", sets: 2, reps: "12–15 / side", rest: "45 sec", target: "Internal & external obliques, side abs", exerciseId: 38 },
      { num: 8, name: "Dead Bug", sets: 2, reps: "10–15 / side", rest: "45 sec", target: "Deep core", exerciseId: 39 },
      { num: 9, name: "Chin Tucks", sets: 2, reps: "10–15", rest: "30 sec", target: "Deep neck flexors", exerciseId: 41 },
    ],
  },
  {
    id: "day-7",
    dayNumber: 7,
    title: "Rest Day",
    subtitle: "Full Body Active Recovery",
    focus: "Replenish Glycogen, Tissue Repair & Nervous System Recovery",
    color: "from-slate-600 to-gray-800",
    isRest: true,
    exercises: [],
    restActivities: [
      { activity: "Easy walk", duration: "20–30 min" },
      { activity: "Light stretching", duration: "5–10 min" },
      { activity: "Recovery", duration: "Sleep + adequate nutrition" },
    ],
  },
];

export const NIGHT_ROUTINE_ITEMS: NightRoutineItem[] = [
  { id: 1, exercise: "Easy walk", setsReps: "10–20 min", frequency: "Daily", purpose: "General activity, recovery" },
  { id: 2, exercise: "Dead hang + Hanging knee/leg raises", setsReps: "1–2 × 20–30s hang + 6–10 raises", frequency: "Daily", purpose: "Grip, shoulder decompression & lower abs" },
  { id: 3, exercise: "Chin tucks", setsReps: "2 × 10–15", frequency: "Daily", purpose: "Neck / posture" },
  { id: 4, exercise: "Shoulder circles", setsReps: "1 × 10 each dir", frequency: "Daily", purpose: "Shoulder mobility" },
  { id: 5, exercise: "Hip mobility", setsReps: "2–3 min", frequency: "Daily", purpose: "Hip movement / recovery" },
  { id: 6, exercise: "Cat-cow", setsReps: "1 × 10–15", frequency: "Daily", purpose: "Spine mobility" },
  { id: 7, exercise: "Light plank", setsReps: "1 × 30–45 sec", frequency: "Daily", purpose: "Front core activation" },
  { id: 8, exercise: "Light side planks (both sides)", setsReps: "1 × 20–30 sec / side", frequency: "Daily / 3–4× wk", purpose: "Obliques & waistline tightening" },
  { id: 9, exercise: "Light push-ups", setsReps: "1–2 × 8–15", frequency: "Daily / 3–4× wk", purpose: "Pushing groove & chest/shoulder mobility" },
  { id: 10, exercise: "Light crunches", setsReps: "1 × 15–20", frequency: "3–4× / week", purpose: "Ab practice" },
  { id: 11, exercise: "Light pull-ups", setsReps: "1–2 × 3–5", frequency: "2–3× / week", purpose: "Pull-up technique" },
];

export const PROGRESSION_METHODS: ProgressionMethod[] = [
  { method: "Increase reps", example: "15 → 20 → 25" },
  { method: "Slower eccentric", example: "2 sec → 3–4 sec" },
  { method: "Pause", example: "1–2 sec at hardest position" },
  { method: "One-sided movement", example: "Squat → Bulgarian split squat" },
  { method: "Increase range of motion", example: "Deeper controlled movement" },
  { method: "Reduce rest slightly", example: "60 sec → 45 sec" },
  { method: "Increase control", example: "No swinging / strict reps" },
];

export const GOBLET_SQUAT_PROGRESSION = [
  { week: "Week 1", desc: "15 reps" },
  { week: "Week 2", desc: "18 reps" },
  { week: "Week 3", desc: "20 reps" },
  { week: "Week 4", desc: "20 reps with 3-second descent" },
  { week: "Week 5", desc: "20 reps with pause at bottom" },
];

export const EFFORT_GUIDELINES: EffortGuideline[] = [
  { type: "Compound movements", guideline: "Finish with ~1–3 reps left (1–3 RIR)" },
  { type: "Isolation movements", guideline: "~1–2 reps left (1–2 RIR)" },
  { type: "Push-ups", guideline: "Last set can approach failure" },
  { type: "Pull-ups / chin-ups", guideline: "Stop when form starts breaking" },
  { type: "Core holds", guideline: "Stop when proper position is lost" },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Reps (Repetitions)",
    category: "metric",
    definition: "The number of times you perform a specific exercise movement consecutively without stopping (e.g., 15 push-ups = 15 reps).",
  },
  {
    term: "Sets",
    category: "metric",
    definition: "A cycle/group of repetitions performed in a row before taking a designated rest interval (e.g., 3 sets of 15 reps means you do 15 reps, rest, 15 reps, rest, 15 reps).",
  },
  {
    term: "Rest / Rest Interval",
    category: "metric",
    definition: "The recovery duration in seconds/minutes between sets (e.g., 60 sec). Sticking to strict rest times keeps workout density high and prevents fatigue overflow.",
  },
  {
    term: "PPL (Push / Pull / Legs)",
    category: "split",
    definition: "A workout split that divides training by movement patterns: Push (Chest, shoulders, triceps), Pull (Back, rear delts, biceps, forearms), and Legs (Quads, hamstrings, glutes, calves + core).",
  },
  {
    term: "Eccentric Phase (Negative)",
    category: "biomechanics",
    definition: "The muscle-lengthening / lowering phase under load (e.g., lowering dumbbells to chest or lowering down from a pull-up). Performing this slowly (2–3 sec) creates significant muscle stimulus with lighter weights.",
  },
  {
    term: "Concentric Phase (Positive)",
    category: "biomechanics",
    definition: "The muscle-shortening / lifting phase against gravity (e.g., pressing dumbbells up or pulling yourself up to the bar). Should generally be executed with control and intent.",
  },
  {
    term: "Isometric / Pause",
    category: "biomechanics",
    definition: "Holding a static position under tension without joint movement (e.g., holding a plank or pausing for 1–2 sec at the bottom of a goblet squat to remove bouncing momentum).",
  },
  {
    term: "Tempo",
    category: "technique",
    definition: "The prescribed speed/cadence of each rep (e.g., 3-second descent → 1-second pause at bottom → 1-second press).",
  },
  {
    term: "Unilateral vs. Bilateral",
    category: "biomechanics",
    definition: "Unilateral: Working one limb/side at a time (e.g., Bulgarian Split Squat, Single-Arm Row), effectively doubling the load per working limb and fixing strength imbalances. Bilateral: Working both limbs simultaneously (e.g., standard squat, push-ups).",
  },
  {
    term: "Compound vs. Isolation",
    category: "biomechanics",
    definition: "Compound: Multi-joint exercises involving multiple muscle groups simultaneously (e.g., Pull-ups, Floor Press, Goblet Squats). Isolation: Single-joint exercises targeting one specific muscle head (e.g., Lateral Raises, Bicep Curls, Skull Crushers).",
  },
  {
    term: "RIR (Reps in Reserve)",
    category: "metric",
    definition: "The number of additional clean, strict repetitions you could have completed before reaching failure. '1–2 reps left' = 1–2 RIR.",
  },
  {
    term: "Technical Failure",
    category: "technique",
    definition: "The point in a set where you can no longer complete a repetition with safe, textbook form (stopping here prevents injury and joint wear).",
  },
  {
    term: "Progressive Overload",
    category: "technique",
    definition: "Gradually increasing training stimulus over time to force muscle adaptation. With fixed 6 kg dumbbells, overload is achieved via more reps, slower tempo, pauses, unilateral variations, and cleaner range of motion.",
  },
  {
    term: "Dead Hang",
    category: "exercise",
    definition: "Hanging from an overhead bar/ledge with straight arms. Decompresses the spine, stretches tight lats/shoulders, and builds grip endurance.",
  },
  {
    term: "Chin Tucks",
    category: "exercise",
    definition: "Retracting the head and chin straight backward horizontally (creating a 'double chin'). Strengthens deep cervical neck flexors and counteracts forward-head posture.",
  },
  {
    term: "Cat-Cow",
    category: "exercise",
    definition: "A dynamic floor mobility movement alternating between spinal flexion (rounding back) and spinal extension (arching back) to improve vertebral mobility.",
  },
  {
    term: "QL (Quadratus Lumborum)",
    category: "biomechanics",
    definition: "A deep lower back/core muscle that stabilizes the pelvis and spine, trained during side planks and unilateral carries.",
  },
];

export const EXERCISE_DATABASE: ExerciseDetail[] = [
  // PUSH MOVEMENTS
  {
    num: 1,
    name: "Dumbbell Floor Press",
    tag: "Push / Chest & Triceps",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Dumbbell Floor Press.png",
    primary: "Pectoralis Major (Mid & Lower Chest), Triceps Brachii",
    secondary: "Anterior Deltoids (Front Shoulders), Core",
    steps: [
      "Lie flat on the floor with knees bent and feet flat on the ground. Hold dumbbells above your chest with arms extended.",
      "Position your elbows at ~45–60° from your torso (avoid flaring elbows out at 90°).",
      "Inhale and slowly lower the dumbbells over 2–3 seconds until the back of your upper arms lightly touch the floor.",
      "Pause for half a second on the floor (do not bounce your elbows), then exhale and press smoothly back to the starting position."
    ],
    cue: "Don't just push the weights up. Imagine squeezing your biceps inward toward your chest center, pinching a pencil between your pecs at the top."
  },
  {
    num: 2,
    name: "Close-Grip Dumbbell Press",
    tag: "Push / Triceps & Inner Chest",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Close-Grip Dumbbell Press.jpg",
    primary: "Triceps Brachii, Sternal Pectoralis (Inner Chest)",
    secondary: "Anterior Deltoids",
    steps: [
      "Lie on the floor with knees bent. Hold the two dumbbells pressed together against each other with a neutral grip (palms facing each other) directly over your chest.",
      "Keep the dumbbells firmly pressed together throughout the entire rep.",
      "Lower under control down to your sternum, keeping elbows tucked close to your ribs.",
      "Press back up while continuously squeezing the dumbbells together horizontally as hard as possible."
    ],
    cue: "Crush the two dumbbells into each other continuously. That inward pressure forces your triceps and inner chest fibers to contract intensely even with 6 kg."
  },
  {
    num: 3,
    name: "Dumbbell Shoulder Press",
    tag: "Push / Shoulders",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Dumbbell Shoulder Press.jpg",
    primary: "Anterior Deltoids (Front Shoulders), Medial Deltoids (Side Shoulders)",
    secondary: "Triceps Brachii, Upper Trapezius, Upper Chest",
    steps: [
      "Stand tall or sit upright with core braced and glutes squeezed. Hold dumbbells at ear height with elbows angled ~30° forward in the scapular plane.",
      "Press overhead in a smooth arc until your arms are extended directly over your ears.",
      "Lower slowly over 2–3 seconds back down to chin/shoulder level."
    ],
    cue: "Drive your elbows up from underneath the dumbbells rather than just pushing your hands up. Keep your ribs pulled down so your lower back never arches."
  },
  {
    num: 4,
    name: "Dumbbell Lateral Raise",
    tag: "Push / Side Delts",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Dumbbell Lateral Raise.jpg",
    primary: "Lateral / Medial Deltoids (Side Shoulders - builds shoulder width)",
    secondary: "Anterior Deltoids, Supraspinatus, Trapezius",
    steps: [
      "Stand with a slight forward hip hinge (~10–15°), holding dumbbells in front of thighs with a slight soft bend in your elbows.",
      "Raise arms out to your sides until elbows reach shoulder height. Keep your pinky finger slightly higher than or level with your thumb.",
      "Pause for 1 second at the top, then lower slowly over 2–3 seconds."
    ],
    cue: "Imagine pushing your elbows outward toward the side walls rather than lifting the weight up. Lead with your elbows and keep traps relaxed."
  },
  {
    num: 5,
    name: "Push-Ups",
    tag: "Push / Calisthenics",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Push-Ups.jpg",
    primary: "Pectoralis Major, Triceps Brachii",
    secondary: "Anterior Deltoids, Serratus Anterior, Core",
    steps: [
      "Set hands slightly wider than shoulder-width, body forming a rigid straight line from head to heels.",
      "Lower your chest until it is ~1 inch from the floor, keeping elbows tracking back at 45°.",
      "Push the floor away firmly to return to the top, pushing shoulder blades slightly apart at lock-out."
    ],
    cue: "Treat your body like a moving steel board. Squeeze your glutes and abs to prevent hip sag and focus on driving through your chest."
  },
  {
    num: 6,
    name: "Overhead Dumbbell Triceps Extension",
    tag: "Push / Triceps Long Head",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Overhead Dumbbell Triceps Extension.jpg",
    primary: "Triceps Brachii (specifically the Long Head for arm thickness)",
    secondary: "Core stabilizers",
    steps: [
      "Stand or sit upright. Cup the top inner plate of a dumbbell with both hands overhead.",
      "Keep upper arms vertical and close to your head. Lower the weight behind your head by bending only at the elbows.",
      "Feel a deep stretch in your triceps at the bottom, then extend elbows to press back overhead."
    ],
    cue: "Keep your elbows pointing straight forward. Feel the stretch deep in the back of your armpits, then squeeze the tricep meat straight."
  },
  {
    num: 7,
    name: "Dumbbell Skull Crushers",
    tag: "Push / Triceps",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Dumbbell Skull Crushers.jpg",
    primary: "Triceps Brachii (Medial & Long heads)",
    secondary: "Forearms",
    steps: [
      "Lie on the floor holding dumbbells straight above your shoulders with palms facing each other.",
      "Angle upper arms slightly backward (~75°) so tension remains on the triceps at the top.",
      "Bend only at the elbows to lower dumbbells beside your ears/temples.",
      "Extend elbows to return to the starting position without swinging upper arms forward."
    ],
    cue: "Your upper arms are frozen concrete pillars. Only your forearms hinge. Squeeze the backs of your elbows at the top."
  },
  {
    num: 8,
    name: "Single-Arm Dumbbell Floor Press",
    tag: "Push B / Unilateral & Core",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Single-Arm Dumbbell Floor Press.jpg",
    primary: "Pectoralis Major, Triceps Brachii",
    secondary: "Anti-rotational Core & Obliques, Anterior Deltoid",
    steps: [
      "Lie flat on the floor with knees bent. Hold one dumbbell in one hand directly above your chest.",
      "Brace your core hard to prevent your opposite shoulder and hip from lifting off the ground.",
      "Slowly lower the dumbbell over 2–3 seconds until your upper arm touches the floor, pause, and press up firmly."
    ],
    cue: "Lock your torso to the floor like an anchor. Fight the rotational pull with your abs while driving up through your working pec."
  },
  {
    num: 9,
    name: "Dumbbell Floor Chest Fly",
    tag: "Push B / Chest Isolation",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Dumbbell Floor Chest Fly.jpg",
    primary: "Pectoralis Major (Outer & Sternal fibers)",
    secondary: "Anterior Deltoids, Biceps short head",
    steps: [
      "Lie on the floor holding dumbbells above your chest with palms facing each other and a slight bend in elbows.",
      "Lower arms out to the sides in a wide arc until the back of your upper arms touch the floor.",
      "Squeeze your chest muscles together to bring dumbbells back to the top over your chest."
    ],
    cue: "Imagine wrapping your arms around a large tree trunk. The floor safely stops you from overstretching your shoulders."
  },
  {
    num: 10,
    name: "Incline / Prone Dumbbell Y-Raise",
    tag: "Push B / Lower Traps & Scapula",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Incline Dumbbell Y-Raise.jpg",
    primary: "Lower Trapezius, Serratus Anterior (Scapular Health)",
    secondary: "Rear Deltoids, Lateral Deltoids, Rotator Cuff",
    steps: [
      "Lie chest-down on an incline or hinge forward at ~45°. Hold dumbbells with thumbs pointing upward.",
      "Raise arms up and outward at a 30–45° angle forming a 'Y' shape.",
      "Squeeze your mid/lower back at the top for 1 second, then lower under control."
    ],
    cue: "Slide your shoulder blades down into your back pockets as you raise your arms. Do not shrug your neck up."
  },
  {
    num: 11,
    name: "Diamond Push-Ups",
    tag: "Push B / Triceps",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/Diamond Push-Ups.jpg",
    primary: "Triceps Brachii (Medial & Lateral heads)",
    secondary: "Sternal Pectoralis, Anterior Deltoids, Core",
    steps: [
      "Form a plank with index fingers and thumbs touching to make a diamond shape under your chest.",
      "Lower your chest toward your hands while keeping your elbows tucked close to your ribs.",
      "Push the floor away forcefully, locking out your triceps at the top."
    ],
    cue: "Drive your palms straight down through the floor and feel the outer horseshoe of your triceps flex intensely."
  },

  // PULL MOVEMENTS
  {
    num: 12,
    name: "Pull-Ups",
    tag: "Pull / Lat Width & Upper Back",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Pull-Ups.jpg",
    primary: "Latissimus Dorsi, Teres Major, Rhomboids",
    secondary: "Biceps Brachii, Brachialis, Forearms, Core",
    steps: [
      "Grip the bar/ledge overhand slightly wider than shoulder-width.",
      "Start from a dead hang with engaged shoulder blades (depressed scapulae).",
      "Drive your elbows down and back to pull your chest up to the bar until chin clears.",
      "Lower smoothly over 2–3 seconds to a full stretch."
    ],
    cue: "Don't pull with your hands—think of driving your elbows straight down into your back pockets. Imagine bending the bar across your chest."
  },
  {
    num: 13,
    name: "Two-Arm Dumbbell Row",
    tag: "Pull / Back Thickness",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Two-Arm Dumbbell Row.jpg",
    primary: "Latissimus Dorsi, Rhomboids, Middle Trapezius",
    secondary: "Biceps, Rear Deltoids, Spinal Erectors",
    steps: [
      "Hinge at hips with a flat back at ~45°, knees soft, holding dumbbells hanging down.",
      "Row dumbbells toward your hips, driving elbows back and up.",
      "Squeeze your shoulder blades together for 1 full second at the top.",
      "Lower weights slowly over 2–3 seconds to a full stretch."
    ],
    cue: "Your hands are just hooks. Pull with your elbows and squeeze an orange between your shoulder blades at the peak."
  },
  {
    num: 14,
    name: "Dumbbell Pullover",
    tag: "Pull / Lat Stretch & Serratus",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Dumbbell Pullover.jpg",
    primary: "Latissimus Dorsi, Serratus Anterior",
    secondary: "Lower Chest, Triceps Long Head, Intercostals",
    steps: [
      "Lie on the floor holding a dumbbell with both hands cupping the inner plate over your chest with slightly bent arms.",
      "Maintaining the fixed slight elbow bend, lower the weight backward over your head until you feel a deep lat stretch.",
      "Pull the dumbbell back over your chest using your lats and armpit muscles."
    ],
    cue: "Feel the stretch deep in your armpits and ribcage. Pull back by contracting your lats, not by bending your arms."
  },
  {
    num: 15,
    name: "Bent-Over Rear Delt Fly",
    tag: "Pull A / Rear Delts & Upper Back",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Bent-Over Rear Delt Fly.jpg",
    primary: "Posterior Deltoids (Rear Shoulders)",
    secondary: "Rhomboids, Middle Trapezius, Infraspinatus",
    steps: [
      "Hinge forward until your torso is nearly parallel to the floor with flat back.",
      "Hold dumbbells hanging below chest with palms facing each other and elbows slightly bent.",
      "Raise arms out to sides in a wide sweeping arc, leading with your pinkies.",
      "Pause at the top for 1 second, then lower under control."
    ],
    cue: "Reach your knuckles toward the far corners of the room. Keep traps relaxed so the small rear shoulder balls do all the work."
  },
  {
    num: 16,
    name: "Dumbbell Curls",
    tag: "Pull / Biceps",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Dumbbell Curls.jpg",
    primary: "Biceps Brachii (Short & Long Heads)",
    secondary: "Brachialis, Forearm Flexors",
    steps: [
      "Stand tall with dumbbells at your sides, elbows locked at your ribs.",
      "Curl the dumbbells up, rotating your wrists outward (supination) as you lift.",
      "Squeeze biceps hard at the peak for 1 second, then lower slowly over 3 seconds."
    ],
    cue: "Turn your pinky outward toward your shoulder at the top to force the bicep into a full peak cramp. Keep your elbows glued to your sides."
  },
  {
    num: 17,
    name: "Hammer Curls",
    tag: "Pull / Brachialis & Forearms",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Hammer Curls.jpg",
    primary: "Brachialis (pushes bicep up), Brachioradialis (Top Forearm)",
    secondary: "Biceps Brachii (Long Head)",
    steps: [
      "Hold dumbbells with a neutral grip (palms facing each other throughout).",
      "Curl weights upward keeping wrists straight and elbows stationary.",
      "Squeeze at the top and lower slowly over 2–3 seconds."
    ],
    cue: "Push the weight up with the base of your thumb. Feel the thick outer muscle between your bicep and tricep working."
  },
  {
    num: 18,
    name: "Chin-Ups",
    tag: "Pull B / Lats & Biceps",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Chin-Ups.jpg",
    primary: "Latissimus Dorsi, Biceps Brachii",
    secondary: "Brachialis, Rhomboids, Core",
    steps: [
      "Grip the bar underhand (palms facing you), shoulder-width apart.",
      "Pull your chest toward the bar by driving your elbows down and back.",
      "Squeeze your biceps and lats at the top, then lower slowly over 2–3 seconds."
    ],
    cue: "Pull your collarbone to the bar. Emphasize the slow descent to create maximum bicep tension."
  },
  {
    num: 19,
    name: "Single-Arm Dumbbell Row",
    tag: "Pull B / Unilateral Lat",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Single-Arm Dumbbell Row.jpg",
    primary: "Latissimus Dorsi (Lower/Mid Lat)",
    secondary: "Rhomboids, Biceps, Core anti-rotation",
    steps: [
      "Place one hand/knee on support (or split stance) with flat back.",
      "Let the dumbbell hang down and forward toward your front foot.",
      "Row the dumbbell back in a smooth 'J-curve' toward your hip pocket.",
      "Squeeze your lat at the top and lower slowly."
    ],
    cue: "Pull your elbow toward your back hip bone, not up to the ceiling. That puts 100% of the tension on the lower lat."
  },
  {
    num: 20,
    name: "Dumbbell Renegade Row",
    tag: "Pull B / Back & Core Anti-Rotation",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Dumbbell Renegade Row.jpg",
    primary: "Latissimus Dorsi, Rhomboids, Deep Core (Obliques/Transverse)",
    secondary: "Shoulders, Chest (supporting side)",
    steps: [
      "Set up in a push-up plank gripping both dumbbells on the floor with feet set wide.",
      "Brace your core and row one dumbbell up to your ribs without letting your hips tilt.",
      "Lower under control and switch sides."
    ],
    cue: "Keep your hips dead level like a table with a glass of water on your lower back. Row with strict lat control."
  },
  {
    num: 21,
    name: "Rear Delt Fly",
    tag: "Pull B / Rear Delt Isolation",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Rear Delt Fly.jpg",
    primary: "Posterior Deltoids (Rear Shoulders)",
    secondary: "Rhomboids, Trapezius",
    steps: [
      "Hinge forward at the hips, keeping arms slightly bent with palms facing each other.",
      "Sweep weights out to the side with pinkies high, focusing purely on the rear shoulder capsule.",
      "Pause at the peak and lower with a strict 2-second negative."
    ],
    cue: "Isolate the back of your shoulders. Don't pinch your shoulder blades together until the rear delts have fully contracted."
  },
  {
    num: 22,
    name: "Concentration Curl",
    tag: "Pull B / Bicep Peak",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Concentration Curl.jpg",
    primary: "Biceps Brachii (Short Head & Peak)",
    secondary: "Brachialis",
    steps: [
      "Sit on a chair with knees apart. Rest the back of your working elbow against your inner thigh.",
      "Curl the dumbbell up toward your face with zero torso swing.",
      "Squeeze for 1 full second at the top, then lower over 3 seconds."
    ],
    cue: "Lock your arm against your thigh to eliminate all momentum. Stare at your bicep balling up and squeeze hard."
  },
  {
    num: 23,
    name: "Wrist Curl",
    tag: "Pull B / Forearm Flexors",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Wrist Curl.jpg",
    primary: "Forearm Flexors (inner forearm & grip)",
    secondary: "Finger flexors",
    steps: [
      "Rest forearms flat on thighs with wrists hanging over knees, palms facing up.",
      "Lower the dumbbell into your fingers, then curl fingers and wrists upward.",
      "Hold the peak flex for 1 second, then lower slowly."
    ],
    cue: "Feel the deep stretch across the bottom of your forearm and curl your wrists up as high as possible."
  },
  {
    num: 24,
    name: "Reverse Wrist Curl",
    tag: "Pull B / Forearm Extensors",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Forearms)",
    image: "/exercise images/Reverse Wrist Curl.jpg",
    primary: "Forearm Extensors (top forearm)",
    secondary: "Wrist stabilizers",
    steps: [
      "Rest forearms on thighs with wrists over knees, palms facing down.",
      "Raise dumbbells by extending wrists upward toward the ceiling.",
      "Hold for 1 second at the top and lower slowly."
    ],
    cue: "Focus on the top side of your forearm contracting to pull your knuckles up toward your elbow."
  },

  // LEGS & CORE MOVEMENTS
  {
    num: 25,
    name: "Goblet Dumbbell Squat",
    tag: "Legs / Quads & Glutes",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Goblet Dumbbell Squat.jpg",
    primary: "Quadriceps, Gluteus Maximus",
    secondary: "Adductors, Calves, Core",
    steps: [
      "Hold a dumbbell vertically against your chest (cupping the top plate). Feet shoulder-width apart, toes turned out ~15–30°.",
      "Sit hips back and down, keeping chest proud and knees tracking over toes.",
      "Descend to parallel or below over 2–3 seconds, pause for 1 second at the bottom, then drive through your whole foot to stand."
    ],
    cue: "Spread the floor apart with your feet as you descend. Drive through your mid-foot and squeeze your quads and glutes at the top."
  },
  {
    num: 26,
    name: "Dumbbell Romanian Deadlift (RDL)",
    tag: "Legs / Hamstrings & Glutes",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Dumbbell Romanian Deadlift.jpg",
    primary: "Hamstrings, Gluteus Maximus",
    secondary: "Lower Back (Erectors), Lats, Forearms",
    steps: [
      "Stand tall holding dumbbells in front of thighs, knees soft with a slight bend.",
      "Push your hips straight back toward the wall behind you, keeping your spine flat and dumbbells skimming down your shins.",
      "Stop when you feel a deep hamstring stretch (mid-shin), then drive hips forward to stand and squeeze glutes."
    ],
    cue: "Do not bend down. Think of reaching your butt backward into the wall behind you while keeping your chest wide."
  },
  {
    num: 27,
    name: "Dumbbell Reverse Lunges",
    tag: "Legs / Quads & Glutes",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Dumbbell Reverse Lunges.jpg",
    primary: "Quadriceps, Gluteus Maximus",
    secondary: "Hamstrings, Calves, Core Stabilizers",
    steps: [
      "Stand holding dumbbells at sides. Step backward with one leg and lower until both knees are at 90°.",
      "Keep front knee stacked over ankle with chest slightly leaning forward over front thigh.",
      "Push through the front heel to step back to standing."
    ],
    cue: "Place 90% of your weight on the front working leg. Drive through that front heel and glute to stand up."
  },
  {
    num: 28,
    name: "Standing Dumbbell Calf Raise",
    tag: "Legs A / Calves",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Standing Dumbbell Calf Raise.jpg",
    primary: "Gastrocnemius, Soleus (Calves)",
    secondary: "Tibialis Posterior, Foot intrinsics",
    steps: [
      "Stand on the edge of a step/ledge with balls of feet, holding dumbbells at your sides.",
      "Lower heels down into a deep, full calf stretch.",
      "Press through the balls of big toes to rise as high onto your toes as possible.",
      "Hold the peak contraction for 1–2 seconds, then lower slowly over 3 seconds."
    ],
    cue: "No bouncing! Pause dead at the bottom stretch and press hard through your big toe joint for a cramping calf contraction."
  },
  {
    num: 29,
    name: "Hanging Knee / Leg Raises",
    tag: "Core / Lower Abs",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Hanging Knee-Leg Raises.jpg",
    primary: "Rectus Abdominis (Lower Abs), Hip Flexors",
    secondary: "Obliques, Forearm Grip, Lats",
    steps: [
      "Hang from your pull-up bar with straight arms and engaged shoulders.",
      "Without swinging, curl your pelvis upward and bring your knees (or straight legs) toward your chest.",
      "Pause for 1 second at the top, then lower slowly without arching your lower back."
    ],
    cue: "Don't just lift your legs; think of curling your belt buckle up toward your sternum to force your lower abs to contract."
  },
  {
    num: 30,
    name: "Weighted Crunch",
    tag: "Core / Upper Abs",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Weighted Crunch.jpg",
    primary: "Rectus Abdominis (Upper & Mid Abs)",
    secondary: "Obliques",
    steps: [
      "Lie on your back with knees bent and feet flat. Hold a 6 kg dumbbell on your chest.",
      "Exhale and curl your ribcage down toward your pelvis, lifting shoulder blades off the floor.",
      "Squeeze abs hard at the peak for 1 second, then lower under control."
    ],
    cue: "Blow all the air out of your lungs at the top and fold your ribs into your belly button."
  },
  {
    num: 31,
    name: "Plank",
    tag: "Core A / Deep Core & Anti-Extension",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Plank.jpg",
    primary: "Transverse Abdominis, Rectus Abdominis",
    secondary: "Glutes, Quadriceps, Serratus Anterior, Deltoids",
    steps: [
      "Set up on forearms and toes with elbows directly under shoulders, body forming a rigid straight line.",
      "Squeeze glutes tight, pull your belly button into your spine, and actively pull elbows toward toes.",
      "Hold rigidly for 45–60 seconds while breathing calmly through your nose."
    ],
    cue: "Create maximum full-body tension. Don't just balance passively—pull elbows to toes so your core is vibrating with force."
  },
  {
    num: 32,
    name: "Bulgarian Split Squat",
    tag: "Legs B / King of Unilateral Legs",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/dumbbell-bulgarian-split-squat.jpg",
    primary: "Quadriceps, Gluteus Maximus (Huge hypertrophy with 6 kg)",
    secondary: "Hamstrings, Adductors, Calves, Core balance",
    steps: [
      "Stand 2–3 feet in front of a chair/couch. Place the top of one back foot on the elevation.",
      "Hold dumbbells at sides. Lower your back knee straight down toward the floor until front thigh is parallel.",
      "Drive up through the front heel to return to the top."
    ],
    cue: "Keep all the load on your front foot. Push the floor away through your front heel and feel the quad and glute burning."
  },
  {
    num: 33,
    name: "Dumbbell Sumo Squat",
    tag: "Legs B / Glutes & Adductors",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Goblet Dumbbell Squat.jpg",
    primary: "Gluteus Maximus, Adductors (Inner Thighs), Quadriceps",
    secondary: "Hamstrings, Core",
    steps: [
      "Take a wide stance (1.5× shoulder width) with toes flared outward at ~45°.",
      "Hold a dumbbell hanging vertically between your legs.",
      "Squat down deeply by pushing knees wide apart over pinky toes while keeping chest tall.",
      "Drive through heels and squeeze inner thighs and glutes to stand."
    ],
    cue: "Push your knees out wide on the way down, and squeeze your inner thighs and butt cheeks together on the way up."
  },
  {
    num: 34,
    name: "Single-Leg Dumbbell RDL",
    tag: "Legs B / Hamstrings & Balance",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Single-Leg Dumbbell RDL.jpg",
    primary: "Hamstrings, Gluteus Medius & Maximus",
    secondary: "Core anti-rotation, Ankle stabilizers",
    steps: [
      "Stand on one foot holding dumbbell in the opposite hand.",
      "Hinge at hip while extending your free leg straight back behind you for balance.",
      "Lower dumbbell toward your standing shin until a hamstring stretch is felt, keeping hips square to the floor.",
      "Drive through standing heel to return to top."
    ],
    cue: "Keep your hips level like a flat tabletop. Your torso and back leg form one continuous lever pivoting on your hip."
  },
  {
    num: 35,
    name: "Single-Leg Calf Raise",
    tag: "Legs B / Unilateral Calves",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Single-Leg Calf Raise.png",
    primary: "Gastrocnemius, Soleus (Single-Leg Overload)",
    secondary: "Ankle stabilizers, Foot intrinsics",
    steps: [
      "Stand on one foot on a step/ledge holding a dumbbell in the working side hand.",
      "Lower heel down into a deep calf stretch.",
      "Press high onto the ball of your foot, pausing at the top for 1–2 seconds.",
      "Lower slowly over 3 seconds and repeat."
    ],
    cue: "Feel the intense isolated burn in the single calf muscle. Zero momentum, strict pauses at top and bottom."
  },
  {
    num: 36,
    name: "Side Plank",
    tag: "Core B / Obliques & QL",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Side Plank.jpg",
    primary: "Internal & External Obliques, Quadratus Lumborum (QL)",
    secondary: "Gluteus Medius, Shoulder stabilizers, Transverse Abdominis",
    steps: [
      "Lie on your side propped up on your forearm with elbow under shoulder, feet stacked.",
      "Lift hips off the floor until your body forms a straight diagonal line from shoulder to ankles.",
      "Hold this rigid position for 30–45 seconds per side while breathing smoothly."
    ],
    cue: "Push your bottom hip toward the ceiling. Feel the lower side of your waist (oblique and QL) working like a tense steel cable."
  },
  {
    num: 37,
    name: "Weighted Russian Twist",
    tag: "Core B / Oblique Rotation",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Weighted Russian Twist.jpg",
    primary: "Internal & External Obliques",
    secondary: "Rectus Abdominis, Hip Flexors",
    steps: [
      "Sit on the floor, knees bent, torso leaned back at ~45°. Hold a dumbbell in both hands.",
      "Rotate your torso smoothly from side to side, bringing the weight beside your hip.",
      "Control the rotation without flinging your arms."
    ],
    cue: "Turn your entire ribcage and shoulders, not just your hands. Squeeze your side obliques with every twist."
  },
  {
    num: 38,
    name: "Standing Dumbbell Oblique Crunch",
    tag: "Core B / Lateral Oblique Flexion",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Standing Dumbbell Oblique Crunch.jpg",
    primary: "Internal & External Obliques, Quadratus Lumborum (QL)",
    secondary: "Rectus Abdominis, Forearm Grip",
    steps: [
      "Stand tall holding a 6 kg dumbbell in one hand at your side, placing your opposite hand behind your head.",
      "Keeping your hips square and chest facing forward, slowly lower the dumbbell down the side of your thigh toward your knee.",
      "Feel the deep stretch in your opposite side oblique, then contract that oblique forcefully to pull your torso upright and slightly past vertical.",
      "Pause for 1 second at peak contraction, complete all reps, then switch hands."
    ],
    cue: "Imagine you are standing between two narrow glass walls. Do not lean forward or twist—crunch directly sideways using your side waist."
  },
  {
    num: 39,
    name: "Dead Bug (Anti-Extension Core)",
    tag: "Core B / Deep Core & Spine Stability",
    category: "legs-core",
    categoryLabel: "Legs & Core Movements (Quads, Hamstrings, Glutes, Abs & Calves)",
    image: "/exercise images/Weighted dead bug loaded anti extension core.jpg",
    primary: "Transverse Abdominis, Rectus Abdominis",
    secondary: "Hip Flexors, Shoulder Stabilizers",
    steps: [
      "Lie on your back, arms pointing to the ceiling, knees bent at 90° over hips.",
      "Press your lower back flat into the floor so no gap exists.",
      "Slowly extend one leg out while lowering the opposite arm overhead.",
      "Return to start and repeat on the other side while keeping lower back glued to the floor."
    ],
    cue: "Imagine your lower back is crushing a grape into the floor. Never allow your lower back to arch off the ground."
  },

  // DAILY POSTURE & MOBILITY
  {
    num: 40,
    name: "Dead Hang",
    tag: "Daily / Grip & Spinal Decompression",
    category: "daily",
    categoryLabel: "Daily Posture, Mobility & Decompression",
    image: "/exercise images/Dead Hang.jpg",
    primary: "Forearm Flexors (Grip Endurance), Latissimus Dorsi (Spine Decompression)",
    secondary: "Rotator Cuff, Trapezius, Core",
    steps: [
      "Grab the pull-up bar with an overhand grip, hands shoulder-width apart.",
      "Let your body hang freely with straight arms for 20–45 seconds.",
      "Breathe deeply into your abdomen and allow gravity to gently decompress your spinal discs."
    ],
    cue: "Breathe deeply into your belly and feel every vertebra in your spine opening up and lengthening. Keep a vice-like grip with your fingers."
  },
  {
    num: 41,
    name: "Chin Tucks",
    tag: "Daily / Posture & Deep Neck Flexors",
    category: "daily",
    categoryLabel: "Daily Posture, Mobility & Decompression",
    image: "/exercise images/Chin Tucks.jpg",
    primary: "Longus Colli, Longus Capitis (Deep Cervical Neck Flexors)",
    secondary: "Suboccipital stretch (relieves neck tension and forward-head posture)",
    steps: [
      "Sit or stand tall with shoulders relaxed and eyes looking straight ahead.",
      "Retract your head and chin straight backward horizontally (making a double chin).",
      "Hold the end position for 3–5 seconds, feeling the back of your neck stretch and front flexors engage.",
      "Release smoothly and repeat for 10–15 reps."
    ],
    cue: "Imagine a string pulling the crown of your head straight up toward the sky while sliding your chin horizontally back into your neck. Never look down."
  },
  {
    num: 42,
    name: "Dumbbell Front Raise",
    tag: "Push B / Anterior Deltoid Isolation",
    category: "push",
    categoryLabel: "Push Movements (Chest, Shoulders & Triceps)",
    image: "/exercise images/dumbbell-seated-front-raise.jpg",
    primary: "Anterior Deltoids (Front Shoulders)",
    secondary: "Clavicular Head of Pectoralis Major (Upper Chest), Serratus Anterior",
    steps: [
      "Stand tall holding 6 kg dumbbells resting against the front of your thighs with knuckles facing forward or neutral hammer grip.",
      "Brace your core and raise the dumbbells straight forward and slightly outward with elbows soft and fixed.",
      "Lift smoothly until dumbbells reach eye level / parallel to the floor.",
      "Pause for 1 second at the peak to squeeze the front deltoids, then lower under strict control for 2–3 seconds."
    ],
    cue: "Pour the weight outward and forward. Do not swing your hips or arch your lower back—keep your torso locked like stone and isolate the front cap of the shoulder."
  },
  {
    num: 43,
    name: "Dumbbell Shrugs",
    tag: "Pull A / Upper Trapezius Hypertrophy",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Traps)",
    image: "/exercise images/dumbbell-shrugs.jpg",
    primary: "Upper Trapezius, Levator Scapulae",
    secondary: "Middle Trapezius, Rhomboids, Forearm Grip",
    steps: [
      "Stand tall with feet shoulder-width apart, holding 6 kg dumbbells at your sides with palms facing your thighs.",
      "Keep your arms completely straight with a micro-bend in the elbows to protect the joints.",
      "Elevate your shoulder blades straight up toward your ears in a pure vertical line—do NOT roll your shoulders.",
      "Hold a hard 2-second peak contraction at the very top, driving your traps toward your ears.",
      "Lower the dumbbells under strict control for 3 seconds until you feel a deep stretch in the upper traps and neck."
    ],
    cue: "Shrug straight up as if trying to touch your traps to your ears. Never roll your shoulders backward—elevate strictly vertically with a hard 2-second peak hold."
  },
  {
    num: 44,
    name: "Dumbbell Wide-Grip Upright Row",
    tag: "Pull A / Upper Back, Traps & Side Delts",
    category: "pull",
    categoryLabel: "Pull Movements (Back, Biceps, Rear Delts & Traps)",
    image: "/exercise images/Dumbbell wide-grip upright row.jpg",
    primary: "Lateral Deltoids (Side Shoulders), Upper & Middle Trapezius",
    secondary: "Rhomboids, Biceps, Forearms",
    steps: [
      "Stand tall with feet shoulder-width apart, holding 6 kg dumbbells resting against the front of your thighs with an overhand wide grip.",
      "Keep dumbbells spaced roughly shoulder-width or slightly wider apart (never let them touch in the middle to protect rotator cuffs).",
      "Pull the dumbbells vertically up along the front of your torso, leading with your elbows flared high and wide.",
      "Stop when the dumbbells reach lower-to-mid chest height (elbows at or slightly below shoulder level—never yank up to your chin).",
      "Pause for 1 second at the peak to feel the traps and side delts contract, then lower slowly for 2–3 seconds."
    ],
    cue: "Lead with your elbows high and wide, keeping hands spaced apart. Stop at mid-chest level—this delivers maximum trap and delt activation while keeping the rotator cuff 100% safe."
  }
];
