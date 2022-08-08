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
function deleteFromExerciseAndScheduledItem() {
    db.transaction(t => t.executeSql('DELETE FROM exercise'))
    db.transaction(t => t.executeSql('DELETE FROM scheduled_item'))
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

export { resetTables, init, db ,deleteFromExerciseAndScheduledItem}
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
INSERT INTO "major_muscle" VALUES ('Abdominals','Inside of thighs.',NULL);
INSERT INTO "major_muscle" VALUES ('Calves','Between foot and knee.',NULL);
INSERT INTO "exercise" VALUES ('Conventional Deadlift',"Pull",'The deadlift is a weight training exercise in which a loaded barbell or bar is lifted off the ground to the level of the hips, torso perpendicular to the floor, before being placed back on the ground.',"{}");
INSERT INTO "exercise" VALUES ('Romanian Deadlift',"Pull",'From the standing position, the bar is lowered to about knee-height where the hamstrings are at maximal stretch without rounding the back, developing a natural bend in the legs without squatting, then come to a full lockout position.',"{}");
INSERT INTO "exercise" VALUES ('Straight-legged Deadlift',"Pull",'The grounded-bar start and end positions are modified to make the legs as straight as possible without rounding the back.',"{}");
INSERT INTO "exercise" VALUES ('Sumo Deadlift',"Pull",'The Sumo deadlift is a variation where one will approach the bar with the feet wider than shoulder-width apart and grip the bar with a close grip inside of one''s legs and proceed with correct form. ',"{}");
INSERT INTO "exercise" VALUES ('Trap Bar Deadlift',"Pull",'The trap bar deadlift is a variation of the deadlift using a special hexagonal bar (a trap bar). This allows more clearance for the knees to pass ''through'' the bar. To perform the trapbar deadlift, one should load the bar, step inside the hollow portion of the bar, bend down, grasp the handles, stand erect, then lower the bar to the ground in the exact opposite path.During the descent of a squat, the hip and knee joints flex while the ankle joint dorsiflexes. conversely the hip and knee joints extend and the ankle joint plantarflexes when standing up. ',"{}");
INSERT INTO "exercise" VALUES ('Back Squat',"Pull",' the bar is held on the back of the body upon the upper trapezius muscle, near to the base of the neck. Alternatively, it may be held lower across the upper back and rear deltoids. ',"{}");
INSERT INTO "exercise" VALUES ('Front Squat',"Push",'A variant of squat where the barbell is held in front of the body across the clavicles and deltoids in either a clean grip, as is used in weightlifting, or with the arms crossed and hands placed on top of the barbell.',"{}");
INSERT INTO "exercise" VALUES ('Box Squat',"Push",' A variant of squat where at the bottom of the motion the squatter will sit down on a bench or other type of support then rise again.',"{}");
INSERT INTO "exercise" VALUES ('Sumo Squat',"Push",'In this variation legs are wider than shoulder width.',"{}");
INSERT INTO "exercise" VALUES ('Overhead Squat',"Push",'the barbell is held overhead in a wide-arm snatch grip, however, it is also possible to use a closer grip if balance allows.',"{}");
INSERT INTO "exercise" VALUES ('Split Squat',"Push",' an assisted one-legged squat where the non-lifting leg is rested on the ground a few steps behind the lifter, as if it were a static lunge.',"{}");
INSERT INTO "exercise" VALUES ('Smith Squat',"Push",'Squat using a Smith machine.',"{}");
INSERT INTO "exercise" VALUES ('Bodyweight Squat',"Push",'Squats without additional barbell, dumbell or etc weights',"{}");
INSERT INTO "exercise" VALUES ('Jump Squat',"Push",'a plyometrics exercise where the squatter engages in a rapid eccentric contraction and jumps forcefully off the floor at the top of the range of motion.',"{}");
INSERT INTO "exercise" VALUES ('Flat Barbell Bench Press',"Push",'A weight training exercise in which the trainee presses a (loaded) barbell upwards while lying on a weight training bench.',"{}");
INSERT INTO "exercise" VALUES ('Incline Barbell Bench Press',"Push",'An incline is just like the flat barbell bench press but it elevates the shoulders and lowers the pelvis as if reclining in a chair.',"{}");
INSERT INTO "exercise" VALUES ('Decline Barbell Bench Press',"Push",'A decline bench press elevates the pelvis and lowers the head, and emphasizes the lower portion of the pectoralis major whilst incorporating shoulders and triceps.',"{}");
INSERT INTO "exercise" VALUES ('Flat Dumbbell Bench Press',"Push",'A weight training exercise in which the trainee presses (loaded) dumbbells ono each hands upwards while lying on a weight training bench.',"{}");
INSERT INTO "exercise" VALUES ('Incline Dumbbell Bench Press',"Push",'An incline is just like the flat barbell bench press but it elevates the shoulders and lowers the pelvis as if reclining in a chair.',"{}");
INSERT INTO "exercise" VALUES ('Decline Dumbbell Bench Press',"Push",'A decline dumbell bench press elevates the pelvis and lowers the head, and emphasizes the lower portion of the pectoralis major whilst incorporating shoulders and triceps.',"{}");
INSERT INTO "exercise" VALUES ('Chest Fly',"Push",'The chest fly or pectoral fly (abbreviated to pec fly) primarily works the pectoralis major muscles to move the arms horizontally forward.',"{}");
INSERT INTO "exercise" VALUES ('Dips',"Push",'To perform a dip, the exerciser supports themselves on a dip bar with their arms straight down and shoulders over their hands, then lowers their body until their arms are bent to a 90 degree angle at the elbows, and then lifts their body up, returning to the starting position. ',"{}");
INSERT INTO "exercise" VALUES ('Pull-up',"Pull",'The pull-up is a closed-chain movement where the body is suspended by the hands with forward grip and pulls up. As this happens, the elbows flex and the shoulders adduct and extend to bring the elbows to the torso.',"{}");
INSERT INTO "exercise" VALUES ('Pull-down',"Pull",'',"{}");
INSERT INTO "exercise" VALUES ('Chin-up',"Pull",'The chin up is a closed-chain movement where the body is suspended by the hands with reverse grip and pulls up. As this happens, the elbows flex and the shoulders adduct and extend to bring the elbows to the torso.',"{}");
INSERT INTO "exercise" VALUES ('Muscle-up',"Pull",'A pull-up with a maximal range of motion, transitioning to a dip. ',"{}");
INSERT INTO "exercise" VALUES ('Seated Row',"Pull",'An exercise where the purpose is to strengthen the muscles that draw the rower''s arms toward the body (latissimus dorsi) as well as those that retract the scapulae (trapezius and rhomboids) and those that support the spine (erector spinae).',"{}");
INSERT INTO "exercise" VALUES ('Face Pull',"Pull",'The face pull is often performed standing using a cable machine and rope attachment, with the subject rowing the rope attachment towards the face, with the elbows flared outwards',"{}");
INSERT INTO "exercise" VALUES ('Shoulder Shrug',"Pull",'The lifter stands erect, hands about shoulder width apart, and slowly raises the shoulders as high as possible, and then slowly lowers them, while not bending the elbows, or moving the body at all.',"{}");
INSERT INTO "exercise" VALUES ('Upright Row',"Pull",'The upright row is a weight training exercise performed by holding a weight with an overhand grip and lifting it straight up to the collarbone',"{}");
INSERT INTO "exercise" VALUES ('Bent-over Row',"Pull",'',"{}");
INSERT INTO "exercise" VALUES ('Front raise',"Pull",'To execute the exercise, the lifter stands with their feet shoulder width apart and weights or resistance handles held by their side with a pronated (overhand) grip. ',"{}");
INSERT INTO "exercise" VALUES ('lateral Raise',"Pull",'The movement starts with the arms straight, and the hands holding weights at the sides or in front of the body. Body is in a slight forward-leaning position with hips and knees bent a little. Arms are kept straight or slightly bent, and raised through an arc of movement in the coronal plane that terminates when the hands are at approximately shoulder height',"{}");
INSERT INTO "exercise" VALUES ('Overhead Press',"Push",'The lift is set up by taking either a barbell, a pair of dumbbells or kettlebells, and holding them at shoulder level. The weight is then pressed overhead. While the exercise can be performed standing or seated, standing recruits more muscles as more balancing is required in order to support the lift.',"{}");
INSERT INTO "exercise" VALUES ('Biceps Curl',"Pull",'A biceps curl usually starts with the arm in a fully extended position, holding a weight with a supinated (palms facing up) grip. A full repetition consists of bending or "curling" the elbow until it is fully flexed, then slowly lowering the weight to the starting position. ',"{}");
INSERT INTO "exercise" VALUES ('Wirst Curl',"Pull",'To perform a seated wrist curl, the lifter should be seated on a bench with knees bent and the forearm(s) resting on the thigh, or with forearms on a bench and hands hanging off the edge. The palm should be facing up and the hand should be free to move completely up and down. At the starting point, the wrist should be bent back so that the fingers are almost pointing down at the floor. In a steady motion, the lifter should raise the weight by using the forearm muscles to bring the hand up as far as possible. The forearm itself should remain resting on the thigh. Then the weight should be slowly lowered back down to the starting point. ',"{}");
INSERT INTO "exercise" VALUES ('Crunch',"Push",'',"{}");
INSERT INTO "exercise" VALUES ('Leg Raise',"Push",'The lying leg raise is done by lying on the floor on the back. It is done without apparatus except possibly cushions or weights for added resistance.  There are other variants',"{}");
INSERT INTO "exercise" VALUES ('Sit-Up',"Pull",'It begins with lying with the back on the floor, typically with the arms across the chest or hands behind the head and the knees and toes bent in an attempt to reduce stress on the back muscles and spine, and then elevating both the upper and lower vertebrae from the floor until everything superior to the buttocks is not touching the ground. ',"{}");
INSERT INTO "exercise" VALUES ('Plank',"Push",'An isometric core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time. ',"{}");
INSERT INTO "exercise" VALUES ('Good-morning',"Pull",'One starts with a barbell held on one''s shoulders, behind the head. Similar to a back squat, there is some variation with the height on the back at which the bar is held. Holding the bar lower on the back decreases the distance to the pelvis and decreases the strain on the hip and spine extensors: a low bar position allows one to lift heavier weights while a high position allows one to stress the muscles harder with a lighter weight. ',"{}");
INSERT INTO "exercise" VALUES ('Hyperextension',"Pull",'',"{}");
INSERT INTO "exercise" VALUES ('Leg Press',"Push",'Raise legs while lying down. There are other variants too.',"{}");
INSERT INTO "exercise" VALUES ('Lunge',"Push",'A lunge can refer to any position of the human body where one leg is positioned forward with knee bent and foot flat on the ground while the other leg is positioned behind.',"{}");
INSERT INTO "exercise" VALUES ('Calf Raise',"Push",'',"{}");
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Conventional Deadlift','Lower Back');


INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Romanian Deadlift','Lower Back');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Deadlift','Lower Back');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Straight-legged Deadlift','Lower Back');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Trap Bar Deadlift','Lower Back');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Back Squad','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Back Squad','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Back Squad','Abdominals');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front Squad','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front Squad','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front Squad','Abdominals');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Squad','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Squad','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sumo Squad','Abdominals');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bodyweight Squat','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bodyweight Squat','Gluts');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bodyweight Squat','Abdominals');



INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Box Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Split Squat','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Jump Squat','Hamstring');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Barbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Dumbbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Dumbbell Bench Press','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Dumbbell Bench Press','Chest');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Barbell Bench Press','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Barbell Bench Press','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Barbell Bench Press','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Flat Dumbbell Bench Press','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Incline Dumbbell Bench Press','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Decline Dumbbell Bench Press','Triceps');



INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chest Fly','Chest');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Dips','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-up','Lats');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-up','Biceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-down','Lats');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Pull-down','Biceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chin-up','Lats');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Chin-up','Biceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Muscle-up','Lats');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Muscle-up','Biceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Muscle-up','Triceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Seated Row','Lats');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Seated Row','Trapezius');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Face Pull','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Shoulder Shrug','Trapezius');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Shoulder Shrug','Deltoids');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Upright Row','Trapezius');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Upright Row','Deltoids');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Bent-over Row','Lats');




INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Front raise','Deltoids');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('lateral Raise','Deltoids');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Overhead Press','Deltoids');




INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Biceps Curl','Biceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Wirst Curl','Forearms');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Crunch','Abdominals');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Raise','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Sit-Up','Abdominals');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Plank','Abdominals');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Good-morning','Lower Back');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Hyperextension','Lower Back');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Calves');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Leg Press','Abdominals');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Lunge','Hamstring');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Lunge','Quadriceps');
INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Lunge','Gluts');

INSERT INTO "exercise_major_muscle_one_to_many" ('exercise_name','major_muscle_name') VALUES ('Calf Raise','Calves');



`;