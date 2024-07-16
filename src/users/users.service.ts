import {
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async searchUsers(userId:number, searchUserDto: SearchUserDto): Promise<User[]> {
    let {username, maxAge, minAge, sortBy, sortOrder } = searchUserDto;
    sortBy = sortBy ?? 'id';
    sortOrder = sortOrder ?? 'ASC';
    const cache_key = `users:${userId}:${username}:${minAge}:${maxAge}:${sortBy}:${sortOrder}`;

    // const cachedData = await this.cacheService.get<User[]>(cache_key);
    // if (cachedData) {
    //   console.log(`searching from cache for ${cache_key}`);
    //   return cachedData;
    // }


    console.log(`searching without cache for ${cache_key}`);
    
    const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoin('block_users', 'block', 'block.blockId = user.id AND block.userId = :userId', { userId })
        .where('block.blockId IS NULL');

    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }

    if (minAge) {
      queryBuilder.andWhere('user.age >= :minAge', { minAge });
    }

    if (maxAge) {
      queryBuilder.andWhere('user.age <= :maxAge', { maxAge });
    }

    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder || 'ASC');
    }

    const searchData =  await queryBuilder.getMany();
    if (!searchData) {
      throw new HttpException('User Not Found', 404);
    }
    await this.cacheService.set(cache_key, searchData);
    return searchData;
  }

  private calculateAge(birthdate: string): number {
    const [day, month, year] = birthdate.split(/[-\/]/).map(part => parseInt(part, 10));
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    
    return age;
  }

  async create( createUserDto: CreateUserDto): Promise<User> {
    const age = this.calculateAge(createUserDto.birthdate);
    const userData = await this.userRepository.create({ ...createUserDto, age });
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {  
    // const cachedData = await this.cacheService.get<User>(id.toString());
    // if (cachedData) {
    //   return cachedData;
    // }
    

    console.log('without cache:', id);
    const userData = await this.userRepository.findOneBy({ id }); 
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    await this.cacheService.set(id.toString(), userData);

    return userData;
  }
  async findByUsername(username: string): Promise<User> {  
    const cachedData = await this.cacheService.get<User>(username);
    if (cachedData) {
      console.log('with cache username:', username);
      return cachedData;
    }


    console.log('without cache username:', username);
    const userData = await this.userRepository.findOneBy({ username }); 
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    await this.cacheService.set(username, userData);
    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.userRepository.findOneBy({ id });
  
    if (!userToUpdate) {
      throw new Error(`User with ID ${id} not found`);
    }
    if (updateUserDto.birthdate) {
      const age = this.calculateAge(updateUserDto.birthdate);
      userToUpdate.birthdate = updateUserDto.birthdate;
      userToUpdate.age = age;
    }
    Object.keys(updateUserDto).forEach((key) => {
      if (key !== 'birthdate') {
        userToUpdate[key] = updateUserDto[key];
      }
    });
    await this.userRepository.save(userToUpdate);
    await this.cacheService.del(id.toString());
    await this.cacheService.del(userToUpdate.username);

    return userToUpdate;
  }
  
  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    await this.cacheService.del(id.toString());
    await this.cacheService.del(existingUser.username);
    return await this.userRepository.remove(existingUser);
  }
}