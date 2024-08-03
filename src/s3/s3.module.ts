import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Module({
  imports: [],
  providers: [
    {
      provide: 'S3',
      useClass: S3,
    },
  ],
  exports: ['S3'],
})
export class S3Module {}
