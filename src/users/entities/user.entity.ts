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
    first_name: string;

    @Column({
        name: 'last_name',
        nullable: false,
        default: '',
    })
    last_name: string;
    

    @Column('boolean', 
    {
        default: false
    })
    isVerified: boolean = false;

    @CreateDateColumn({ 
        type: "timestamp", 
        nullable: true,
        default: null 
    })
    verified_at: Date;

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


    constructor(username: string, password: string,  first_name: string, last_name: string) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.password = password;
    }

}
