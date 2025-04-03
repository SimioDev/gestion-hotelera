import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hashedPassword });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      console.log('User found by email:', user);
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Invalid user ID for email ${email}: ${user.id}`);
      }
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    console.log('Finding user with id:', id);
    if (isNaN(id) || id <= 0) {
      throw new Error(`Invalid user ID: ${id}`);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      console.log('User found:', user);
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Invalid user ID for id ${id}: ${user.id}`);
      }
    }
    return user;
  }
}
