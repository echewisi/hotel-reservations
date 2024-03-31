import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('hotel')
export class HotelEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true })
  available_occupancy: number;

  @Column({ default: false })
  occupancy_filled: boolean;

  //make this field capable of storing an array. i.e, an array of hotel ids given to users
  @Column({ nullable: true })
  occupants: Array;
}
