// // tests/scenario.test.ts
// import request from 'supertest';
// import app from '../src/app'; // Path to your Express app
// import User from '../src/models/user'; // Path to your User model
// import Product from '../src/models/product'; // Path to your Product model

// describe('User scenario: login, create product, edit product, delete product', () => {
//   let token;
//   let productId;

//   beforeAll(async () => {
//     // Create a user and log in to get a token
//     const user = new User({ username: 'testuser', password: 'testpass' });
//     await user.save();

//     const loginResponse = await request(app)
//       .post('/auth/login')
//       .send({ username: 'testuser', password: 'testpass' });

//     token = loginResponse.body.token;
//   });

//   it('should create a new product', async () => {
//     const createResponse = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'Test Product', price: 10 });

//     expect(createResponse.status).toBe(201);
//     expect(createResponse.body).toHaveProperty('id');
//     productId = createResponse.body.id;
//   });

//   it('should edit the product', async () => {
//     const editResponse = await request(app)
//       .put(`/api/products/${productId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ name: 'Updated Test Product', price: 15 });

//     expect(editResponse.status).toBe(200);
//     expect(editResponse.body.name).toBe('Updated Test Product');
//     expect(editResponse.body.price).toBe(15);
//   });

//   it('should delete the product', async () => {
//     const deleteResponse = await request(app)
//       .delete(`/api/products/${productId}`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(deleteResponse.status).toBe(204);
//   });
// });
