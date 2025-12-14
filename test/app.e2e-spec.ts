import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth, Destinations & Bookings (e2e) - ADMIN/AGENT', () => {
  let app: INestApplication;
  let jwtToken: string;
  let destinationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@admin.com',
        password: 'Admin123!',
      })
      .expect(201);

    jwtToken = loginResponse.body.access_token;
    console.log('JWT Token recibido:', jwtToken);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login -> should return JWT token for ADMIN/AGENT', () => {
    expect(jwtToken).toBeDefined();
  });

  it('ADMIN/AGENT user -> should be able to create a destination', async () => {
    const destinationData = {
      name: 'Playa del Sol',
      country: 'México',
      city: 'Cancún',
      isActive: true,
    };

    const response = await request(app.getHttpServer())
      .post('/destinations')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(destinationData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(destinationData.name);
    destinationId = response.body.id;
  });

  it('ADMIN/AGENT user -> should be able to create a booking with valid data', async () => {
    const bookingData = {
      customerName: 'Cliente Test',
      customerEmail: 'cliente@test.com',
      destinationId: destinationId,
      travelDate: '2025-12-20',
    };

    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(bookingData)
      .expect(201);

    console.log('Booking creado:', response.body);

    expect(response.body).toHaveProperty('id');
    expect(response.body.customerName).toBe(bookingData.customerName);
    expect(response.body.customerEmail).toBe(bookingData.customerEmail);
    expect(response.body.destinationId).toBe(destinationId);
    expect(response.body.travelDate).toBe(bookingData.travelDate);
    expect(response.body.status).toBe('PENDING');
    expect(response.body).toHaveProperty('createdByUserId');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body.destination).toHaveProperty('name');
  });
});
