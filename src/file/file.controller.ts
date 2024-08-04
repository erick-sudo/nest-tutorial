import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

@Controller('file')
export class FileController {
  @Get()
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename=package.json',
    });

    return new StreamableFile(file);
  }

  @Get('stream/video')
  @Header('Content-Type', 'video/mp4')
  @Header('Content-Disposition', 'inline')
  streamVideo(): StreamableFile {
    const file = createReadStream(
      join(homedir(), 'Downloads', 'Man_on_Fire.mp4'),
    );

    return new StreamableFile(file, {});
  }

  @Get('path')
  testPath() {
    return {
      cwd: process.cwd(),
      home: homedir(),
      video: join(homedir(), 'Downloads', 'Man_on_Fire.mp4'),
    };
  }
}
