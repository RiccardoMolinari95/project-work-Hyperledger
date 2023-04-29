import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum AnimalType {
  DOG = 'DOG',
  CAT = 'CAT'
}

@Entity()
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @Column()
  name: string

  @Column({
    type: 'varchar',
    enum: AnimalType,
    default: AnimalType.DOG
  })
  type: AnimalType;
  
  @Column({ nullable: true })
  breed: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  imgUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  pedigree: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  transactionHash: string;

  @Column({name: "owner_id", nullable: true })
  ownerId: string

  @Column({name: "owner_name", nullable: true })
  ownerName: string

  @Column({name: "owner_lastname", nullable: true })
  ownerLastname: string

}


