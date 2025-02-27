import {ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy} from '@angular/core';
import {DEFAULT_DIALOG_CONFIG, Dialog, DialogModule} from '@angular/cdk/dialog';
import {ConfirmContainerComponent} from '../confirm-container/confirm-container.component';
import {ConfirmService} from '../../services/ui/confirm.service';
import {Confirmation} from '../../models/ui/confirm';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dft-confirm',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DEFAULT_DIALOG_CONFIG, useValue: {hasBackdrop: false}}
  ]
})
export class ConfirmComponent implements OnDestroy {
  private readonly _dialog = inject(Dialog);
  private readonly subscription: Subscription = new Subscription();
  private _key!: string;
  private _confirmation!: Confirmation;

  constructor(
    private confirmService: ConfirmService,
  ) {
    this.subscription = this.confirmService.requireConfirmation$.subscribe((confirmation) => {
      if (!confirmation) return;

        this._confirmation = confirmation;

        if (this._confirmation.accept) {
          this._confirmation.acceptEvent = new EventEmitter();
          this._confirmation.acceptEvent.subscribe(this._confirmation.accept);
        }

        if (this._confirmation.reject) {
          this._confirmation.rejectEvent = new EventEmitter();
          this._confirmation.rejectEvent.subscribe(this._confirmation.reject);
        }

        const dialog = this._dialog.open(ConfirmContainerComponent, {
          minWidth: '300px',
          data: {
            header: this._confirmation.header,
            message: this._confirmation.message,
          },
          disableClose: true
        });

        dialog.closed.subscribe((result) => {
          if (result) {
            this._confirmation.acceptEvent?.emit();
          } else {
            this._confirmation.rejectEvent?.emit();
          }
        });

    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
