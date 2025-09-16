import { ageToStage, buildSampleGate, sanitizeGate } from "./gateUtils.js";

// src/data.js

// Data model reference:
//
// Option = { id, label, icon, prereqs?, effects?, outcomes? }
// Outcome = { id, text, probability, effects?, fatal? }
// DecisionGate = { id, stage, distance, laneOptions:[Option,…] }

export const STAGES = ["Childhood","Teen","YoungAdult","Adult","OldAge"];

const AUTHORED_GATES = [
  // --- Childhood (fill remaining ages) ---
  {
    id: "child_0",
    stage: "Childhood",
    age: 0,
    distance: 260,
    laneOptions: [
      { id:"tummy_time", label:"Tummy Time", icon:"🍼", effects:{ health:+1 } },
      { id:"lullaby", label:"Lullaby", icon:"🎶", effects:{ happiness:+1 } },
      { id:"picture_book", label:"Pictures", icon:"📘", effects:{ knowledge:+1 } }
    ]
  },
  {
    id: "child_5",
    stage: "Childhood",
    age: 5,
    distance: 460,
    laneOptions: [
      { id:"learn_letters", label:"Letters", icon:"🔤", effects:{ knowledge:+1 } },
      { id:"tag", label:"Tag", icon:"🏃", effects:{ health:+1, happiness:+1 } },
      { id:"arts_crafts", label:"Crafts", icon:"✂️", effects:{ happiness:+1, knowledge:+1 } }
    ]
  },
  {
    id: "child_7",
    stage: "Childhood",
    age: 7,
    distance: 520,
    laneOptions: [
      { id:"spelling_bee", label:"Spelling", icon:"🐝", effects:{ knowledge:+2, happiness:-1 } },
      { id:"bike_practice", label:"Bike", icon:"🚲", effects:{ health:+1, happiness:+1 }, outcomes:[{ text:"Fell off (-1 💚)", probability:0.25, effects:{ health:-1 } }] },
      { id:"game_night", label:"Game Night", icon:"🎲", effects:{ relationships:+1, happiness:+1 } }
    ]
  },
  {
    id: "child_8",
    stage: "Childhood",
    age: 8,
    distance: 560,
    laneOptions: [
      { id:"science_fair", label:"Science Fair", icon:"🧪", effects:{ knowledge:+2 } },
      { id:"music_choir", label:"Choir", icon:"🎤", effects:{ happiness:+1, relationships:+1 } },
      { id:"video_time", label:"Videos", icon:"🎬", effects:{ happiness:+1 } }
    ]
  },
  {
    id: "child_10",
    stage: "Childhood",
    age: 10,
    distance: 620,
    laneOptions: [
      { id:"coding_basics", label:"Scratch", icon:"💻", effects:{ knowledge:+1 } },
      { id:"team_captain", label:"Team Captain", icon:"🏅", effects:{ relationships:+1, happiness:+1 } },
      { id:"sleepover", label:"Sleepover", icon:"🛌", effects:{ relationships:+1, happiness:+1 }, outcomes:[{ text:"Too late (-1 💚)", probability:0.3, effects:{ health:-1 } }] }
    ]
  },
  {
    id: "child_11",
    stage: "Childhood",
    age: 11,
    distance: 660,
    laneOptions: [
      { id:"math_olymp", label:"Mathlete", icon:"🧠", effects:{ knowledge:+2, happiness:-1 } },
      { id:"club_soccer", label:"Soccer Club", icon:"⚽", effects:{ health:+1, relationships:+1 } },
      { id:"book_series", label:"Book Series", icon:"📚", effects:{ knowledge:+1, happiness:+1 } }
    ]
  },

  // --- Teen (fill age 15) ---
  {
    id: "teen_15",
    stage: "Teen",
    age: 15,
    distance: 780,
    laneOptions: [
      { id:"hackathon", label:"Hackathon", icon:"🖥️", effects:{ knowledge:+2, happiness:+1 } },
      { id:"band_practice", label:"Band", icon:"🎸", effects:{ relationships:+1, happiness:+1 } },
      { id:"weekend_trip", label:"Trip", icon:"🧳", effects:{ happiness:+2, wealth:-1 } }
    ]
  },
  {
    id: "child_1",
    stage: "Childhood",
    age: 1,
    distance: 300,
    laneOptions: [
      {
        id: "study_basics",
        label: "Study",
        icon: "📚",
        effects: { knowledge:+1, happiness:-1 },
        outcomes: [
          { id:"good_grade", text:"You aced a quiz (+1 📚)", probability:0.6, effects:{ knowledge:+1 } },
          { id:"tired", text:"Late-night cramming (-1 😀)", probability:0.4, effects:{ happiness:-1 } }
        ]
      },
      {
        id: "play_outside",
        label: "Play",
        icon: "⚽",
        effects: { happiness:+2, health:+1 },
        outcomes: [
          { id:"scrape", text:"You scraped your knee (-1 💚)", probability:0.2, effects:{ health:-1 } },
          { id:"made_friend", text:"You made a new friend (+1 ❤️)", probability:0.8, effects:{ relationships:+1 } }
        ]
      },
      {
        id: "video_games",
        label: "Games",
        icon: "🎮",
        effects: { happiness:+1 },
        outcomes: [
          { id:"sleep_debt", text:"Stayed up late (-1 💚)", probability:0.3, effects:{ health:-1 } },
          { id:"fun", text:"Had a blast!", probability:0.7 }
        ]
      }
    ]
  },
  {
    id: "child_2",
    stage: "Childhood",
    age: 2,
    distance: 350,
    laneOptions: [
      { id:"read_books", label:"Read", icon:"📖", effects:{ knowledge:+1 } },
      { id:"playground", label:"Playground", icon:"🛝", effects:{ happiness:+2 }, outcomes:[{ text:"New friend (+1 ❤️)", probability:0.7, effects:{ relationships:+1 } }] },
      { id:"cartoons", label:"Cartoons", icon:"📺", effects:{ happiness:+1 } }
    ]
  },
  {
    id: "child_3",
    stage: "Childhood",
    age: 3,
    distance: 380,
    laneOptions: [
      { id:"learn_music", label:"Music", icon:"🎵", effects:{ knowledge:+1, happiness:+1 } },
      { id:"hide_seek", label:"Hide & Seek", icon:"🙈", effects:{ happiness:+2 } },
      { id:"sweet_treat", label:"Candy", icon:"🍬", effects:{ happiness:+1 }, outcomes:[{ text:"Tummy ache (-1 💚)", probability:0.3, effects:{ health:-1 } }] }
    ]
  },
  {
    id: "teen_1",
    stage: "Teen",
    age: 13,
    distance: 700,
    laneOptions: [
      {
        id: "study_hard",
        label: "Study",
        icon: "📚",
        effects: { knowledge:+2, happiness:-1 },
        outcomes: [
          { id:"studied_a_lot", text:"Top of the class (flag set)", probability:0.5, effects:{ setFlag:"studied_a_lot", setTrue:true } },
          { id:"ok_grades", text:"Solid grades", probability:0.5 }
        ]
      },
      {
        id: "part_time_job",
        label: "Job",
        icon: "💼",
        effects: { wealth:+1 },
        outcomes: [
          { id:"bad_boss", text:"Tough boss (-1 😀)", probability:0.3, effects:{ happiness:-1 } },
          { id:"experience", text:"Gained experience (+1 💼)", probability:0.7, effects:{ wealth:+1 } }
        ]
      },
      {
        id: "hang_friends",
        label: "Friends",
        icon: "👯",
        effects: { relationships:+2, happiness:+1 }
      }
    ]
  },
  {
    id: "youngadult_1",
    stage: "YoungAdult",
    age: 18,
    distance: 1000,
    laneOptions: [
      {
        id: "move_out",
        label: "Move Out",
        icon: "🏠",
        effects: { happiness:+1, wealth:-1 },
        outcomes: [
          { id:"independent", text:"You live on your own now (+1 😀)", probability:1.0 }
        ]
      },
      {
        id: "college_life",
        label: "College",
        icon: "🎓",
        prereqs: [ { flag:"studied_a_lot", value:true } ],
        effects: { knowledge:+1, wealth:-1 },
        outcomes: [
          { id:"graduate", text:"You graduated! (+2 📚)", probability:0.6, effects:{ knowledge:+2 } },
          { id:"dropout", text:"You dropped out (-1 😀)", probability:0.4, effects:{ happiness:-1 } }
        ]
      },
      {
        id: "internship",
        label: "Internship",
        icon: "💼",
        effects: { wealth:+1, knowledge:+1 },
        outcomes: [
          { id:"experience", text:"You gained experience (+1 💼, +1 📚)", probability:1.0, effects:{ wealth:+1, knowledge:+1 } }
        ]
      }
    ]
  },
  {
    id: "adult_college",
    stage: "Adult",
    age: 25,
    distance: 1200,
    laneOptions: [
      {
        id: "apply_college",
        label: "College",
        icon: "🎓",
        prereqs: [
          { stat:"knowledge", op: ">=", value:6 },
          { flag:"studied_a_lot", value:true }
        ],
        effects: { wealth:-1 },   // application fees, time cost
        outcomes: [
          { id:"got_in", text:"You got into college! (+2 📚)", probability:0.7, effects:{ knowledge:+2, setFlag:"college", setTrue:true } },
          { id:"rejected", text:"Rejected this time (-1 😀)", probability:0.3, effects:{ happiness:-1 } }
        ]
      },
      {
        id: "start_career",
        label: "Career",
        icon: "🏢",
        effects: { wealth:+2, happiness:-1 },
        outcomes: [
          { id:"burnout", text:"Burnout (-2 💚)", probability:0.25, effects:{ health:-2 } }
        ]
      },
      {
        id: "travel",
        label: "Travel",
        icon: "🧳",
        effects: { happiness:+2, wealth:-1 }
      }
    ]
  },

  // --- Childhood extras ---
  {
    id: "child_4",
    stage: "Childhood",
    age: 4,
    distance: 420,
    laneOptions: [
      { id:"learn_shapes", label:"Shapes", icon:"🧩", effects:{ knowledge:+1 } },
      { id:"story_time", label:"Story Time", icon:"📖", effects:{ happiness:+1, relationships:+1 } },
      { id:"nap", label:"Nap", icon:"🛏️", effects:{ health:+1 } }
    ]
  },
  {
    id: "child_6",
    stage: "Childhood",
    age: 6,
    distance: 500,
    laneOptions: [
      { id:"join_team", label:"Team Sports", icon:"🏈", effects:{ health:+1, relationships:+1 } },
      { id:"science_kid", label:"Science Kit", icon:"🔬", effects:{ knowledge:+2, happiness:+1 } },
      { id:"screen_time", label:"Screen Time", icon:"📱", effects:{ happiness:+1 }, outcomes:[{ text:"Late night (-1 💚)", probability:0.3, effects:{ health:-1 } }] }
    ]
  },
  {
    id: "child_9",
    stage: "Childhood",
    age: 9,
    distance: 600,
    laneOptions: [
      { id:"music_lessons", label:"Music", icon:"🎻", effects:{ knowledge:+1, happiness:+1 } },
      { id:"help_at_home", label:"Chores", icon:"🧹", effects:{ wealth:+1, relationships:+1 } },
      { id:"comic_books", label:"Comics", icon:"📚", effects:{ happiness:+1 } }
    ]
  },
  {
    id: "child_12",
    stage: "Childhood",
    age: 12,
    distance: 680,
    laneOptions: [
      { id:"math_club", label:"Math Club", icon:"➗", effects:{ knowledge:+2 } },
      { id:"summer_camp", label:"Camp", icon:"🏕️", effects:{ happiness:+2, relationships:+1 } },
      { id:"junk_food", label:"Snacks", icon:"🍟", effects:{ happiness:+1 }, outcomes:[{ text:"Stomach ache (-1 💚)", probability:0.25, effects:{ health:-1 } }] }
    ]
  },

  // --- Teen extras ---
  {
    id: "teen_14",
    stage: "Teen",
    age: 14,
    distance: 740,
    laneOptions: [
      { id:"coding_club", label:"Coding", icon:"🧑\u200d💻", effects:{ knowledge:+2 } },
      { id:"sports_team", label:"Varsity", icon:"🏀", effects:{ health:+1, happiness:+1 } },
      { id:"hangout", label:"Hang Out", icon:"👫", effects:{ relationships:+2 } }
    ]
  },
  {
    id: "teen_16",
    stage: "Teen",
    age: 16,
    distance: 800,
    laneOptions: [
      {
        id:"drivers_ed",
        label:"Driver's Ed",
        icon:"🚗",
        effects:{ knowledge:+1 },
        outcomes: [
          { text:"Passed test (+1 😀)", probability:0.69, effects:{ happiness:+1 } },
          { text:"Failed test (-1 😀)", probability:0.30, effects:{ happiness:-1 } },
          { text:"Serious accident (fatal)", probability:0.01, fatal:true }
        ]
      },
      { id:"exam_prep", label:"Exam Prep", icon:"📝", effects:{ knowledge:+2, happiness:-1 } },
      { id:"weekend_job", label:"Weekend Job", icon:"🧾", effects:{ wealth:+1 } }
    ]
  },
  {
    id: "teen_17",
    stage: "Teen",
    age: 17,
    distance: 840,
    laneOptions: [
      { id:"college_apps", label:"Applications", icon:"📮", effects:{ knowledge:+1, wealth:-1 }, outcomes:[{ text:"Interview invite (+1 😀)", probability:0.6, effects:{ happiness:+1 } }] },
      { id:"gapyear_plan", label:"Gap Year Plan", icon:"🗺️", effects:{ happiness:+1 } },
      { id:"deep_friends", label:"Close Friends", icon:"🤝", effects:{ relationships:+2 } }
    ]
  },

  // --- Young Adult extras ---
  {
    id: "ya_19",
    stage: "YoungAdult",
    age: 19,
    distance: 1040,
    laneOptions: [
      { id:"freshers_week", label:"Freshers", icon:"🎉", effects:{ happiness:+2, relationships:+1 } },
      { id:"side_hustle", label:"Side Hustle", icon:"🛒", effects:{ wealth:+1 } },
      { id:"study_group", label:"Study Group", icon:"👩\u200d🎓", effects:{ knowledge:+2 } }
    ]
  },
  {
    id: "ya_21",
    stage: "YoungAdult",
    age: 21,
    distance: 1100,
    laneOptions: [
      { id:"exchange", label:"Exchange", icon:"✈️", effects:{ knowledge:+1, happiness:+1, wealth:-1 } },
      { id:"start_up", label:"Start-up", icon:"🚀", effects:{ wealth:+2, happiness:-1 }, outcomes:[{ text:"Pivot needed (-1 😀)", probability:0.4, effects:{ happiness:-1 } }] },
      { id:"dating", label:"Dating", icon:"💘", effects:{ relationships:+2 } }
    ]
  },
  {
    id: "ya_23",
    stage: "YoungAdult",
    age: 23,
    distance: 1160,
    laneOptions: [
      { id:"thesis", label:"Thesis", icon:"📚", effects:{ knowledge:+2, happiness:-1 } },
      { id:"intern_to_fulltime", label:"Full-time", icon:"💼", effects:{ wealth:+2 } },
      { id:"roommates", label:"Roommates", icon:"👥", effects:{ happiness:+1, wealth:+1 } }
    ]
  },
  {
    id: "ya_24",
    stage: "YoungAdult",
    age: 24,
    distance: 1180,
    laneOptions: [
      { id:"grad_trip", label:"Grad Trip", icon:"🧳", effects:{ happiness:+2, wealth:-1 } },
      { id:"cert_course", label:"Certificate", icon:"🎓", effects:{ knowledge:+1, wealth:-1 } },
      { id:"save_up", label:"Save Up", icon:"🏦", effects:{ wealth:+2 } }
    ]
  },

  // --- Adult extras ---
  {
    id: "adult_26",
    stage: "Adult",
    age: 26,
    distance: 1220,
    laneOptions: [
      { id:"move_city", label:"Move City", icon:"🏙️", effects:{ happiness:+1, wealth:-1 } },
      { id:"buy_car", label:"Buy Car", icon:"🚙", effects:{ wealth:-2, happiness:+1 } },
      { id:"gym_routine", label:"Gym", icon:"🏋️", effects:{ health:+2 } }
    ]
  },
  {
    id: "adult_30",
    stage: "Adult",
    age: 30,
    distance: 1300,
    laneOptions: [
      { id:"promotion_push", label:"Promotion", icon:"📈", effects:{ wealth:+2, happiness:-1 } },
      { id:"home_purchase", label:"Buy Home", icon:"🏠", effects:{ wealth:-2, happiness:+1 }, outcomes:[{ text:"Maintenance (-1 💰)", probability:0.5, effects:{ wealth:-1 } }] },
      { id:"volunteer", label:"Volunteer", icon:"🌱", effects:{ relationships:+1, happiness:+1 } }
    ]
  },
  {
    id: "adult_35",
    stage: "Adult",
    age: 35,
    distance: 1400,
    laneOptions: [
      { id:"switch_career", label:"Switch Career", icon:"🔄", effects:{ knowledge:+1, wealth:-1 } },
      { id:"raise_family", label:"Family", icon:"👨\u200d👩\u200d👧", effects:{ relationships:+2, happiness:+1 } },
      { id:"invest_index", label:"Invest", icon:"📊", effects:{ wealth:+2 } }
    ]
  },
  {
    id: "adult_40",
    stage: "Adult",
    age: 40,
    distance: 1500,
    laneOptions: [
      { id:"health_check", label:"Checkup", icon:"🩺", effects:{ health:+1 } },
      { id:"mentor", label:"Mentor", icon:"🧑\u200d🏫", effects:{ relationships:+1, knowledge:+1 } },
      { id:"sabbatical", label:"Sabbatical", icon:"🌴", effects:{ happiness:+2, wealth:-2 } }
    ]
  },
  {
    id: "adult_45",
    stage: "Adult",
    age: 45,
    distance: 1600,
    laneOptions: [
      { id:"start_nonprofit", label:"Nonprofit", icon:"🤝", effects:{ relationships:+2, happiness:+1, wealth:-1 } },
      { id:"big_project", label:"Big Project", icon:"🏗️", effects:{ wealth:+2, happiness:-1 } },
      { id:"world_travel", label:"World Trip", icon:"🌍", effects:{ happiness:+2, wealth:-2 } }
    ]
  },
  {
    id: "adult_50",
    stage: "Adult",
    age: 50,
    distance: 1700,
    laneOptions: [
      { id:"health_reset", label:"Health Reset", icon:"🥗", effects:{ health:+2, happiness:+1 } },
      { id:"teach", label:"Teach", icon:"📚", effects:{ knowledge:+1, relationships:+1 } },
      { id:"renovate", label:"Renovate", icon:"🛠️", effects:{ happiness:+1, wealth:-1 } }
    ]
  },
  {
    id: "adult_55",
    stage: "Adult",
    age: 55,
    distance: 1780,
    laneOptions: [
      { id:"grandad", label:"Grandkids", icon:"🧒", effects:{ relationships:+2, happiness:+1 } },
      { id:"consulting", label:"Consulting", icon:"💼", effects:{ wealth:+2, happiness:-1 } },
      { id:"hobby_club", label:"Hobby Club", icon:"🎨", effects:{ happiness:+2 } }
    ]
  },
  {
    id: "adult_60",
    stage: "Adult",
    age: 60,
    distance: 1860,
    laneOptions: [
      { id:"downshift", label:"Downshift", icon:"🧘", effects:{ happiness:+2, wealth:-1 } },
      {
        id:"alpine_trek",
        label:"Alpine Trek",
        icon:"🥾",
        effects:{ health:+1, happiness:+1 },
        outcomes: [
          { text:"Injury (-1 💚)", probability:0.18, effects:{ health:-1 } },
          { text:"Altitude sickness (fatal)", probability:0.02, fatal:true }
        ]
      },
      { id:"write_book", label:"Write Book", icon:"🖋️", effects:{ knowledge:+1, happiness:+1 } }
    ]
  },
  {
    id: "adult_64",
    stage: "Adult",
    age: 64,
    distance: 1920,
    laneOptions: [
      { id:"retire_plan", label:"Retire Plan", icon:"📅", effects:{ wealth:+1, happiness:+1 } },
      { id:"final_push", label:"Final Push", icon:"🏁", effects:{ wealth:+2, happiness:-1 } },
      { id:"community", label:"Community", icon:"🏘️", effects:{ relationships:+2 } }
    ]
  },

  // --- Old Age extras ---
  {
    id: "old_65",
    stage: "OldAge",
    age: 65,
    distance: 2000,
    laneOptions: [
      { id:"retire", label:"Retire", icon:"🛎️", effects:{ happiness:+2, wealth:-1 } },
      { id:"part_time", label:"Part-time", icon:"🕰️", effects:{ wealth:+1 } },
      { id:"clinic_vol", label:"Volunteer", icon:"🏥", effects:{ relationships:+1, happiness:+1 } }
    ]
  },
  {
    id: "old_70",
    stage: "OldAge",
    age: 70,
    distance: 2080,
    laneOptions: [
      { id:"garden", label:"Garden", icon:"🌼", effects:{ happiness:+2 } },
      {
        id:"travel_easy",
        label:"Coach Tour",
        icon:"🚌",
        effects:{ happiness:+1, wealth:-1 },
        outcomes: [
          { text:"Lovely tour", probability:0.985 },
          { text:"Coach accident (fatal)", probability:0.015, fatal:true }
        ]
      },
      { id:"read_club", label:"Book Club", icon:"📘", effects:{ knowledge:+1, relationships:+1 } }
    ]
  },
  {
    id: "old_75",
    stage: "OldAge",
    age: 75,
    distance: 2160,
    laneOptions: [
      {
        id:"slow_hikes",
        label:"Slow Hikes",
        icon:"🚶",
        effects:{ health:+1 },
        outcomes: [
          { text:"Refreshing walk", probability:0.98, effects:{ health:+1 } },
          { text:"Sudden health event (fatal)", probability:0.02, fatal:true }
        ]
      },
      { id:"family_time", label:"Family Time", icon:"👨\u200d👩\u200d👧\u200d👦", effects:{ relationships:+2, happiness:+1 } },
      { id:"art_class", label:"Art Class", icon:"🎭", effects:{ happiness:+1, knowledge:+1 } }
    ]
  },
  {
    id: "old_80",
    stage: "OldAge",
    age: 80,
    distance: 2240,
    laneOptions: [
      { id:"memoir", label:"Memoir", icon:"📓", effects:{ knowledge:+1, happiness:+1 } },
      { id:"quiet_days", label:"Quiet Days", icon:"🕯️", effects:{ happiness:+1 } },
      { id:"big_family", label:"Reunion", icon:"🎊", effects:{ relationships:+2, happiness:+1 } }
    ]
  }
];

const AUTHORED_AGE_SET = new Set(
  AUTHORED_GATES
    .filter(g => Number.isFinite(g.age))
    .map(g => g.age)
);

const STAGE_DISTANCE = {
  Childhood: { start:0, base:240, step:40 },
  Teen: { start:13, base:700, step:40 },
  YoungAdult: { start:18, base:980, step:40 },
  Adult: { start:25, base:1180, step:60 },
  OldAge: { start:65, base:1980, step:80 }
};

function distanceFor(stage, age){
  const spec = STAGE_DISTANCE[stage];
  if (!spec) return 0;
  return spec.base + (age - spec.start) * spec.step;
}

function cloneGate(gate){
  return JSON.parse(JSON.stringify(gate));
}

const GATES_WITH_SAMPLES = AUTHORED_GATES.map(g => {
  const cloned = cloneGate(g);
  const sanitized = sanitizeGate(cloned, { expectedAge: cloned.age });
  return { ...sanitized, distance: cloned.distance, source: "authored" };
});
for (let age = 0; age <= 80; age++) {
  if (AUTHORED_AGE_SET.has(age)) continue;
  const stage = ageToStage(age);
  const sample = buildSampleGate(age, stage);
  GATES_WITH_SAMPLES.push({ ...sample, distance: distanceFor(stage, age), source: "sample" });
}

export const GATES = GATES_WITH_SAMPLES;
export { AUTHORED_GATES };

const GATE_LOOKUP = new Map();
for (const gate of GATES_WITH_SAMPLES) {
  if (!Number.isFinite(gate?.age)) continue;
  const stage = gate.stage || ageToStage(gate.age);
  const key = `${stage}:${gate.age}`;
  const stored = GATE_LOOKUP.get(key);
  if (!stored || stored.source === "sample") {
    GATE_LOOKUP.set(key, gate);
  }
}

const SAMPLE_LOOKUP = new Map();
for (const gate of GATES_WITH_SAMPLES) {
  if (gate.source === "sample" && Number.isFinite(gate.age)) {
    SAMPLE_LOOKUP.set(`${gate.stage}:${gate.age}`, gate);
  }
}

export function getGateForStageAge(stage, age){
  const key = `${stage}:${age}`;
  const gate = GATE_LOOKUP.get(key);
  return gate ? cloneGate(gate) : null;
}

export function getGateForAge(age){
  const stage = ageToStage(age);
  return getGateForStageAge(stage, age);
}

export function getSampleGate(age){
  const stage = ageToStage(age);
  const key = `${stage}:${age}`;
  const gate = SAMPLE_LOOKUP.get(key);
  if (gate) return cloneGate(gate);
  const generated = buildSampleGate(age, stage);
  return { ...generated, distance: distanceFor(stage, age), source: "sample" };
}

export function hasAuthoredGate(stage, age){
  const key = `${stage}:${age}`;
  const gate = GATE_LOOKUP.get(key);
  return !!gate && gate.source !== "sample";
}

export function getAuthoredGate(stage, age){
  const key = `${stage}:${age}`;
  const gate = GATE_LOOKUP.get(key);
  if (gate && gate.source !== "sample") return cloneGate(gate);
  return null;
}
