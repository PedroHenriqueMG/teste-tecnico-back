import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAllOrdersUseCase } from './getAllOrdersUseCase';
import { OrderRepository } from '../../../repository/orderRepository';
import { Order } from '../../../../domain/entities/Order';

describe('GetAllOrdersUseCase', () => {
  let getAllOrdersUseCase: GetAllOrdersUseCase;
  let mockOrderRepository: any;

  beforeEach(() => {
    mockOrderRepository = {
      findAll: vi.fn(),
    };

    getAllOrdersUseCase = new GetAllOrdersUseCase(mockOrderRepository);
  });

  it('should successfully get all orders with pagination', async () => {
    const orders = [
      new Order({
        lab: 'Lab A',
        patient: 'John Doe',
        customer: 'Customer X',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab B',
        patient: 'Jane Smith',
        customer: 'Customer Y',
        state: 'ANALYSIS',
        status: 'ACTIVE',
        services: [{ name: 'Urinalysis', value: 30, status: 'PENDING' }],
      }),
    ];

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.page).toBe(1);
    expect(result.rowPerPage).toBe(10);
    expect(result.total).toBe(2);
    expect(result.orders).toHaveLength(2);
  });

  it('should filter orders by state', async () => {
    const orders = [
      new Order({
        lab: 'Lab A',
        patient: 'John Doe',
        customer: 'Customer X',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab B',
        patient: 'Jane Smith',
        customer: 'Customer Y',
        state: 'ANALYSIS',
        status: 'ACTIVE',
        services: [{ name: 'Urinalysis', value: 30, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab C',
        patient: 'Bob Johnson',
        customer: 'Customer Z',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'X-Ray', value: 75, status: 'PENDING' }],
      }),
    ];

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 10,
      state: 'CREATED',
    });

    expect(result.total).toBe(2);
    expect(result.orders).toHaveLength(2);
    expect(result.orders.every(order => order.state === 'CREATED')).toBe(true);
  });

  it('should paginate correctly with page 1', async () => {
    const orders = Array.from({ length: 25 }, (_, i) =>
      new Order({
        lab: `Lab ${i + 1}`,
        patient: `Patient ${i + 1}`,
        customer: `Customer ${i + 1}`,
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Test', value: 50, status: 'PENDING' }],
      })
    );

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.orders).toHaveLength(10);
    expect(result.orders[0].lab).toBe('Lab 1');
    expect(result.orders[9].lab).toBe('Lab 10');
  });

  it('should paginate correctly with page 2', async () => {
    const orders = Array.from({ length: 25 }, (_, i) =>
      new Order({
        lab: `Lab ${i + 1}`,
        patient: `Patient ${i + 1}`,
        customer: `Customer ${i + 1}`,
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Test', value: 50, status: 'PENDING' }],
      })
    );

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 2,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.orders).toHaveLength(10);
    expect(result.orders[0].lab).toBe('Lab 11');
    expect(result.orders[9].lab).toBe('Lab 20');
  });

  it('should return partial results on last page', async () => {
    const orders = Array.from({ length: 25 }, (_, i) =>
      new Order({
        lab: `Lab ${i + 1}`,
        patient: `Patient ${i + 1}`,
        customer: `Customer ${i + 1}`,
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Test', value: 50, status: 'PENDING' }],
      })
    );

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 3,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.orders).toHaveLength(5);
    expect(result.orders[0].lab).toBe('Lab 21');
    expect(result.orders[4].lab).toBe('Lab 25');
  });

  it('should return total count correctly', async () => {
    const orders = Array.from({ length: 50 }, (_, i) =>
      new Order({
        lab: `Lab ${i + 1}`,
        patient: `Patient ${i + 1}`,
        customer: `Customer ${i + 1}`,
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Test', value: 50, status: 'PENDING' }],
      })
    );

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.total).toBe(50);
  });

  it('should return empty orders array when no results', async () => {
    mockOrderRepository.findAll.mockResolvedValue([]);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 10,
      state: undefined,
    });

    expect(result.orders).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should filter and paginate together', async () => {
    const orders = [
      new Order({
        lab: 'Lab A',
        patient: 'John Doe',
        customer: 'Customer X',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab B',
        patient: 'Jane Smith',
        customer: 'Customer Y',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Urinalysis', value: 30, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab C',
        patient: 'Bob Johnson',
        customer: 'Customer Z',
        state: 'ANALYSIS',
        status: 'ACTIVE',
        services: [{ name: 'X-Ray', value: 75, status: 'PENDING' }],
      }),
      new Order({
        lab: 'Lab D',
        patient: 'Alice Brown',
        customer: 'Customer W',
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'CT Scan', value: 100, status: 'PENDING' }],
      }),
    ];

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 1,
      rowPerPage: 2,
      state: 'CREATED',
    });

    expect(result.total).toBe(3);
    expect(result.orders).toHaveLength(2);
    expect(result.orders[0].lab).toBe('Lab A');
    expect(result.orders[1].lab).toBe('Lab B');
  });

  it('should return correct page info in response', async () => {
    const orders = Array.from({ length: 25 }, (_, i) =>
      new Order({
        lab: `Lab ${i + 1}`,
        patient: `Patient ${i + 1}`,
        customer: `Customer ${i + 1}`,
        state: 'CREATED',
        status: 'ACTIVE',
        services: [{ name: 'Test', value: 50, status: 'PENDING' }],
      })
    );

    mockOrderRepository.findAll.mockResolvedValue(orders);

    const result = await getAllOrdersUseCase.execute({
      page: 2,
      rowPerPage: 5,
      state: undefined,
    });

    expect(result.page).toBe(2);
    expect(result.rowPerPage).toBe(5);
  });
});
