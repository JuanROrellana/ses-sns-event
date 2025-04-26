import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Verdict {
  @ApiProperty({
    description: 'The verdict status of the check (e.g., PASS, FAIL, GRAY)',
    example: 'PASS',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class Action {
  @ApiProperty({ description: 'The type of action taken', example: 'SNS' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description:
      'The ARN of the Amazon SNS topic to which the notification was published',
    example: 'arn:aws:sns:us-east-1:012345678912:example-topic',
  })
  @IsString()
  @IsNotEmpty()
  topicArn: string;
}

export class Receipt {
  @ApiProperty({
    description: 'The date and time the receipt was recorded',
    example: '2015-09-11T20:32:33.936Z',
  })
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description:
      'The time in milliseconds from when Amazon SES received the email to when it triggered the action',
    example: 222,
  })
  @IsNumber()
  processingTimeMillis: number;

  @ApiProperty({
    description:
      'A list of recipients that were matched by the active receipt rule',
    example: ['recipient@example.com'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  recipients: string[];

  @ApiProperty({ description: 'The spam verdict object' })
  @ValidateNested()
  @Type(() => Verdict)
  spamVerdict: Verdict;

  @ApiProperty({ description: 'The virus verdict object' })
  @ValidateNested()
  @Type(() => Verdict)
  virusVerdict: Verdict;

  @ApiProperty({ description: 'The SPF verdict object' })
  @ValidateNested()
  @Type(() => Verdict)
  spfVerdict: Verdict;

  @ApiProperty({ description: 'The DKIM verdict object' })
  @ValidateNested()
  @Type(() => Verdict)
  dkimVerdict: Verdict;

  @ApiProperty({ description: 'The DMARC verdict object' })
  @ValidateNested()
  @Type(() => Verdict)
  dmarcVerdict: Verdict;

  @ApiProperty({
    description: 'The DMARC policy based on the DMARC verdict',
    example: 'reject',
  })
  @IsString()
  @IsNotEmpty()
  dmarcPolicy: string;

  @ApiProperty({
    description: 'The action object detailing what action was taken',
  })
  @ValidateNested()
  @Type(() => Action)
  action: Action;
}

export class Header {
  @ApiProperty({
    description: 'The name of the email header',
    example: 'Return-Path',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The value of the email header',
    example:
      '<0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com>',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CommonHeaders {
  @ApiProperty({
    description: 'The value of the Return-Path header',
    example:
      '0000014fbe1c09cf-7cb9f704-7531-4e53-89a1-5fa9744f5eb6-000000@amazonses.com',
  })
  @IsString()
  @IsNotEmpty()
  returnPath: string;

  @ApiProperty({
    description: 'A list of email addresses from the From header',
    example: ['sender@example.com'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  from: string[];

  @ApiProperty({
    description: 'The value of the Date header',
    example: 'Fri, 11 Sep 2015 20:32:32 +0000',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'A list of email addresses from the To header',
    example: ['recipient@example.com'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  to: string[];

  @ApiProperty({
    description: 'The value of the Message-ID header',
    example: '<61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com>',
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'The value of the Subject header',
    example: 'Example subject',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}

export class Mail {
  @ApiProperty({
    description: 'The date and time the email was received by SES',
    example: '2015-09-11T20:32:33.936Z',
  })
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    description:
      'The email address from which the email was sent (envelope MAIL FROM address)',
    example: '61967230-7A45-4A9D-BEC9-87CBCF2211C9@example.com',
  })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({
    description: 'The unique ID assigned to the email by Amazon SES',
    example: 'd6iitobk75ur44p8kdnnp7g2n800',
  })
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description:
      'A list of all recipient email addresses for the email (envelope RCPT TO addresses)',
    example: ['recipient@example.com'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  destination: string[];

  @ApiProperty({
    description: 'Indicates whether the headers were truncated',
    example: false,
  })
  @IsBoolean()
  headersTruncated: boolean;

  @ApiProperty({
    description: 'A list of headers associated with the email',
    type: () => [Header],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Header)
  headers: Header[];

  @ApiProperty({ description: 'A summary of common email headers' })
  @ValidateNested()
  @Type(() => CommonHeaders)
  commonHeaders: CommonHeaders;
}

export class Ses {
  @ApiProperty({ description: 'Details about the receipt of the email' })
  @ValidateNested()
  @Type(() => Receipt)
  receipt: Receipt;

  @ApiProperty({ description: 'Details about the email itself' })
  @ValidateNested()
  @Type(() => Mail)
  mail: Mail;
}

export class Record {
  @ApiProperty({
    description: 'The version of the event record',
    example: '1.0',
  })
  @IsString()
  @IsNotEmpty()
  eventVersion: string;

  @ApiProperty({ description: 'The SES event details' })
  @ValidateNested()
  @Type(() => Ses)
  ses: Ses;

  @ApiProperty({ description: 'The source of the event', example: 'aws:ses' })
  @IsString()
  @IsNotEmpty()
  eventSource: string;
}

export class SesSnsEventDto {
  @ApiProperty({
    description: 'An array containing the event records',
    type: () => [Record],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Record)
  Records: Record[];
}
