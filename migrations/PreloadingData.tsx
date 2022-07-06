import { MigrationInterface, QueryRunner } from "typeorm"

export class PreloadingData implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("up");
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Chest","Also called Pectorals.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Lats","Latissimus dorsi muscle")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Trapezius","Upper Back")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Deltoids","Shoulders")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Biceps","Front of arms.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Triceps","Back of arms.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Forearm","")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Abdomen","")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Obliques","")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Lower Back","")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Hips","")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Gluts","Also called Buttocks.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Quadriceps","Front of thighs.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Hamstring","Back of thighs.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Adductors","Inside of thighs.")',);
        await queryRunner.manager.query('INSERT INTO major_muscle VALUES ("Calves","")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Conventional Deadlift")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Romanian Deadlift")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Straight-legged Deadlift")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Sumo Deadlift")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Trap Bar Deadlift")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Back Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Front Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Box Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Sumo Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Overhead Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Split Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Smoth Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Bodyweight Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Jump Squat")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Flat Barbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Incline Barbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Decline Barbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Flat Dumbbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Incline Dumbbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Decline Dumbbell Bench Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Chest Fly")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Dips")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Pull-up")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Pull-down")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Chin-up")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Muscle-up")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Seated Row")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Face Pull")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Shoulder Shrug")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Upright Row")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Bent-over Row")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Bridge")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Front raise")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("lateral Raise")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Military Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Overhead Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Biceps Curl")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Wirst Curl")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Crunch")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Leg Raise")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Sit-Up")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Plank")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Good-morning")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Hyperextension")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Leg Press")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Lunge")',);
        await queryRunner.manager.query('INSERT INTO exercise (name) VALUES ("Calf Raise")',);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
