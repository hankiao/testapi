import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Address } from './address.entity'; // Yeni eklenen Address varlığı

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string; // username benzersiz olmalı genelde

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  @Column({ default: 'system' }) // Burada tema bilgisini saklayacağız
  activeTheme: string;

  @Column({ nullable: true })
  avatar: string; // Kullanıcının profil resmini saklar

  @Column({ nullable: true, length: 500 })
  bio: string; // Kullanıcının biyografisi

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[]; // Kullanıcı adresleri
}
