import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  v2,
} from 'cloudinary';
import toStream = require('buffer-to-stream');
import { StorageFile } from '@blazity/nest-file-fastify';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: StorageFile,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      //@ts-ignore
      toStream(file.buffer).pipe(upload);
    });
  }

  async removeImage(
    publicId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return v2.uploader.destroy(publicId);
  }
}
