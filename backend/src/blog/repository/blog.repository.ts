export abstract class BlogRepository {
  abstract createBlog(
    userId: number,
    domain: string,
    name: string,
    blogKey: string
  ): Promise<number>;
}
