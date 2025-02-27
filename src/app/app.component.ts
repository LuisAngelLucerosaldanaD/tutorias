import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DropdownComponent} from './core/ui/dropdown/dropdown.component';
import {ToastService} from './core/services/ui/toast.service';
import {ToastComponent} from './core/ui/toast/toast.component';
import {ConfirmComponent} from './core/ui/confirm/confirm.component';
import {ConfirmService} from './core/services/ui/confirm.service';
import {TableComponent} from './core/ui/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DropdownComponent, ToastComponent, ConfirmComponent, TableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tutorias';
  private readonly _toastService = inject(ToastService);
  private readonly _confirmService = inject(ConfirmService);

  headers = ['position', 'name', 'weight', 'symbol'];
  dataSource = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  protected dftChange = (data: any[]) => {
    console.log(data);
  };

  protected updateData() {
    this.dataSource =  [
      {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
      {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
      {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
      {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
      {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
      {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
      {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
      {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
      {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
      {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
      {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
    ];
  }

  protected showToast() {
    this._toastService.add({type: 'success', message: 'Hello World!'});
  }

  protected updateHeaders() {
    this.headers = ['position', 'name', 'weight', 'symbol', 'test'];
  }

  protected showConfirm() {
    this._confirmService.confirm({
      header: 'Confirm',
      message: 'Are you sure?',
      key: 'confirm',
      accept: () => {
        this._toastService.add({type: 'success', message: 'Confirmed'});
      },
      reject: () => {
        this._toastService.add({type: 'error', message: 'Rejected'});
      }
    });
  }
}
