import "reflect-metadata";
import { DataSource } from "typeorm";
import { Exercise } from "./entities/Exercise";
import { MajorMuscles } from "./entities/MajorMuscles";
import { SetOfSets } from "./entities/SetsOfSets";

export const AppDataSource = new DataSource({
    type: "expo",
    database: "GymTracker",
    driver: require("expo-sqlite"),
    entities: [Exercise, MajorMuscles, SetOfSets],
    migrations: ['migrations/PreloadingData.tsx'],
    synchronize: false,
    migrationsRun: true,
    logging: false,
});
AppDataSource.initialize()
    .then(async () => {
        await AppDataSource.runMigrations()
            .then(async () => {
                const m = await AppDataSource.getRepository(Exercise).findAndCount();
                await console.log(m);
            })
            .catch((err) => console.log(err));
    })
    .catch((err) => 
        console.error(err + "Error during data source init.")
    );
