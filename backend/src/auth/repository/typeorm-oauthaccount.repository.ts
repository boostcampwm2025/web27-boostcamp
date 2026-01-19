import { Injectable } from '@nestjs/common';
import { OAuthAccountRepository } from './oauthaccount.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuthAccount } from '../entities/oauth-account.entity';

@Injectable()
export class TypeOrmOAuthAccountRepository extends OAuthAccountRepository {
  constructor(
    @InjectRepository(OAuthAccount)
    private readonly oauthAccountRepo: Repository<OAuthAccount>
  ) {
    super();
  }

  async findUserIdByProviderSub(
    provider: string,
    sub: string
  ): Promise<number | null> {
    const qb = this.oauthAccountRepo.createQueryBuilder('o');
    const data = await qb
      .where('o.provider = :provider', { provider })
      .andWhere('o.providerSubject = :sub', { sub })
      .getOne();

    if (!data) {
      return null;
    }

    return data.userId;
  }
}
