export abstract class BlogRepository {
  abstract createBlog(
    userId: number,
    domain: string,
    name: string,
    blogKey: string
  ): Promise<number>;

  abstract existsBlogByDomain(domain: string): Promise<boolean>;
  abstract existsBlogByUserId(userId: number): Promise<boolean>;
}
