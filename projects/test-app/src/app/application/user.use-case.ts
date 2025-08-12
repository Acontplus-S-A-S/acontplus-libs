import { Injectable } from '@angular/core';
import { CreateUserCommand } from '../commands/create-user.command';
import { GetUsersQuery } from '../queries/user.query';
import { User } from '../user';
import { Observable } from 'rxjs';
import { FilterParams, PaginatedResult, PaginationParams } from '@acontplus-core';

@Injectable({
  providedIn: 'root',
})
export class UserUseCases {
  constructor(
    private createUserCommand: CreateUserCommand,
    private getUsersQuery: GetUsersQuery,
    private getUserByIdQuery: GetUsersQuery,
    private updateUserCommand: CreateUserCommand,
    private deleteUserCommand: DeleteUserCommand,
  ) {}

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    return this.createUserCommand.execute(userData);
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.updateUserCommand.execute({ id, data: userData });
  }

  deleteUser(id: number): Observable<boolean> {
    return this.deleteUserCommand.execute({ id });
  }

  getUsers(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<User>> {
    return this.getUsersQuery.execute({ pagination, filters });
  }

  getUserById(id: number): Observable<User> {
    return this.getUserByIdQuery.execute({ id });
  }
}
