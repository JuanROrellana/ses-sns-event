import { Controller, Post, Body } from '@nestjs/common';
import { ConverterService } from './converter.service';
import { SesSnsEventDto } from './dto/ses-sns-event.dto';

@Controller({
  path: 'converter',
  version: '1',
})
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post()
  create(@Body() sesSnsEvent: SesSnsEventDto) {
    return this.converterService.convertSesSnsEvent(sesSnsEvent);
  }
}
