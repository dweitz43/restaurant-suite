import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavService {
  toolbarButtonText$: Observable<string>;
  toolbarButtonClick$: Observable<string>;
  private toolbarButtonText: string;
  private toolbarButtonTextSource: Subject<string> = new Subject<string>();
  private toolbarButtonClickSource: Subject<string> = new Subject<string>();

  constructor() {
    this.toolbarButtonText$ = this.toolbarButtonTextSource.asObservable();
    this.toolbarButtonClick$ = this.toolbarButtonClickSource.asObservable();
  }

  set toolbarButton(value: string) {
    this.toolbarButtonText = value;
    this.toolbarButtonTextSource.next(this.toolbarButtonText);
  }

  clickToolbarButton() {
    this.toolbarButtonClickSource.next(this.toolbarButtonText);
  }
}
