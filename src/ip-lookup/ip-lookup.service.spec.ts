import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { IpLookupService } from './ip-lookup.service';
import { IpWhoisService } from '@/ip-lookup/service/ip-whois.service';
import { EntityRepository } from '@mikro-orm/core';
import { IpLookupEntity } from '@/ip-lookup/ip-lookup.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';

describe('IpLookupService', () => {
  let service: IpLookupService;
  let ipWhoisService: IpWhoisService;
  let ipLookupRepository: EntityRepository<IpLookupEntity>;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockIpWhoisService = {
    getWhois: jest.fn(),
  };

  const mockIpLookupRepository = {
    findOne: jest.fn(),
    upsert: jest.fn(),
    nativeDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpLookupService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: IpWhoisService, useValue: mockIpWhoisService },
        {
          provide: 'IpLookupEntityRepository',
          useValue: mockIpLookupRepository,
        },
      ],
    }).compile();

    service = module.get<IpLookupService>(IpLookupService);
    ipWhoisService = module.get<IpWhoisService>(IpWhoisService);
    ipLookupRepository = module.get<EntityRepository<IpLookupEntity>>(
      'IpLookupEntityRepository',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInfo', () => {
    it('should return cached data if not expired', async () => {
      const ip = '192.168.0.1';
      const cachedData = {
        ip,
        info: { ip, country: 'US', success: true },
        expiresAt: Date.now() + 1000,
      };
      mockIpLookupRepository.findOne.mockResolvedValue(cachedData);

      const result = await service.getInfo(ip);

      expect(ipLookupRepository.findOne).toHaveBeenCalledWith({ ip });
      expect(result).toEqual(cachedData.info);
    });

    it('should fetch and cache new data if no valid cache exists', async () => {
      const ip = '192.168.0.1';
      const whoisResult: IpWhoisInfo = {
        ip: '192.168.0.1',
        success: true,
        country: 'US',
      } as any;
      const appConfig = { recordTtlSeconds: 60 };

      mockIpLookupRepository.findOne.mockResolvedValue(null);
      mockIpWhoisService.getWhois.mockResolvedValue(whoisResult);
      mockConfigService.get.mockReturnValue(appConfig);

      const result = await service.getInfo(ip);

      expect(ipLookupRepository.findOne).toHaveBeenCalledWith({ ip });
      expect(ipWhoisService.getWhois).toHaveBeenCalledWith(ip);
      expect(ipLookupRepository.upsert).toHaveBeenCalledWith({
        ip: whoisResult.ip,
        info: whoisResult,
        expiresAt: expect.any(Number),
      });
      expect(result).toEqual(whoisResult);
    });

    it('should fetch and cache new data if cache is expired', async () => {
      const ip = '192.168.0.1';
      const whoisResult: IpWhoisInfo = {
        ip: '192.168.0.1',
        success: true,
        country: 'US',
      } as any;
      const cachedData: IpLookupEntity = {
        ip,
        info: whoisResult,
        expiresAt: Date.now(),
      };
      const appConfig = { recordTtlSeconds: 60 };

      mockIpLookupRepository.findOne.mockResolvedValue(cachedData);
      mockIpWhoisService.getWhois.mockResolvedValue(whoisResult);
      mockConfigService.get.mockReturnValue(appConfig);

      const result = await service.getInfo(ip);

      expect(ipLookupRepository.findOne).toHaveBeenCalledWith({ ip });
      expect(ipWhoisService.getWhois).toHaveBeenCalledWith(ip);
      expect(ipLookupRepository.upsert).toHaveBeenCalledWith({
        ip: whoisResult.ip,
        info: whoisResult,
        expiresAt: expect.any(Number),
      });
      expect(result).toEqual(whoisResult);
    });

    it('should throw BadRequestException if whois lookup fails', async () => {
      const ip = '127.0.0.1';
      const whoisResult = {
        ip: '127.0.0.1',
        success: false,
        message: 'Reserved range',
      };

      mockIpLookupRepository.findOne.mockResolvedValue(null);
      mockIpWhoisService.getWhois.mockResolvedValue(whoisResult);

      await expect(service.getInfo(ip)).rejects.toThrow(BadRequestException);
      expect(ipWhoisService.getWhois).toHaveBeenCalledWith(ip);
    });
  });

  describe('deleteCached', () => {
    it('should delete cached record if it exists', async () => {
      const ip = '192.168.0.1';
      const cachedData = { ip };

      mockIpLookupRepository.findOne.mockResolvedValue(cachedData);

      await service.deleteCached(ip);

      expect(ipLookupRepository.findOne).toHaveBeenCalledWith({ ip });
      expect(ipLookupRepository.nativeDelete).toHaveBeenCalledWith({ ip });
    });

    it('should throw NotFoundException if record does not exist', async () => {
      const ip = '192.168.0.1';

      mockIpLookupRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteCached(ip)).rejects.toThrow(NotFoundException);
      expect(ipLookupRepository.findOne).toHaveBeenCalledWith({ ip });
    });
  });
});
