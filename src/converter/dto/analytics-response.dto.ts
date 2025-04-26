import { Expose, Transform } from 'class-transformer';
import { SesSnsEventDto } from './ses-sns-event.dto';

const getUsername = (email: string): string => email?.split('@')[0] ?? '';

export class AnalyticsResponseDto {
  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    const record = obj?.Records?.[0];
    const status = record?.ses?.receipt?.spamVerdict?.status;
    return status === 'PASS';
  })
  spam: boolean;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    return obj.Records?.[0]?.ses?.receipt?.virusVerdict?.status === 'PASS';
  })
  virus: boolean;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    const receipt = obj.Records?.[0]?.ses?.receipt;
    return (
      receipt?.spfVerdict?.status === 'PASS' &&
      receipt?.dkimVerdict?.status === 'PASS' &&
      receipt?.dmarcVerdict?.status === 'PASS'
    );
  })
  dns: boolean;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    const timestamp = obj.Records?.[0]?.ses?.mail?.timestamp;
    const dateObject =
      typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (dateObject instanceof Date && !isNaN(dateObject.valueOf())) {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return monthNames[dateObject.getMonth()];
    }
    return null;
  })
  mes: string | null;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    return (obj.Records?.[0]?.ses?.receipt?.processingTimeMillis ?? 0) > 1000;
  })
  retrasado: boolean;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    const source = obj.Records?.[0]?.ses?.mail?.source;
    return getUsername(source);
  })
  emisor: string;

  @Expose()
  @Transform(({ obj }: { obj: SesSnsEventDto }) => {
    const destinations = obj.Records?.[0]?.ses?.mail?.destination ?? [];
    return destinations.map(getUsername);
  })
  receptor: string[];
}
