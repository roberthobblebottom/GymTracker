import {Entity,Column, PrimaryGeneratedColumn,OneToOne} from "typeorm/browser";
import {Exercise}  from "./Exercise";

@Entity("setOfSets")
export class SetOfSets{

    @PrimaryGeneratedColumn()
    id!:number;

    @OneToOne(()=> Exercise)
    @Column()
    exercise!: Exercise;

    @Column()
    reps!:number;

    @Column()
    percentComplete!:number;

    @Column()
    sets:number;

    @Column()
    durationInSeconds:number;

    @Column()
    weight!:number;

    @Column()
    notes:Text;
}