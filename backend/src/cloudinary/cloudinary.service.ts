import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
    uploadFile(file: any): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'petal_pearl_products',
                    // format: 'auto', // causing invalid extension error
                    quality: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as CloudinaryResponse);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}
