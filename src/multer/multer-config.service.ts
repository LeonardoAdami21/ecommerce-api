import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary
    });

    return {
      storage,
    };
  }
}
