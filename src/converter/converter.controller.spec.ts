import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { SesSnsEventDto } from './dto/ses-sns-event.dto'; // Import the DTO

interface ConvertedResponse {
  spam: boolean;
  virus: boolean;
  dns: boolean;
  mes: string;
  retrasado: boolean;
  emisor: string;
  receptor: string[];
}

const mockSesSnsEvent: SesSnsEventDto = {
  Records: [
    {
      eventVersion: '1.0',
      ses: {
        receipt: {
          timestamp: new Date('2015-09-11T20:32:33.936Z'),
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
          timestamp: new Date('2015-09-11T20:32:33.936Z'),
          source: '61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com',
          messageId: 'd6iitobk75ur44p8kdnnp7g2n800',
          destination: ['recipient@example.com'],
          headersTruncated: false,
          headers: [
            {
              name: 'From',
              value: 'sender@example.com',
            },
            {
              name: 'To',
              value: 'recipient@example.com',
            },
            {
              name: 'Subject',
              value: 'Example subject',
            },
          ],
          commonHeaders: {
            returnPath:
              '0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com',
            from: ['sender@example.com'],
            date: 'Fri, 11 Sep 2015 20:32:32 +0000',
            to: ['recipient@example.com'],
            messageId: '<61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com>',
            subject: 'Example subject',
          },
        },
      },
      eventSource: 'aws:ses',
    },
  ],
};

const mockExpectedResponse: ConvertedResponse = {
  spam: true,
  virus: true,
  dns: true,
  mes: 'September',
  retrasado: false,
  emisor: '61967230-7A45-4A9D-BEC9-87CBCF2211C9',
  receptor: ['recipient'],
};

describe('ConverterController', () => {
  let controller: ConverterController;
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
      providers: [
        // Provide a mock implementation for ConverterService
        {
          provide: ConverterService,
          useValue: {
            // Mock the convertSesSnsEvent method
            convertSesSnsEvent: jest.fn().mockReturnValue(mockExpectedResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<ConverterController>(ConverterController);
    service = module.get<ConverterService>(ConverterService); // Get the mocked service instance
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call converterService.convertSesSnsEvent with the event body and return its result', () => {
      const result = controller.create(mockSesSnsEvent);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.convertSesSnsEvent).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.convertSesSnsEvent).toHaveBeenCalledWith(mockSesSnsEvent);

      expect(result).toEqual(mockExpectedResponse);
    });
  });
});
