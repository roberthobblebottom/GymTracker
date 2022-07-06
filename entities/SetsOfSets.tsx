import {Entity,Column, PrimaryGeneratedColumn,OneToOne} from "typeorm/browser";
import {Exercise}  from "./Exercise";

@Entity({name:"setofsets"})
export class SetOfSets{

    @PrimaryGeneratedColumn()
    id!:number;

    @OneToOne(()=> Exercise)
    @Column("text")
    exercise!: Text;

    @Column("int")
    reps!:number;

    @Column("int")
    percentComplete!:number;

    @Column("int")
    sets:number;

    @Column("int")
    durationInSeconds:number;

    @Column("int")
    weight!:number;

    @Column("text")
    notes:Text;
}