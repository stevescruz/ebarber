import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import AppError from '@shared/errors/AppError';

describe('AuthenticateUser', () => {
  it('should be able to authenticate a user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const user = await fakeUsersRepository.create({
      name: 'Uther the Lightbringer',
      email: 'uther@blizzard.com',
      password: 'silverorder',
    });

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const response = await authenticateUserService.execute({
      email: 'uther@blizzard.com',
      password: 'silverorder',
    });

    expect(response.user).toEqual(user);
    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: 'uther@blizzard.com',
        password: 'silverorder',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with the wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    await fakeUsersRepository.create({
      name: 'Uther the Lightbringer',
      email: 'uther@blizzard.com',
      password: 'silverorder',
    });

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await expect(
      authenticateUserService.execute({
        email: 'uther@blizzard.com',
        password: 'wrongpassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
