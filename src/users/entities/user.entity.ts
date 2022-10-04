import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'user_id',
    })
    id: number;

    @Column({
        name: 'email_address',
        nullable: false,
        default: '',
    })
    email: string;

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
    created_at: Date;

    @UpdateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" 
    })
    updated_at: Date;

}
