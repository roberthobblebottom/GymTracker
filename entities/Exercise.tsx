import {Entity,Column, PrimaryGeneratedColumn} from "typeorm/browser";


@Entity("Exercise")
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