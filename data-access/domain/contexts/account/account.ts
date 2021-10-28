import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
import { Passport } from '../iam/passport';
import { User, UserProps } from '../user/user';
import { Contact, ContactEntityReference, ContactProps } from './contact';
import { RoleProps, RoleEntityReference } from './role';

export interface AccountProps extends EntityProps {
  name: string;
  contacts: ContactProps[];
  roles: RoleProps[];
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

const adminRoleName = "Administrator";

export class Account<props extends AccountProps> extends AggregateRoot<props> implements AccountEntityReference  {
  constructor(props: props) { super(props); }

  get name(): string {return this.props.name;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}
  get contacts(): Contact[] {return this.props.contacts.map(contact => new Contact(contact));}

  static CreateInitialAccountForNewUser<newPropType extends AccountProps, userProps extends UserProps>(newUser:User<userProps>, props:newPropType): Account<newPropType> {
    props.name = newUser.id;
    var account = new Account(props);
    account.addContact(newUser);
    account.addDefaultRoles();
    account.assignRoleToContact(account.props.roles.find(x => x.roleName === adminRoleName), account.contacts[0]);
    account.markAsNew();
    return account;
  }

  private addContact<userProps extends UserProps>(newUser:User<userProps>): void {
    var contact = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    } as ContactProps;
    contact.addUser(newUser);
    this.props.contacts.push(contact);
  }

  private assignRoleToContact(role: RoleProps, contact: Contact): void {
    if(!this.props.roles.includes(role)) {
      throw new Error('Role does not exist');
    }
    var verifiedRole = this.props.roles[this.props.roles.indexOf(role)];
    if(!this.props.contacts.includes(contact.props)) {
      throw new Error('Contact does not exist');
    }
    var verifiedAccountContact = this.props.contacts[this.props.contacts.indexOf(contact.props)];
    if(verifiedAccountContact.role.id === role.id) {
      throw new Error('Contact already has role');
    }
    verifiedAccountContact.role = verifiedRole;
  }

  private addDefaultRoles(): void {
    this.props.roles.push({
      id: "",
      roleName: adminRoleName,
      isDefault: true,
      permissions: {
        accountPermissions: {
          canManageRolesAndPermissions:true
        } ,
        listingPermissions: {
          canManageListings: true
        } 
      },
      } as RoleProps);
  }

  private markAsNew(): void {
    //create integraiton event 
  }

  deleteRoleAndReassignTo(roleToDelete: RoleEntityReference, roleToAssignTo: RoleEntityReference, passport:Passport): void {
    if(!passport.forAcccount(this).determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot delete role');
    }
    if(!this.props.roles.includes(roleToDelete)) {
      throw new Error('Role to delete does not exist');
    }
    if(!this.props.roles.includes(roleToAssignTo)) {
      throw new Error('Role to assign to does not exist');
    }
    if(roleToDelete.isDefault) {
      throw new Error('Cannot delete default role');
    }
    this.props.contacts.forEach(contact => {
      if(contact.role.id === roleToDelete.id) {
        contact.role = roleToAssignTo;
      }
    });
    this.props.roles.splice(this.props.roles.indexOf(roleToDelete), 1);
  }
  
}

export interface AccountEntityReference extends Readonly<EntityProps> {
  readonly name: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly schemaVersion: string;
  readonly contacts: ContactEntityReference[];
}

export interface AccountPermissions {
  canManageRolesAndPermissions: boolean;
} 