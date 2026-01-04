import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdvanceOrderStatusUseCase } from './advanceOrderStatusUseCase';
import { OrderRepository } from '../../../repository/orderRepository';
import { Order } from '../../../../domain/entities/Order';
import { OrderNotFound } from '../../exceptions/OrderNotFound';
import { OrderNotBeUpdated } from '../../exceptions/OrderNotBeUpdated';

describe('AdvanceOrderStatusUseCase', () => {
  let advanceOrderStatusUseCase: AdvanceOrderStatusUseCase;
  let mockOrderRepository: any;

  beforeEach(() => {
    mockOrderRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    };

    advanceOrderStatusUseCase = new AdvanceOrderStatusUseCase(mockOrderRepository);
  });

  it('should advance order from CREATED to ANALYSIS', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const updatedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    const result = await advanceOrderStatusUseCase.execute(order.id);

    expect(result.state).toBe('ANALYSIS');
    expect(mockOrderRepository.update).toHaveBeenCalled();
  });

  it('should advance order from ANALYSIS to COMPLETED', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const updatedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'COMPLETED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    const result = await advanceOrderStatusUseCase.execute(order.id);

    expect(result.state).toBe('COMPLETED');
    expect(mockOrderRepository.update).toHaveBeenCalled();
  });

  it('should throw OrderNotFound when order does not exist', async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(
      advanceOrderStatusUseCase.execute('non-existent-id')
    ).rejects.toThrow(OrderNotFound);

    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should throw OrderNotBeUpdated when order is already COMPLETED', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'COMPLETED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    mockOrderRepository.findById.mockResolvedValue(order);

    await expect(
      advanceOrderStatusUseCase.execute(order.id)
    ).rejects.toThrow(OrderNotBeUpdated);

    expect(mockOrderRepository.update).not.toHaveBeenCalled();
  });

  it('should return the updated order', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const updatedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    const result = await advanceOrderStatusUseCase.execute(order.id);

    expect(result).toBe(updatedOrder);
    expect(result.lab).toBe('Lab A');
    expect(result.patient).toBe('John Doe');
  });

  it('should call update with the modified order', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const updatedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    await advanceOrderStatusUseCase.execute(order.id);

    expect(mockOrderRepository.update).toHaveBeenCalledWith(expect.any(Order));
    const updatedOrderArg = mockOrderRepository.update.mock.calls[0][0];
    expect(updatedOrderArg.state).toBe('ANALYSIS');
  });

  it('should maintain other order properties when advancing state', async () => {
    const order = new Order({
      lab: 'Lab B',
      patient: 'Jane Smith',
      customer: 'Customer Y',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [
        { name: 'Urinalysis', value: 30, status: 'PENDING' },
        { name: 'Blood Test', value: 50, status: 'DONE' }
      ],
    });

    const updatedOrder = new Order({
      lab: 'Lab B',
      patient: 'Jane Smith',
      customer: 'Customer Y',
      state: 'COMPLETED',
      status: 'ACTIVE',
      services: [
        { name: 'Urinalysis', value: 30, status: 'PENDING' },
        { name: 'Blood Test', value: 50, status: 'DONE' }
      ],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    const result = await advanceOrderStatusUseCase.execute(order.id);

    expect(result.lab).toBe('Lab B');
    expect(result.patient).toBe('Jane Smith');
    expect(result.customer).toBe('Customer Y');
    expect(result.services).toHaveLength(2);
  });

  it('should verify findById is called with correct order id', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const updatedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, order.id);

    mockOrderRepository.findById.mockResolvedValue(order);
    mockOrderRepository.update.mockResolvedValue(updatedOrder);

    await advanceOrderStatusUseCase.execute(order.id);

    expect(mockOrderRepository.findById).toHaveBeenCalledWith(order.id);
  });

  it('should block advancement when order status is COMPLETED', async () => {
    const order = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'COMPLETED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    mockOrderRepository.findById.mockResolvedValue(order);

    try {
      await advanceOrderStatusUseCase.execute(order.id);
      expect.fail('Should have thrown OrderNotBeUpdated');
    } catch (error) {
      expect(error).toBeInstanceOf(OrderNotBeUpdated);
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    }
  });

  it('should follow the correct state progression sequence', async () => {
    // Test CREATED -> ANALYSIS
    const createdOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'CREATED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    });

    const analysisOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'ANALYSIS',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, createdOrder.id);

    const completedOrder = new Order({
      lab: 'Lab A',
      patient: 'John Doe',
      customer: 'Customer X',
      state: 'COMPLETED',
      status: 'ACTIVE',
      services: [{ name: 'Blood Test', value: 50, status: 'PENDING' }],
    }, createdOrder.id);

    mockOrderRepository.findById.mockResolvedValue(createdOrder);
    mockOrderRepository.update.mockResolvedValue(analysisOrder);

    let result = await advanceOrderStatusUseCase.execute(createdOrder.id);
    expect(result.state).toBe('ANALYSIS');

    mockOrderRepository.findById.mockResolvedValue(analysisOrder);
    mockOrderRepository.update.mockResolvedValue(completedOrder);

    result = await advanceOrderStatusUseCase.execute(createdOrder.id);
    expect(result.state).toBe('COMPLETED');

    mockOrderRepository.findById.mockResolvedValue(completedOrder);

    await expect(
      advanceOrderStatusUseCase.execute(createdOrder.id)
    ).rejects.toThrow(OrderNotBeUpdated);
  });
});
