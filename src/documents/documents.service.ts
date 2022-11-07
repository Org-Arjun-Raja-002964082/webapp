import { Injectable } from '@nestjs/common';
import { UpdateDocumentDto } from './dto/update-document.dto';
import {S3} from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly documentRepository: Repository<Document>,
  ) {}

  async upload( file: Buffer, filename: string, user: any) {
    try {
    const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: file,
          Key: `${user.id}-${filename}-${uuidv4()}`
        })
        .promise();

      console.log('uploadResult: ', uploadResult);
      let document = {
        doc_id: uploadResult.Key,
        user_id: user.id,
        name: filename,
        s3_bucket_path: uploadResult.Location
      };
      await this.documentRepository.save(document);
      return  {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (err) {
      console.log(err);
      return { key: 'error', url: err.message };
    }
  }

  async findAll(user: any) {
    console.log('user: ', user);
    try{
      const user_id = user.id;
      // console.log('user_id: ', user_id);
      const filesData = await this.documentRepository.find({where: {user_id}});
      // console.log('filesData: ', filesData);
      let responseArray = [];
      if(!filesData){
        return {message: 'No files found'};
      } else {
        return filesData;
        // for(let i = 0; i < filesData.length; i++){
        //   let file = filesData[i];
        //   const doc_id = file.doc_id;
        //   await s3.getObject({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: doc_id
        //     }, (err, data) => {
        //     if(err){
        //       console.log('err: ', err);
        //       return err;
        //     }
        //     else {
        //       responseArray.push(data);
        //       return data;
        //     }
        //   }).promise();
        // }
      }
    } catch(err) {
      console.log(err);
      return {message: 'Error finding files'};
    }
  }

  async findOne(doc_id: string, user: any) {
    try {
      if(!this.fileExists(doc_id)){
        return {message: 'File not found'};
      }
      const user_id = user.id;
      const filesData = await this.documentRepository.find({where: {user_id}});
      if(!filesData){
        return {message: 'File not found'};
      }

      for(let i = 0; i < filesData.length; i++){
        let file = filesData[i];
        if(file.doc_id === doc_id){
          return file;
        }
      }
      return {message: 'File not found'};

      // const s3 = new S3();
      // const params = {
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: doc_id,
      // };
      // console.log('params: ', params);
      // const response = await s3.getObject(params).promise();
      // console.log('response: ', response);
      // return response;
    } catch(err) {
      console.log(err);
      return {message: 'Error finding file'};
    }
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  async remove(doc_id: string, user: any) {
    try{
      const user_id = user.id;
      const filesData = await this.documentRepository.find({where: {user_id}});
      if(!filesData){
        return {message: 'File Not found'};
      }
      const s3 = new S3();
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: doc_id
      },
      async (err, data) => {
        if(err)
          return err;
        else
          await this.documentRepository.delete({doc_id});
          return data;
      }).promise();
      return {message: 'File deleted successfully'};
    } catch(err) {
      console.log(err);
      return {message: 'Error deleting file'};
    }
  }

  async fileExists(doc_id) {
    try {
      console.log("hello");
      const s3 = new S3();
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: doc_id,
      };
      return await s3.headObject(params).promise();
    } catch (err) {
      console.log('err: ', err);
      return false;
    }
  }
}
