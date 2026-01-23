import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async handleFirstLogin(userId: number): Promise<boolean> {
    const isFirstLogin =
      await this.userRepository.setFirstLoginAtIfNull(userId);
    return isFirstLogin;
  }
}
