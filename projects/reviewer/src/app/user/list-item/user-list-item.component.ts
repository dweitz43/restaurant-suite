import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'reviewer-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent {
  @Input() loaded: boolean;
  @Input() user: User;
  @Input() isAdmin: boolean;
  @Input() isHandset: boolean;
  @Output() buttonClick: EventEmitter<boolean> = new EventEmitter<boolean>();
}
