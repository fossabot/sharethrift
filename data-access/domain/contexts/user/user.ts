import { UserCreatedEvent } from '../../events/user-created';
import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';

export interface UserProps extends EntityProps {
  externalId:string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

export class User<props extends UserProps> extends AggregateRoot<props> implements UserEntityReference  {
  constructor(props: props) { super(props); }

  get id(): string {return this.props.id;}
  get externalId(): string {return this.props.externalId;}
  get firstName(): string {return this.props.firstName;}
  get lastName(): string {return this.props.lastName;}
  get email(): string {return this.props.email;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  private MarkAsNew(): void {
    this.addIntegrationEvent(UserCreatedEvent,{userId: this.props.id});
  }

  public static getNewUser<props extends UserProps> (newprops:props,externalId:string,firstName:string,lastName:string,email:string): User<props> {
    newprops.externalId = externalId;
    newprops.lastName = lastName;
    newprops.email = email;
    var user = new User(newprops);
    user.setFirstName(firstName);
    user.MarkAsNew();
    return user;
  }

  public setFirstName(firstName:string): void {
    if(!this.props.firstName || this.props.firstName.length == 0) {
      throw new Error("First name is required");
    }
    if(this.props.firstName.length > 150){
      throw new Error("First name is too long");
    }
    if(this.props.firstName != firstName) {
      this.props.firstName = firstName;
    }
  }

}

export interface UserEntityReference {
  readonly id: string;
  readonly externalId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly schemaVersion?: string;
}