import { randomUUID } from 'crypto';
import { Replace } from '../../../@types/replace';

interface UserSchema {
  email: string;
  password: string;
}

export class User {
  private props: UserSchema;
  private _id: string;

  constructor(
    props: Replace<UserSchema, { id?: string }>,
    id?: string,
  ) {
    this.props = {
      ...props,
    };
    this._id = id || randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password(): string {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
  }
}