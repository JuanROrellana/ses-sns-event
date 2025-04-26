import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from './converter.service';
import { SesSnsEventDto } from './dto/ses-sns-event.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { plainToInstance } from 'class-transformer';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConverterService],
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertSesSnsEvent', () => {
    it('should correctly convert SES SNS event to AnalyticsResponseDto', () => {
      // Example input based on ses-sns-event.json
      const sesSnsEventJson = {
        Records: [
          {
            eventVersion: '1.0',
            ses: {
              receipt: {
                timestamp: '2015-09-11T20:32:33.936Z',
                processingTimeMillis: 222,
                recipients: ['recipient@example.com'],
                spamVerdict: { status: 'PASS' },
                virusVerdict: { status: 'PASS' },
                spfVerdict: { status: 'PASS' },
                dkimVerdict: { status: 'PASS' },
                dmarcVerdict: { status: 'PASS' },
                dmarcPolicy: 'reject',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:012345678912:example-topic',
                },
              },
              mail: {
                timestamp: '2015-09-11T20:32:33.936Z',
                source: '61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com',
                messageId: 'd6iitobk75ur44p8kdnnp7g2n800',
                destination: ['recipient@example.com'],
                headersTruncated: false,
                headers: [
                  {
                    name: 'Return-Path',
                    value:
                      '<0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com>',
                  },
                  // ... other headers omitted for brevity ...
                  {
                    name: 'Feedback-ID',
                    value:
                      '1.us-east-1.Krv2FKpFdWV+KUYw3Qd6wcpPJ4Sv/pOPpEPSHn2u2o4=:AmazonSES',
                  },
                ],
                commonHeaders: {
                  returnPath:
                    '0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com',
                  from: ['sender@example.com'],
                  date: 'Fri, 11 Sep 2015 20:32:32 +0000',
                  to: ['recipient@example.com'],
                  messageId:
                    '<61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com>',
                  subject: 'Example subject',
                },
              },
            },
            eventSource: 'aws:ses',
          },
        ],
      };

      // We need to transform the plain JS object into an instance of the DTO class
      // This is important because class-transformer decorators rely on the class instance
      const sesSnsEventDto = plainToInstance(SesSnsEventDto, sesSnsEventJson, {
        // Ensure nested objects are transformed correctly if needed
        // enableImplicitConversion: true, // Consider if implicit type conversion is needed
      });

      // Expected output based on response.json
      const expectedResponse: AnalyticsResponseDto = {
        spam: true,
        virus: true,
        dns: true,
        mes: 'September',
        retrasado: false,
        emisor: '61967230-7A45-4A9D-BEC9-87CBCF2211C9',
        receptor: ['recipient'],
      };

      const result = service.convertSesSnsEvent(sesSnsEventDto);

      expect(result).toBeInstanceOf(AnalyticsResponseDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
