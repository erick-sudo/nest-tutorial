import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as fs from 'fs';

export const MimeTypes = {
  jpeg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
  png: ['89504e47'],
};

export type Mime = keyof typeof MimeTypes;

@Injectable()
export class MagicNumberFileTypeValidator implements PipeTransform {
    private readonly fileTypes: Mime[];

    constructor(...fileTypes: Mime[]) {
      this.fileTypes = fileTypes;
    }

  async transform(file: Express.Multer.File, _metadata: ArgumentMetadata) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileSignature = file.buffer.toString('hex', 0, 512);;

    const isValid = this.fileTypes.some((fileType) => {
      const allowedSignatures = MimeTypes[fileType.toLowerCase() as Mime];
      return allowedSignatures.some((signature) =>
        fileSignature.startsWith(signature),
      );
    });

    if (!isValid) {
      throw new BadRequestException(
        `Invalid file type. Expected formats: ${this.fileTypes.join(', ')}`,
      );
    }

    return file;
  }

//   private async getFileSignature(filePath: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const readStream = fs.createReadStream(filePath, { start: 0, end: 511 });
//       const chunks: Buffer[] = [];

//       readStream.on('data', (chunk: Buffer) => {
//         chunks.push(chunk);
//       });
//       readStream.on('end', () => {
//         const buffer = Buffer.concat(chunks);
//         const signature = buffer.toString('hex', 0, 512);
//         resolve(signature);
//       });
//       readStream.on('error', (err) => {
//         reject(err);
//       });
//     });
//   }
}
