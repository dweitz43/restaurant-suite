import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'reviewer-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit {
  @Input() showRole: boolean;
  @Input() isAdmin: boolean;
  @Input() extraControls: { name: string; control: FormControl }[] = [];
  @Input() form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  @Output() enterKeyup: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.extraControls.forEach(({ name, control }) => {
      this.form.addControl(name, control);
    });
  }

  /**
   * submit form on enter if valid
   */
  keyup() {
    if (this.form.valid) {
      this.enterKeyup.emit();
    }
  }
}
