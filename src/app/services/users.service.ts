import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Comment, Geo, User} from '../models/user.model';
import {map} from 'rxjs/operators';

export const usersUrl = 'https://jsonplaceholder.typicode.com/users';
export const userCommentsUrl = 'https://jsonplaceholder.typicode.com/posts?userId=';
const googleMapUri = 'https://maps.google.com/?q=';

export type Sort = {
  sortBy: string;
  order: number;
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userData: User[] = [];
  private users = new BehaviorSubject<User[]>(this.userData);
  private sort = new BehaviorSubject<Sort>({ sortBy: '', order: 1 });

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  private fetchUsers(): void {
    this.http.get<User[]>(usersUrl).pipe(map(response =>
      response.map( user =>
        ({...user,
          mapLink: this.buildMapUri(user.address.geo),
          addressDescription: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
          expanded: false
        } as User)
      ))).
    subscribe(response => {
      this.userData = response;
      this.users.next(response);
    });
  }

  buildMapUri(geo: Geo): string {
    return `${googleMapUri}${geo.lat},${geo.lng}&ll=${geo.lat},${geo.lng}&z=3`;
  }

  private setCurrentSort(sort: string): void {
    const currentSort = this.sort.getValue();
    if (sort === currentSort.sortBy) {
      this.sort.next({...currentSort, order: currentSort.order * -1});
    } else {
      this.sort.next({sortBy: sort, order: 1});
    }
  }

  private compareBy(sort: string, user: User , otherUser: User): boolean {
    if (sort === 'address') {
      return user.address.city > otherUser.address.city;
    }
    if (sort === 'company') {
      return user.company.name > otherUser.company.name;
    }
    return user[sort] > otherUser[sort];
  }

  fetchUserComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${userCommentsUrl}${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  getSortData(): Observable<Sort> {
    return this.sort.asObservable();
  }

  onSearch(search: string): void {
    if (!search) { return; }
    search = search.toLowerCase();
    const usersArray = [...this.userData];
    const filteredUsers = usersArray.filter((user) => {
      return user.name.toLowerCase().includes(search) ||
        user.phone.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.website.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.address.city.toLowerCase().includes(search) ||
        user.address.street.toLowerCase().includes(search) ||
        user.address.suite.toLowerCase().includes(search) ||
        user.company.name.toLowerCase().includes(search);
    });
    this.users.next(filteredUsers);
  }

  onSort(sort: string): void{
    const usersArray = [...this.users.getValue()];
    this.setCurrentSort(sort);
    const currentSort = this.sort.getValue();
    const comparator =
    usersArray.sort((user , otherUser) => {
      return this.compareBy(sort, user , otherUser) ? (1 * currentSort.order) : ( -1 * currentSort.order );
    });
    this.users.next(usersArray);
  }
}
