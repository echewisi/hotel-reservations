import { PrimaryColumn, Column, Entity, BeforeInsert } from 'typeorm';

@Entity('hotel')
export class HotelEntity {
  @PrimaryColumn({ length: 6 }) // Assuming 6 characters for the hotel tag
  hotel_tag: string;

  @Column({ length: 500 })
  name: string;

  @Column({ nullable: true })
  available_occupancy: number;

  @Column({ default: false })
  occupancy_filled: boolean;

  @Column('simple-array', { nullable: true })
  occupants: string[];

  @BeforeInsert()
  generateHotelTag() {
    this.hotel_tag = this.generateUniqueKey();
  }

  private generateUniqueKey(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }
}
