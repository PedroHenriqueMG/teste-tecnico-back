import { randomUUID } from 'crypto';
import { Replace } from '../../../@types/replace';

interface Service {
  name: string;
  value: number;
  status: 'PENDING' | 'DONE';
}

interface OrderSchema {
  lab: string;
  patient: string;
  customer: string;
  state: 'CREATED' | 'ANALYSIS' | 'COMPLETED';
  status: 'ACTIVE' | 'DELETED';
  services: Service[];
}

export class Order {
  private props: OrderSchema;
  private _id: string;

  constructor(
    props: Replace<OrderSchema, { state?: 'CREATED' | 'ANALYSIS' | 'COMPLETED'; status?: 'ACTIVE' | 'DELETED' }>,
    id?: string,
  ) {
    this.props = {
      ...props,
      state: props.state ?? 'CREATED',
      status: props.status ?? 'ACTIVE',
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get lab(): string {
    return this.props.lab;
  }

  set lab(lab: string) {
    this.props.lab = lab;
  }

  get patient(): string {
    return this.props.patient;
  }

  set patient(patient: string) {
    this.props.patient = patient;
  }

  get customer(): string {
    return this.props.customer;
  }

  set customer(customer: string) {
    this.props.customer = customer;
  }

  get state(): 'CREATED' | 'ANALYSIS' | 'COMPLETED' {
    return this.props.state;
  }

  set state(state: 'CREATED' | 'ANALYSIS' | 'COMPLETED') {
    this.props.state = state;
  }

  get status(): 'ACTIVE' | 'DELETED' {
    return this.props.status;
  }

  set status(status: 'ACTIVE' | 'DELETED') {
    this.props.status = status;
  }

  get services(): Service[] {
    return this.props.services;
  }

  set services(services: Service[]) {
    this.props.services = services;
  }
}
