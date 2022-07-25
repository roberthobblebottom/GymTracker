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
INSERT INTO "exercise" VALUES ('Conventional Deadlift',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Romanian Deadlift',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Straight-legged Deadlift',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sumo Deadlift',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Trap Bar Deadlift',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Back Squat',"Push",'TESTING DESCRIPTION',"{}");
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
INSERT INTO "exercise" VALUES ('Pull-up',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Pull-down',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Chin-up',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Muscle-up',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Seated Row',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Face Pull',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Shoulder Shrug',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Upright Row',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bent-over Row',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Bridge',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Front raise',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('lateral Raise',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Military Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Overhead Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Biceps Curl',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Wirst Curl',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Crunch',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Raise',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Sit-Up',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Plank',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Good-morning',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Hyperextension',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Leg Press',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Lunge',"Push",'TESTING DESCRIPTION',"{}");
INSERT INTO "exercise" VALUES ('Calf Raise',"Push",'TESTING DESCRIPTION',"{}");

