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
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @ApiProperty({ enum: UserRole })
  @Expose()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @ApiProperty()
  @Expose()
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @ApiProperty()
  @Expose()
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;

  @ApiProperty()
  @Expose()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
