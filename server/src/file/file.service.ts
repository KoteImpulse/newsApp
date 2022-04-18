import { Length } from 'class-validator';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Post } from 'src/post/entities/post.entity';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { IFile } from './type';

export enum FileType {
  AVATAR = 'userAvatar',
  POSTIMAGE = 'postImages',
  USERIMAGE = 'userImages',
}

@Injectable()
export class FileService {
  createFile(type: FileType, file): string {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(fileName: string) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static');
      if (
        fileName === 'defaultAvatars/defaultAvatar.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar2.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar3.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar4.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar5.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar6.jpg' ||
        fileName === 'defaultAvatars/defaultAvatar7.jpg'
      ) {
        return '';
      }

      if (fs.existsSync(path.resolve(filePath, fileName))) {
        fs.unlinkSync(path.resolve(filePath, fileName));
      }
      return '';
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  createImageFile(type: FileType, file, userId: number): IFile {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const fileDir = path.resolve(
        __dirname,
        '..',
        'static',
        type,
        userId.toString(),
      );
      const filePath = path.resolve(fileDir, fileName);
      const filePathWithoutDir = `${type}/${userId.toString()}/${fileName}`;

      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      fs.writeFileSync(path.resolve(fileDir, fileName), file.buffer);
      const url = `${process.env.BACKURL}/${filePathWithoutDir}`;
      return {
        url,
        filePath,
        fileName,
        newFile: true,
        filePathWithoutDir,
        fileDir,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  moveFilesToPostDir(
    post?: Post,
    updatePostDto?: UpdatePostDto,
    postId?: number,
  ): Post | UpdatePostDto {
    const postIndex = post ? post.id.toString() : postId.toString();
    const fileDir = path.resolve(
      __dirname,
      '..',
      'static',
      FileType.POSTIMAGE,
      postIndex,
    );
    try {
      const images = post
        ? post.body.filter((item) => item.type === 'image')
        : updatePostDto.body.filter((item) => item.type === 'image');
      images.map((item) => {
        if (item.data.file.newFile && images.length > 0) {
          const oldPath = item.data.file.filePath;
          const newPath = path.resolve(fileDir, item.data.file.fileName);
          if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
          }
          fs.rename(oldPath, newPath, (err) => {
            if (err) throw err;
            console.log('Rename complete!');
          });
          const filePathWithoutDir = `${FileType.POSTIMAGE}/${postIndex}/${item.data.file.fileName}`;

          item.data.file.url = `${process.env.BACKURL}/${filePathWithoutDir}`;
          item.data.file.filePathWithoutDir = filePathWithoutDir;
          item.data.file.filePath = newPath;
          item.data.file.fileDir = fileDir;
          item.data.file.newFile = false;
        }
        return;
      });
      return post ? post : updatePostDto;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeDir(type: FileType, id: number) {
    try {
      const dirPath = path.resolve(
        __dirname,
        '..',
        'static',
        type,
        id.toString(),
      );
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  removeImages(type: FileType, id: number, filesInDto: string[]) {
    const dirPath = path.resolve(
      __dirname,
      '..',
      'static',
      type,
      id.toString(),
    );
    try {
      if (
        fs.existsSync(dirPath) &&
        fs.readdirSync(dirPath).map((file) => file).length > 0
      ) {
        const filesInDir = fs.readdirSync(dirPath).map((file) => file);
        const a = filesInDir.filter((item) => !filesInDto.includes(item));
        if (a.length > 0) {
          a.forEach((item) => {
            if (fs.existsSync(path.resolve(dirPath, item))) {
              fs.unlinkSync(path.resolve(dirPath, item));
            }
          });
        }
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
