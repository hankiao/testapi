import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common'; // ekle en üstte

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async createUser(registerDto: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = registerDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    if (!userRole) {
      userRole = this.rolesRepository.create({ name: 'user' });
      await this.rolesRepository.save(userRole);
    }

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      roles: [userRole],
      activeTheme: 'system', // Default tema
    });

    return this.usersRepository.save(user);
  }

  async updateTheme(userId: number, theme: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    user.activeTheme = theme;
    return this.usersRepository.save(user);
  }

  async updateAvatar(userId: number, avatarPath: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    user.avatar = avatarPath;
    await this.usersRepository.save(user);
  }


  async updateProfile(userId: number, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

}
