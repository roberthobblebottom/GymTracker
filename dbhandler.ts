import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-simple-toast';
import FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';
import { Exercise, ScheduledItem } from './types';
import { SQLStatementCallback } from 'expo-sqlite';
const db = SQLite.openDatabase('GymTracker.db');
function init() {
    // resetTables();
    db.transaction(t =>
        t.executeSql('SELECT 1 FROM sqlite_master WHERE type = ? AND name = ?',
            ['table', 'exercise'],
            (_, r) => {
                if (r.rows.item(0) === undefined) createData(false);
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
    db.transaction(t => t.executeSql('DROP TABLE if exists scheduled_item'));
    db.transaction(t => t.executeSql('DROP TABLE if exists exercise_major_muscle_one_to_many'));

    console.log("droped tables");
    createData(true);
}
// async function openDatabase():Promise<SQLite.WebSQLDatabase> {
//     if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
//       await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
//     }
//     await FileSystem.downloadAsync(
//       Asset.Asset.fromModule(require())).uri,
//       FileSystem.documentDirectory + 'SQLite/GymTracker.db'
//     );
//     // return SQLite.openDatabase('GymTracker.db');
//   }


export const createScheduledItem = (si: ScheduledItem, dbCallback?: SQLStatementCallback) => {
    db.transaction(t => {
        t.executeSql(`INSERT INTO scheduled_item
           (exercise,reps,percent_complete,sets,duration_in_seconds,weight,notes,date)  
           VALUES(?,?,?,?,?,?,?,?)`,
            [si.exercise.name, si.reps, si.percent_complete, si.sets,
            si.duration_in_seconds, si.weight,
            si.notes, JSON.stringify(si.date)],
            dbCallback,
            (_, e) => { console.log(e); return true }
        )
    })
}
export const retrieveScheduledItems = (dbCallback: SQLStatementCallback) => {
    db.transaction(
        t => t.executeSql("SELECT * FROM scheduled_item", [],
            dbCallback,
            (_, err) => { console.log(err); return true; })
    )
}
export const updateScheduledItem = (si: ScheduledItem, dbCallback?: SQLStatementCallback) => {
    db.transaction(t => t.executeSql(`UPDATE scheduled_item 
    SET exercise=?,reps=?,percent_complete=?,sets=?,duration_in_seconds=?,weight=?,notes=?,date=? 
    WHERE id=?`,
        [si.exercise.name, si.reps, si.percent_complete, si.sets,
        si.duration_in_seconds, si.weight,
        si.notes, JSON.stringify(si.date), si.id],
        dbCallback,
        (_, err) => { console.log(err); return true; }))
}

export let deleteScheduledItem = (id: number, dbCallback?: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("DELETE FROM scheduled_item where id= ?", [id],
        dbCallback,
        (_, err) => { console.log(err); return true; }))
}
export const createExerciseMajorMuscleRelationship = (exerciseName: string,
    majorMuscleName: string) => {
    console.log(exerciseName + majorMuscleName)
    db.transaction(t => t.executeSql(
        "INSERT INTO exercise_major_muscle_one_to_many (exercise_name, major_muscle_name)VALUES (?,?)",
        [exerciseName, majorMuscleName], undefined,
        (_, err) => { console.log(err); return true; }))
}
export const retrieveExerciseMajorMuscleRelationships = (dbCallBack: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("SELECT * from exercise_major_muscle_one_to_many;", undefined,
        dbCallBack, (_, err) => { console.log(err); return true; }))

}
export const deleteExerciseMajorMuscleRelationship = (exerciseName: string, majorMuscleName: string) => {
    db.transaction(t => t.executeSql(
        "DELETE FROM exercise_major_muscle_one_to_many WHERE exercise_name=? AND major_muscle_name=?",
        [exerciseName, majorMuscleName], undefined,
        (_, err) => { console.log(err); return true; }
    ))
}


export const createExercise = (exercise: Exercise, dbCallback?: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("INSERT INTO exercise VALUES (?,?,?,?)",
        [exercise.name, exercise.push_or_pull, exercise.description, exercise.imagesJson],
        dbCallback, (_, err) => { console.log(err); return true; }
    ))
}

export const retrieveExercises = (dbCallback: SQLStatementCallback) => {
    db.transaction(t => t.executeSql(
        "SELECT * from exercise", undefined, dbCallback,
        (_, e) => { console.log(e); return true; }
    ))
}

export const updateExercise = (exercise: Exercise, oldExerciseName: string, dbCallBack?: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("UPDATE exercise SET name = ?, description = ?,imagesJson=?,push_or_pull=? where name = ?",
        [exercise.name, exercise.description, exercise.imagesJson, exercise.push_or_pull, oldExerciseName],
        dbCallBack,
        (_, err) => { console.log(err); return true }))
}

export const deleteExercise = (exerciseName: string, dbCallback: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("DELETE FROM exercise where name= ?", [exerciseName],
        dbCallback,
        (_, err) => { console.log(err); return true; }
    ))
}

export const retrieveMajorMuscles = (dbCallback: SQLStatementCallback) => {
    db.transaction(t => t.executeSql("SELECT * from major_muscle", undefined,
        dbCallback, (_, err) => { console.log(err); return true; }))
}

export { resetTables, init, db }
const commands = `
CREATE TABLE IF NOT EXISTS "scheduled_item" (
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
"push_or_pull" TEXT NOT NULL,
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
INSERT INTO "major_muscle" VALUES ('Forearm','Between the hand and elbow',NULL);
INSERT INTO "major_muscle" VALUES ('Abdomen','Belly area below chest and above the crotch',NULL);
INSERT INTO "major_muscle" VALUES ('Obliques','The side of Obliques',NULL);
INSERT INTO "major_muscle" VALUES ('Lower Back','',NULL);
INSERT INTO "major_muscle" VALUES ('Hips','',NULL);
INSERT INTO "major_muscle" VALUES ('Gluts','Also called Buttocks.',NULL);
INSERT INTO "major_muscle" VALUES ('Quadriceps','Front of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Hamstring','Back of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Adductors','Inside of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Calves','Between foot and knee.',NULL);
INSERT INTO "exercise" VALUES ('Conventional Deadlift',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Romanian Deadlift',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Straight-legged Deadlift',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sumo Deadlift',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Trap Bar Deadlift',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Back Squat',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Front Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Box Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sumo Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Overhead Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Split Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Smoth Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bodyweight Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Jump Squat',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Flat Barbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Incline Barbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Decline Barbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Flat Dumbbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Incline Dumbbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Decline Dumbbell Bench Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Chest Fly',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Dips',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Pull-up',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Pull-down',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Chin-up',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Muscle-up',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Seated Row',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Face Pull',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Shoulder Shrug',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Upright Row',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bent-over Row',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bridge',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Front raise',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('lateral Raise',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Military Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Overhead Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Biceps Curl',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Wirst Curl',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Crunch',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Raise',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sit-Up',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Plank',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Good-morning',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Hyperextension',"Pull",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Lunge',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Calf Raise',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Back Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Box Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Split Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Smoth Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bodyweight Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Jump Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Dumbbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Dumbbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Dumbbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chest Fly','Chest');
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


`;