import { Injectable } from '@nestjs/common';
import { OAuthAccountRepository } from './oauthaccount.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OAuthAccountEntity,
  OAuthProvider,
} from '../entities/oauth-account.entity';

@Injectable()
export class TypeOrmOAuthAccountRepository extends OAuthAccountRepository {
  constructor(
    @InjectRepository(OAuthAccountEntity)
    private readonly oauthAccountRepo: Repository<OAuthAccountEntity>
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

  async createOAuthAccount(
    provider: OAuthProvider,
    sub: string,
    email: string,
    isEmailVerified: boolean,
    id: number
  ): Promise<void> {
    await this.oauthAccountRepo.save({
      provider,
      providerSubject: sub,
      email,
      emailVerified: isEmailVerified,
      userId: id,
    });
  }
}
