import { Injectable } from '@nestjs/common';
import { SesSnsEventDto } from './dto/ses-sns-event.dto';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ConverterService {
  convertSesSnsEvent(sesSnsEvent: SesSnsEventDto): AnalyticsResponseDto {
    return plainToInstance(AnalyticsResponseDto, sesSnsEvent, {
      excludeExtraneousValues: true,
    });
  }
}
