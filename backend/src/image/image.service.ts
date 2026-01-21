import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'node:crypto';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class ImageService {
  private readonly s3: AWS.S3;
  private readonly bucket: string;
  private readonly endpoint: string;

  // 허용 파일 타입
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  // 최대 파일 크기 (5MB)
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  constructor(private readonly configService: ConfigService) {
    const accessKey = this.configService.get<string>('NCP_ACCESS_KEY');
    const secretKey = this.configService.get<string>('NCP_SECRET_KEY');
    const region = this.configService.get<string>('NCP_REGION');
    this.endpoint = this.configService.get<string>('NCP_ENDPOINT') || '';
    this.bucket = this.configService.get<string>('NCP_BUCKET') || '';

    this.s3 = new AWS.S3({
      endpoint: this.endpoint,
      region,
      credentials: {
        accessKeyId: accessKey || '',
        secretAccessKey: secretKey || '',
      },
      s3ForcePathStyle: true,
    });
  }
  private validateFile(file: UploadedFile): void {
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `지원하지 않는 파일 형식입니다. 허용: ${this.ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `파일 크기가 너무 큽니다. 최대 ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }
  }

  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
  }

  private extractKeyFromUrl(url: string): string | null {
    const prefix = `${this.endpoint}/${this.bucket}/`;
    if (url.startsWith(prefix)) {
      return url.substring(prefix.length);
    }
    return null;
  }

  async uploadImage(file: UploadedFile, userId: number): Promise<string> {
    this.validateFile(file);

    const extension = this.getExtension(file.originalname);
    const fileName = `campaigns/user-${userId}/${Date.now()}-${randomUUID()}${extension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await this.s3.upload(params).promise();

    return `${this.endpoint}/${this.bucket}/${fileName}`;
  }
}
