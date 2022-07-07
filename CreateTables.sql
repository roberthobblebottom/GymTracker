BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "set_of_sets" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"exercise"	BLOB NOT NULL,
	"reps"	INTEGER NOT NULL CHECK(reps>0),
	"percent_complete"	INTEGER NOT NULL DEFAULT 0 CHECK((percent_complete>=0 AND percent_complete<=100)),
	"sets"	INTEGER CHECK(sets>0),
	"duration_in_seconds"	INTEGER CHECK(duration_in_seconds>0),
	"weight"	INTEGER,
	"notes"	TEXT,
	FOREIGN KEY("exercise") REFERENCES "exercise"("name")
);
CREATE TABLE IF NOT EXISTS "exercise_major_muscle_one_to_many" (
	"id"	INTEGER,
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
INSERT INTO "exercise" VALUES ('Conventional Deadlift',NULL,NULL);
INSERT INTO "exercise" VALUES ('Romanian Deadlift',NULL,NULL);
INSERT INTO "exercise" VALUES ('Straight-legged Deadlift',NULL,NULL);
INSERT INTO "exercise" VALUES ('Sumo Deadlift',NULL,NULL);
INSERT INTO "exercise" VALUES ('Trap Bar Deadlift',NULL,NULL);
INSERT INTO "exercise" VALUES ('Back Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Front Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Box Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Sumo Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Overhead Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Split Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Smoth Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Bodyweight Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Jump Squat',NULL,NULL);
INSERT INTO "exercise" VALUES ('Flat Barbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Incline Barbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Decline Barbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Flat Dumbbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Incline Dumbbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Decline Dumbbell Bench Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Chest Fly',NULL,NULL);
INSERT INTO "exercise" VALUES ('Dips',NULL,NULL);
INSERT INTO "exercise" VALUES ('Pull-up',NULL,NULL);
INSERT INTO "exercise" VALUES ('Pull-down',NULL,NULL);
INSERT INTO "exercise" VALUES ('Chin-up',NULL,NULL);
INSERT INTO "exercise" VALUES ('Muscle-up',NULL,NULL);
INSERT INTO "exercise" VALUES ('Seated Row',NULL,NULL);
INSERT INTO "exercise" VALUES ('Face Pull',NULL,NULL);
INSERT INTO "exercise" VALUES ('Shoulder Shrug',NULL,NULL);
INSERT INTO "exercise" VALUES ('Upright Row',NULL,NULL);
INSERT INTO "exercise" VALUES ('Bent-over Row',NULL,NULL);
INSERT INTO "exercise" VALUES ('Bridge',NULL,NULL);
INSERT INTO "exercise" VALUES ('Front raise',NULL,NULL);
INSERT INTO "exercise" VALUES ('lateral Raise',NULL,NULL);
INSERT INTO "exercise" VALUES ('Military Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Overhead Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Biceps Curl',NULL,NULL);
INSERT INTO "exercise" VALUES ('Wirst Curl',NULL,NULL);
INSERT INTO "exercise" VALUES ('Crunch',NULL,NULL);
INSERT INTO "exercise" VALUES ('Leg Raise',NULL,NULL);
INSERT INTO "exercise" VALUES ('Sit-Up',NULL,NULL);
INSERT INTO "exercise" VALUES ('Plank',NULL,NULL);
INSERT INTO "exercise" VALUES ('Good-morning',NULL,NULL);
INSERT INTO "exercise" VALUES ('Hyperextension',NULL,NULL);
INSERT INTO "exercise" VALUES ('Leg Press',NULL,NULL);
INSERT INTO "exercise" VALUES ('Lunge',NULL,NULL);
INSERT INTO "exercise" VALUES ('Calf Raise',NULL,NULL);
COMMIT;
