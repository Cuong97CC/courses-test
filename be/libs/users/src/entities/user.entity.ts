import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ name: 'id' })
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ name: 'email' })
  @Expose()
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @ApiProperty({ name: 'password' })
  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @ApiProperty({ name: 'role', enum: UserRole })
  @Expose()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @ApiProperty({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @ApiProperty({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;

  @ApiProperty({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
