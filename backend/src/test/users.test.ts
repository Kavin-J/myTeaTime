import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '@/app';
import { CreateUserDto } from '@dtos/users.dto';
import { UserRoute } from '@routes/users.route';
import { dbConnection } from '@/database';
import { UserService } from '@/services/users.service';
import { User } from '@/interfaces/users.interface';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});
describe('Testing Users', () => {
  const usersRoute = new UserRoute();
  const app = new App([usersRoute]);
  const userService = new UserService();
  const user = {
    email: 'wit@gmail.com',
    department: 'TZP',
    name: 'Wit Wa',
    emp_id: 'A702',
    password: 'passwordpassword',
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
  })

  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('Unit test', () => {
    it('should be user without password', async () => {
      const testUsers = await userService.findAllUser();

      expect(testUsers).not.toHaveProperty('password');
    });
  });
  describe('[GET] /users', () => {
    it('response fineAll Users', async () => {
      const response = await request(app.getServer()).get(`${usersRoute.path}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);

      // // // ตรวจสอบค่าใน response body
      response.body.data.forEach(user => {
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('email');
        expect(user).not.toHaveProperty('password'); // Assuming you don't return passwords in the response
      });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response findOne User', async () => {
      const users = await userService.findAllUser();
      let usersId = users.map(user => user._id);

      const response = await request(app.getServer()).get(`${usersRoute.path}/${usersId[0]}`);
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('email');

      usersId = ['12345', '654789', '5s5s55sa'];

      usersId.forEach(async userId => {
        const response = await request(app.getServer()).get(`${usersRoute.path}/${userId}`);
        expect(response.status).toBe(500);
      });
    });
  });

  describe('[POST] /users', () => {
    it('response Create User', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'passwordpassword',
      };

      const response = await request(app.getServer()).post(`${usersRoute.path}`).send(userData);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.message).toBe('created');
    });
    it('should response User has already exsist', async () => {
      const userData: CreateUserDto = {
        email: 'wit@gmail.com',
        password: 'passwordpassword',
      };

      const response = await request(app.getServer()).post(`${usersRoute.path}`).send(userData);
      expect(response.status).toBe(409);
      expect(response.body.message).toBe(`This email ${userData.email} already exists`);
    });
    it('should response password too short', async () => {
      const userData: CreateUserDto = {
        email: 'wit@gmail.com',
        password: 'password',
      };

      const response = await request(app.getServer()).post(`${usersRoute.path}`).send(userData);
      expect(response.status).toBe(400);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response Update User', async () => {
      const users = await userService.findAllUser();
      let usersId = users.map(user => user._id);
      const userData: User & CreateUserDto = {
        email: 'test@email.com',
        password: 'password123456',
        department: 'TSS',
        role: 'LEADER',
      };
      const response = await request(app.getServer()).put(`${usersRoute.path}/${usersId[0]}`).send(userData)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('data')      
      expect(response.body.data).toHaveProperty('email') 
      expect(response.body.data.email).toEqual('test@email.com') 
      expect(response.body.data.department).toEqual('TSS') 

      // expect(response.body).toMatchSnapshot();
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response Delete User', async () => {
      const users = await userService.findAllUser();
      let usersId = users.map(user => user._id);
    
      const response = await request(app.getServer()).delete(`${usersRoute.path}/${usersId[0]}`)
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("deleted")
    });
  });
});
