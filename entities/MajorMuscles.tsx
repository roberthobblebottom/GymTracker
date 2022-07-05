import {Entity,Column, PrimaryGeneratedColumn} from "typeorm/browser";


@Entity("majorMuscles")
export class MajorMuscles{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:"text"})
    name!: Text;

    @Column()
    notes:Text;

    @Column()
    imageJSON:Text;
}