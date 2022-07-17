import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-simple-toast';
const db = SQLite.openDatabase("exercisetracker");
function init() {
    db.transaction(t =>
        t.executeSql('SELECT 1 FROM sqlite_master WHERE type = ? AND name = ?',
            ['table', 'exercise'],
            (_, r) => {
                if (r.rows.item(0) === undefined) createData(false);
                else console.log("init(): tables and data are already present");
            }
        ));
}
function createData(showResetAlert: boolean) {
    console.log("creating tables and inserting data");
    let splittedCommands: Array<string> = commands.split(";");
    splittedCommands.forEach(c => db.transaction(t => t.executeSql(c, undefined, undefined,
        (_, e) => { console.log(+ e); return true }
    )))
    if (showResetAlert) Toast.show("Database had been reset.");
    // db.transaction(t =>
    //     t.executeSql(
    //         'SELECT * FROM exercise;'
    //         , undefined
    //         , (_, result) => {
    //             console.log("---All exercise---");
    //             result.rows._array.forEach(e => console.log(e));
    //         }, (_, err) => {
    //             console.log(err);
    //             return true;
    //         }
    //     ));
    // db.transaction(t =>
    //     t.executeSql(
    //         'SELECT * FROM major_muscle;'
    //         , undefined
    //         , (_, result) => {
    //             console.log("--- All major_muscle ---");
    //             result.rows._array.forEach(e => console.log(e));
    //         }, (_, e) => {
    //             console.log(e);
    //             return true;
    //         }
    //     ));
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
CREATE TABLE IF NOT EXISTS "exercise_major_muscle_one_to_many" (
	"id"	INTEGER AUTOINCREMENT,
	"exercise_name"	TEXT NOT NULL,
	"major_muscle"	TEXT NOT NULL,
	FOREIGN KEY("exercise_name") REFERENCES "exercise_major_muscle_one_to_many"("name"),
	FOREIGN KEY("major_muscle") REFERENCES "major_muscle"("name"),
	PRIMARY KEY("id")
);
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