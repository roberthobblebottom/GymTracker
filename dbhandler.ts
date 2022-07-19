import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-simple-toast';
const db = SQLite.openDatabase("exercisetracker");
function init() {
    db.transaction(t =>
        t.executeSql('SELECT 1 FROM sqlite_master WHERE type = ? AND name = ?',
            ['table', 'exercise'],
            (_, r) => {
                if (r.rows.item(0) === undefined) createData(false);
                // else console.log("init(): tables and data are already present");
            }
        ));
}
function createData(showResetAlert: boolean) {
    console.log("creating tables and inserting data");
    let splittedCommands: Array<string> = commands.split(";");
    splittedCommands.forEach(c => db.transaction(t => t.executeSql(c, undefined, undefined,
        (_, e) => { console.log(e); return true }
    )))
    if (showResetAlert) Toast.show("Database had been reset.");
  }
function resetTables() {
    console.log("resetting tables");
    db.transaction(t => t.executeSql("DROP TABLE if exists exercise"));
    db.transaction(t => t.executeSql('DROP TABLE if exists major_muscle'));
    db.transaction(t => t.executeSql('DROP TABLE if exists major_sets'));
    db.transaction(t => t.executeSql('DROP TABLE if exists exercise_major_muscle_one_to_many'));
    
    console.log("droped tables");
    createData(true);
}

export { resetTables, init, db };//TODO: remove dropTables in production.
const commands = `
CREATE TABLE IF NOT EXISTS "major_sets" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"exercise"	TEXT NOT NULL,
	"reps"	INTEGER NOT NULL CHECK(reps>=0),
	"percent_complete"	INTEGER NOT NULL DEFAULT 0 CHECK((percent_complete>=0 AND percent_complete<=100)),
	"sets"	INTEGER CHECK(sets>=0),
	"duration_in_seconds"	INTEGER CHECK(duration_in_seconds>=0),
	"weight"	INTEGER CHECK(weight>=0),
	"notes"	TEXT,
    "date" TEXT,
	FOREIGN KEY("exercise") REFERENCES "exercise"("name")
);
;
CREATE TABLE IF NOT EXISTS "major_muscle" (
	"name"	TEXT NOT NULL,
	"notes"	TEXT,
	"images_json"	TEXT,
	PRIMARY KEY("name")
);
CREATE TABLE IF NOT EXISTS "exercise" (
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"imagesJson"	TEXT,
	PRIMARY KEY("name")
);
CREATE TABLE IF NOT EXISTS "exercise_major_muscle_one_to_many" (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"exercise_name"	TEXT NOT NULL,
	"major_muscle_name"	TEXT NOT NULL,
	FOREIGN KEY("exercise_name") REFERENCES "exercise"("name"),
	FOREIGN KEY("major_muscle_name") REFERENCES "major_muscle"("name")
);
INSERT INTO "major_muscle" VALUES ('Chest','Also called Pectorals.',NULL);
INSERT INTO "major_muscle" VALUES ('Lats','Latissimus dorsi muscle',NULL);
INSERT INTO "major_muscle" VALUES ('Trapezius','Upper Back',NULL);
INSERT INTO "major_muscle" VALUES ('Deltoids','Shoulders',NULL);
INSERT INTO "major_muscle" VALUES ('Biceps','Front of arms.',NULL);
INSERT INTO "major_muscle" VALUES ('Triceps','Back of arms.',NULL);
INSERT INTO "major_muscle" VALUES ('Forearm','',NULL);
INSERT INTO "major_muscle" VALUES ('Abdomen','',NULL);
INSERT INTO "major_muscle" VALUES ('Obliques','',NULL);
INSERT INTO "major_muscle" VALUES ('Lower Back','',NULL);
INSERT INTO "major_muscle" VALUES ('Hips','',NULL);
INSERT INTO "major_muscle" VALUES ('Gluts','Also called Buttocks.',NULL);
INSERT INTO "major_muscle" VALUES ('Quadriceps','Front of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Hamstring','Back of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Adductors','Inside of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Calves','',NULL);

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Back Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Box Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Split Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Smoth Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bodyweight Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Jump Squat','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Barbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Barbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Barbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Dumbbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Dumbbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Dumbbell Bench Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chest Fly','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Dips','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-up','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-down','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chin-up','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Muscle-up','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Seated Row','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Face Pull','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Shoulder Shrug','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Upright Row','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bent-over Row','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bridge','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front raise','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('lateral Raise','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Military Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Biceps Curl','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Wirst Curl','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Crunch','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Raise','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sit-Up','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Plank','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Good-morning','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Hyperextension','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Lunge','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Calf Raise','Calves');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Shoulder Shrug','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Upright Row','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bent-over Row','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bridge','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front raise','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('lateral Raise','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Military Press','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Press','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Biceps Curl','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Wirst Curl','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Crunch','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Raise','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sit-Up','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Plank','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Good-morning','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Hyperextension','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Lunge','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Calf Raise','Hamstring');
INSERT INTO "exercise" VALUES ('Conventional Deadlift','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Romanian Deadlift','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Straight-legged Deadlift','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sumo Deadlift','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Trap Bar Deadlift','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Back Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Front Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Box Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sumo Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Overhead Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Split Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Smoth Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bodyweight Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Jump Squat','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Flat Barbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Incline Barbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Decline Barbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Flat Dumbbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Incline Dumbbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Decline Dumbbell Bench Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Chest Fly','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Dips','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Pull-up','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Pull-down','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Chin-up','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Muscle-up','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Seated Row','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Face Pull','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Shoulder Shrug','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Upright Row','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bent-over Row','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bridge','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Front raise','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('lateral Raise','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Military Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Overhead Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Biceps Curl','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Wirst Curl','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Crunch','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Raise','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sit-Up','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Plank','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Good-morning','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Hyperextension','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Press','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Lunge','TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Calf Raise','TESTING DESCRIPTION',"{}");

`;