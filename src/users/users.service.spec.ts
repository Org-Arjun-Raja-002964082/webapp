import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as winston from 'winston';

const oneUser = new User('gmail@email.com', 'poassword', 'firstNome', 'lastHame');

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;
  // const logger: winston.Logger = winston.createLogger({
  //   level: 'info',
  //   format: winston.format.json(),
  // });


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(oneUser),
            create: jest.fn().mockReturnValue(oneUser),
            save: jest.fn(),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
            update: jest.fn().mockResolvedValue(true),
            // as these do not actually use their return values in our sample
            // we just make sure that their resolve is true to not crash
          },
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUsersById', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      expect(service.findOne('gmail@email.com')).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ where: { username: 'gmail@email.com' } });
    });
  });
});
