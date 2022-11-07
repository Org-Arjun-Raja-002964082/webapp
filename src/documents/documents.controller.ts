import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('v1/documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService
    ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.documentsService.upload(file.buffer, file.originalname, req.user);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    return this.documentsService.findAll(req.user);
  }

  @Get(':doc_id')
  @UseGuards(AuthGuard)
  findOne(@Param('doc_id') doc_id: string, @Request() req) {
    return this.documentsService.findOne(doc_id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.documentsService.remove(id, req.user);
  }
}
