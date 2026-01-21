import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { UserModule } from 'src/user/user.module';
import { BlogRepository } from './repository/blog.repository';
import { TypeOrmBlogRepository } from './repository/typeorm-blog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), UserModule],
  controllers: [BlogController],
  providers: [
    BlogService,
    { provide: BlogRepository, useClass: TypeOrmBlogRepository },
  ],
})
export class BlogModule {}
