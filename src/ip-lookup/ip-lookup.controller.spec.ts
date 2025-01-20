import { Test, TestingModule } from '@nestjs/testing';
import { IpLookupController } from './ip-lookup.controller';
import { IpLookupService } from '@/ip-lookup/ip-lookup.service';
import { IpAddressParamsDto } from '@/ip-lookup/dto/ip-address-params.dto';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';

describe('IpLookupController', () => {
  let controller: IpLookupController;
  let service: IpLookupService;

  const mockIpLookupService = {
    getInfo: jest.fn(),
    deleteCached: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpLookupController],
      providers: [
        {
          provide: IpLookupService,
          useValue: mockIpLookupService,
        },
      ],
    }).compile();

    controller = module.get<IpLookupController>(IpLookupController);
    service = module.get<IpLookupService>(IpLookupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInfo', () => {
    it('should call IpLookupService.getInfo with correct IP and return the result', async () => {
      const ip = '192.168.0.1';
      const result: IpWhoisInfo = {
        ip: '192.168.0.1',
        success: true,
        country: 'US',
      } as any;
      mockIpLookupService.getInfo.mockResolvedValue(result);

      const params: IpAddressParamsDto = { ip };
      const response = await controller.getInfo(params);

      expect(service.getInfo).toHaveBeenCalledWith(ip);
      expect(response).toEqual(result);
    });
  });

  describe('deleteCached', () => {
    it('should call IpLookupService.deleteCached with correct IP', async () => {
      const ip = '192.168.0.1';
      mockIpLookupService.deleteCached.mockResolvedValue(undefined);

      const params: IpAddressParamsDto = { ip };
      await controller.deleteCached(params);

      expect(service.deleteCached).toHaveBeenCalledWith(ip);
    });
  });
});
