import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { PrismaService } from './prisma.service';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation((_args) => {
      return {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      };
    }),
  };
});

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'postgresql://user:pass@localhost:5432/testdb'),
          },
        },
      ],
    }).compile();

    service = module.get(PrismaService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize PrismaClient with DATABASE_URL from config', () => {
    expect(configService.get).toHaveBeenCalledWith('DATABASE_URL');
    const PrismaClientMock = require('@prisma/client').PrismaClient;
    expect(PrismaClientMock).toHaveBeenCalledWith({
      datasources: {
        db: {
          url: 'postgresql://user:pass@localhost:5432/testdb',
        },
      },
    });
  });
});
