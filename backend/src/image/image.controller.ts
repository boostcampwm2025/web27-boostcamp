import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import { ImageService } from './image.service';
import {
  successResponse,
  SuccessResponse,
} from '../common/response/success-response';

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

@Controller('images')
@UseGuards(JwtCookieGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: UploadedFileType,
    @Req() req: AuthenticatedRequest
  ): Promise<SuccessResponse<{ imageUrl: string }>> {
    const userId = req.user.userId;
    const imageUrl = await this.imageService.uploadImage(file, userId);

    return successResponse({ imageUrl }, '이미지가 업로드되었습니다.');
  }
}
