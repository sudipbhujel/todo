// service.ts
import { Injectable } from '@nestjs/common';
import { Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricService {
  constructor(
    @InjectMetric('http_request_duration_milliseconds')
    public histogram: Histogram<string>,
  ) {}
}
