import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { dbConnection } from '@/database';
import { UserRoute } from '@/routes/users.route';
import { UserService } from '@/services/users.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  const usersRoute = new UserRoute();
  const authRoute = new AuthRoute();
  const app = new App([usersRoute, authRoute]);
  const userService = new UserService();
  let user = {
    email: 'wit@gmail.com',
    password: 'passwordpassword',
    department: 'TZP',
    name: 'Wit Wa',
    emp_id: 'A702',
    profile_picture: '',
    role: 'ADMIN',
    subdepartment: 'GP/MANUAL',
  };

  beforeAll(async () => {
    await dbConnection();
  });
  beforeEach(async () => {
    await userService.deleteUserAll();
    await userService.createUser(user);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('[POST] /signup', () => {
    beforeEach(async () => {
      await userService.deleteUserAll()
    });

    it('response should have the Create userData', async () => {
      const response: request.Response = await request(app.getServer()).post(`${authRoute.path}/signup`).send(user);
      expect(response.status).toBe(201);
    });
    it('respose should not create user data', async () => {
      await userService.createUser(user);

      const response: request.Response = await request(app.getServer()).post(`${authRoute.path}/signup`).send(user);
      expect(response.status).toBe(409);
      expect(response.body.message).toBe(`This email already exists`);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const response: request.Response = await request(app.getServer()).post(`${authRoute.path}/login`).send(user);
      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      const setCookieHeader = response.headers['set-cookie'] as unknown as string[];
      if (Array.isArray(setCookieHeader)) {
        const hasAuthorizationCookie = setCookieHeader.some(cookie => cookie.startsWith('Authorization='));
        expect(hasAuthorizationCookie).toBe(true);
      }
    });
  });
  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const hasClearedAuthorizationCookie = (cookieheader): boolean =>
        cookieheader.some(cookie => {
          return /^Authorization=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/.test(cookie);
        });
      const loginResponse: request.Response = await request(app.getServer()).post(`${authRoute.path}/login`).send(user);
      let cookieHeader = loginResponse.headers['set-cookie'] as unknown as string[];
      expect(cookieHeader).toBeDefined();
      let hasNoCookie = hasClearedAuthorizationCookie(cookieHeader);
      expect(hasNoCookie).toBeFalsy();

      const logoutResponse = await request(app.getServer()).post(`${authRoute.path}/logout`).set('Cookie', cookieHeader);
      cookieHeader = logoutResponse.headers['set-cookie'] as unknown as string[];
      
      expect(cookieHeader).toBeDefined()

      hasNoCookie = hasClearedAuthorizationCookie(cookieHeader);
      expect(hasNoCookie).toBeTruthy();
      
    });
  });
});
