import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {

    @PrimaryColumn({
        name: 'doc_id',
        nullable: false,
        default: '',
    })
    doc_id: string;
    // @PrimaryGeneratedColumn('uuid')
    // doc_id: string;

    @Column({
        type: 'bigint',
        name: 'user_id',
    })
    user_id: number;

    @Column({
        name: 'name',
        nullable: false,
        default: '',
    })
    name: string;

    @CreateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)" 
    })
    date_created: Date;

    @Column({
        name: 's3_bucket_path',
        nullable: false,
        default: '',
    })
    s3_bucket_path: string;


    constructor(user_id: number, name: string,  s3_bucket_path: string) {
        this.user_id = user_id;
        this.name = name;
        this.s3_bucket_path = s3_bucket_path;
    }
}
