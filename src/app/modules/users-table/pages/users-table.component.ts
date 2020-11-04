import { Component, OnInit } from '@angular/core';
import {Sort, UsersService} from '../../../services/users.service';
import {Comment, User} from '../../../models/user.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  users: User[];
  sort: Sort = {} as Sort;
  search = '';
  userExpendedId: number;
  userComments: Observable<Comment[]>;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData(): void {
    this.usersService.getUsers()
      .subscribe(users => this.users = users);
    this.usersService.getSortData()
      .subscribe(sort => this.sort = sort);
  }

  isColumnSorted(colName: string , order: number): boolean {
    return this.sort.sortBy === colName && this.sort.order === order;
  }

  onSearch(): void {
    this.usersService.onSearch(this.search);
  }

  sortBy(sort: string): void {
    this.usersService.onSort(sort);
  }

  onOpenUserComments(user: User): void {
    this.userComments = this.usersService.fetchUserComments(user.id);
    this.userExpendedId = this.userExpendedId === user.id ? undefined : user.id;
  }

}
