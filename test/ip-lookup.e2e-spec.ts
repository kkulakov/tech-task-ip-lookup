import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { IpWhoisInfo } from '@/ip-lookup/model/ip-whois-info.model';
import { mainConfig } from '@/main.config';

describe('IpLookupController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /ip-lookup/:ip', () => {
    it('should return IP info for a valid IPv4', async () => {
      const ip = '8.8.8.8';
      const ipInfo: IpWhoisInfo = {
        ip: '8.8.8.8',
        success: true,
        type: 'IPv4',
        continent: 'North America',
        continent_code: 'NA',
        country: 'United States',
        country_code: 'US',
        region: 'California',
        region_code: 'CA',
        city: 'Mountain View',
        latitude: 37.3860517,
        longitude: -122.0838511,
        is_eu: false,
        postal: '94039',
        calling_code: '1',
        capital: 'Washington D.C.',
        borders: 'CA,MX',
        flag: {
          img: 'https://cdn.ipwhois.io/flags/us.svg',
          emoji: '🇺🇸',
          emoji_unicode: 'U+1F1FA U+1F1F8',
        },
        connection: {
          asn: 15169,
          org: 'Google LLC',
          isp: 'Google LLC',
          domain: 'google.com',
        },
        timezone: {
          id: 'America/Los_Angeles',
          abbr: 'PST',
          is_dst: false,
          offset: -28800,
          utc: '-08:00',
          current_time: expect.any(String),
        },
      };

      const response = await request(app.getHttpServer())
        .get(`/api/v1/ip-lookup/${ip}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(ipInfo);
    });

    it('should accept valid IPv6', async () => {
      const ip = '1001:0db8:11a3:09d7:1f34:8a2e:07a0:765d';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/ip-lookup/${ip}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toEqual(true);
    });

    it('should return 400 for an invalid IP format', async () => {
      const ip = 'invalid-ip';
      const response = await request(app.getHttpServer())
        .get(`/api/v1/ip-lookup/${ip}`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContainEqual(
        'Incorrect IP address format',
      );
    });
  });

  describe('DELETE /ip-lookup/:ip', () => {
    it('should return 404 if IP not found in the database', async () => {
      const ip = '1.1.1.1';
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/ip-lookup/${ip}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toEqual(
        'Lookup for IP address 1.1.1.1 not found.',
      );
    });

    it('should return 400 for an invalid IP format', async () => {
      const ip = 'invalid-ip';
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/ip-lookup/${ip}`)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContainEqual(
        'Incorrect IP address format',
      );
    });
  });
});
