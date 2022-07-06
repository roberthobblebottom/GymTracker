import {Entity,Column, PrimaryGeneratedColumn} from "typeorm/browser";
import "reflect-metadata";

@Entity({name:"exercise"})
export class Exercise{

    @PrimaryGeneratedColumn("uuid")
    id!:number;

    @Column("text")
    name!: Text;

    @Column("text")
    notes:Text;

    @Column('text')
    imageJSON:Text;
}