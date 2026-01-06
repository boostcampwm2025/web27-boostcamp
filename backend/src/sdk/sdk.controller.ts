import { Controller, Post, Body } from '@nestjs/common';
import { SdkService } from './sdk.service';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkservice: SdkService) {}
}
