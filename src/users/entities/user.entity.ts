import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'id',
    })
    id: number;

    @Column({
        name: 'email_address',
        nullable: false,
        default: '',
    })
    username: string;

    @Column({
        name: 'password',
        nullable: false,
        default: '',
    })
    password: string;

    @Column({
        name: 'first_name',
        nullable: false,
        default: '',
    })
    firstName: string;

    @Column({
        name: 'last_name',
        nullable: false,
        default: '',
    })
    lastName: string;

    @CreateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)" 
    })
    account_created: Date;

    @UpdateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" 
    })
    account_updated: Date;


    constructor(username: string, password: string,  firstName: string, lastName: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

}
