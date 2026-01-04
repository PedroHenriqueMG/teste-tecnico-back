import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateOrderUseCase } from './createOrderUseCase';
import { OrderRepository } from '../../../repository/orderRepository';
import { Order } from '../../../../domain/entities/Order';

describe('CreateOrderUseCase', () => {
  let createOrderUseCase: CreateOrderUseCase;
  let mockOrderRepository: any;

  beforeEach(() => {
    mockOrderRepository = {
      create: vi.fn(),
    };

    createOrderUseCase = new CreateOrderUseCase(mockOrderRepository);
  });

  it('should successfully create an order', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    expect(mockOrderRepository.create).toHaveBeenCalled();
    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should create order with correct lab', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.lab).toBe('Lab A');
  });

  it('should create order with correct patient', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'Jane Smith',
      customer: 'Customer Y',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Urinalysis', value: 30, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.patient).toBe('Jane Smith');
  });

  it('should create order with correct customer', async () => {
    const orderData = {
      lab: 'Lab B',
      patient: 'John Doe',
      customer: 'Customer Z',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.customer).toBe('Customer Z');
  });

  it('should create order with correct services', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const },
        { name: 'Urinalysis', value: 30, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.services).toHaveLength(2);
    expect(createdOrder.services[0].name).toBe('Blood Test');
    expect(createdOrder.services[1].name).toBe('Urinalysis');
  });

  it('should create order with default state CREATED', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.state).toBe('CREATED');
  });

  it('should create order with default status ACTIVE', async () => {
    const orderData = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData);

    const createdOrder = mockOrderRepository.create.mock.calls[0][0];
    expect(createdOrder.status).toBe('ACTIVE');
  });

  it('should generate unique id for each order', async () => {
    const orderData1 = {
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Blood Test', value: 50, status: 'PENDING' as const }
      ],
    };

    const orderData2 = {
      lab: 'Lab B',
      patient: 'Jane Smith',
      customer: 'Customer Y',
      state: 'CREATED' as const,
      status: 'ACTIVE' as const,
      services: [
        { name: 'Urinalysis', value: 30, status: 'PENDING' as const }
      ],
    };

    mockOrderRepository.create.mockResolvedValue(undefined);

    await createOrderUseCase.execute(orderData1);
    const order1 = mockOrderRepository.create.mock.calls[0][0];

    await createOrderUseCase.execute(orderData2);
    const order2 = mockOrderRepository.create.mock.calls[1][0];

    expect(order1.id).not.toBe(order2.id);
  });
});
