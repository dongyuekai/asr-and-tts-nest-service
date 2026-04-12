import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechService } from './speech.service';

@Controller('speech')
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @Post('asr')
  // 这里 @UseInterceptors 装饰器是使用 FileInterceptor 这个拦截器取表单的 audio 字段
  @UseInterceptors(FileInterceptor('audio'))
  async recognize(
    @UploadedFile()
    file?: {
      buffer: Buffer;
      originalname: string;
      mimetype: string;
      size: number;
    },
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('请通过FormData的audio字段上传音频文件');
    }
    const text = await this.speechService.recognizeBySentence(file);
    return { text };
  }
}
