import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { UserRepository } from './user.repository';
import { Role, User } from 'src/user/types/user.types';

type FixtureUser = {
  id: number;
  email: string;
  role: Role;
  balance: number;
  created_at: string;
  deleted_at: string | null;
};

type Fixture = {
  users: FixtureUser[];
};

@Injectable()
export class JsonUserRepository extends UserRepository {
  private readonly usersById: Map<number, User>;

  constructor() {
    super();
    this.usersById = new Map(loadFixture().users.map((u) => [u.id, toUser(u)]));
  }

  getById(userId: number): User | undefined {
    return this.usersById.get(userId);
  }

  verifyRole(userId: number, role: Role): boolean {
    return this.usersById.get(userId)?.role === role;
  }
}

const toUser = (u: FixtureUser): User => {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    balance: u.balance,
    createdAt: new Date(u.created_at),
    deletedAt: u.deleted_at ? new Date(u.deleted_at) : null,
  };
};

const loadFixture = (): Fixture => {
  const fixturePath = getFixturePath();

  const raw = readFileSync(fixturePath, 'utf8');
  return JSON.parse(raw) as Fixture;
};

const getFixturePath = () => {
  if (process.env.ERD_FIXTURE_PATH) {
    return process.env.ERD_FIXTURE_PATH;
  }

  const moduleRelative = resolve(__dirname, '../../mock/erd-fixture.json');
  if (existsSync(moduleRelative)) {
    return moduleRelative;
  }

  const cwdRelative = resolve(process.cwd(), 'src/mock/erd-fixture.json');
  if (existsSync(cwdRelative)) {
    return cwdRelative;
  }

  throw new Error(
    "ERD fixture not found. Set ERD_FIXTURE_PATH or ensure 'src/mock/erd-fixture.json' is available at runtime."
  );
};
