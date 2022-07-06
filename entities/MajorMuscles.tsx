import {Entity,Column, PrimaryGeneratedColumn} from "typeorm/browser";


@Entity({name:"majormuscles"})
export class MajorMuscles{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:"text"})
    name!: Text;

    @Column("text")
    notes:Text;

    @Column("text")
    imageJSON:Text;
}