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

  async searchUsers(searchUserDto: SearchUserDto): Promise<User[]> {
    console.log('searching without cache');
    
    const { maxAge, minAge, sortBy, sortOrder, username, userId } = searchUserDto;
    // console.log("username: ",username, "minAge: ", minAge, "maxAge: ", maxAge, sortBy, sortOrder);
    
    // const queryBuilder = this.userRepository.createQueryBuilder('user');
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

    return queryBuilder.getMany();
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
    const cachedData = await this.cacheService.get<User>(id.toString());
    if (cachedData) {
      return cachedData;
    }
    
    console.log('without cache:', id);
    const userData = await this.userRepository.findOneBy({ id }); 
    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }
    await this.cacheService.set(id.toString(), userData);
    // const cd = await this.getData();
    // console.log('all cached data:', cd);
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

    return userToUpdate;
  }
  
  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    await this.cacheService.del(id.toString());
    return await this.userRepository.remove(existingUser);
  }

    // util function to fetch all the data from cache
    async getData() {
      //Get all keys
      const keys = await this.cacheService.store.keys();
    
      //Loop through keys and get data
      const allData: { [key: string]: any } = {};
      for (const key of keys) {
        allData[key] = await this.cacheService.get(key);
      }
      return allData;
    }
}