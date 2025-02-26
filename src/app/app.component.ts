import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DropdownComponent} from './core/ui/dropdown/dropdown.component';
import {ToastService} from './core/services/ui/toast.service';
import {ToastComponent} from './core/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropdownComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tutorias';
  private readonly _toastService = inject(ToastService);

  protected showToast() {
    this._toastService.add({type: 'success', message: 'Hello World!'});
  }
}
