import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { UserModule } from 'src/user/user.module';
import { BlogRepository } from './repository/blog.repository.interface';
import { TypeOrmBlogRepository } from './repository/typeorm-blog.repository';
import { RedisModule } from 'src/redis/redis.module';
import { BlogRedisCacheRepository } from './repository/redis-blog.cache.repository';
import { BlogCacheRepository } from './repository/blog.cache.repository.interface';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    UserModule,
    RedisModule,
    QueueModule,
  ],
  controllers: [BlogController],
  providers: [
    BlogService,
    { provide: BlogRepository, useClass: TypeOrmBlogRepository },
    { provide: BlogCacheRepository, useClass: BlogRedisCacheRepository },
  ],
  exports: [BlogRepository, BlogCacheRepository],
})
export class BlogModule {}
