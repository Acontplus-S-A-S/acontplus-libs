import { Observable } from 'rxjs';
import { BaseRepository } from '../../../acontplus-utils/src/lib/services/base.repository';
import { OperationResult } from '../../../acontplus-utils/src/public-api';
import { User } from './user';

export abstract class UserRepository extends BaseRepository<User> {
  abstract getUserByEmail(email: string): Observable<OperationResult<User>>;
  abstract updateUserRole(
    userId: number,
    role: string
  ): Observable<OperationResult<User>>;
  abstract activateUser(userId: number): Observable<OperationResult<boolean>>;
  abstract deactivateUser(userId: number): Observable<OperationResult<boolean>>;
  abstract bulkDelete(userIds: number[]): Observable<OperationResult<number>>;
}
