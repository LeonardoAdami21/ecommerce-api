import { Module } from '@nestjs/common';
import { MulterConfigService } from './multer-config.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [MulterConfigService],
  exports: [MulterConfigService],
})
export class MulterConfigModule {}
