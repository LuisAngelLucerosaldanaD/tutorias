import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input, OnDestroy,
  Output, ViewChild
} from '@angular/core';
import {Subscription} from "rxjs";
import {NgForOf} from "@angular/common";
import {Message, ToastCloseEvent} from "../../models/ui/toast";
import {animateChild, query, transition, trigger, AnimationEvent} from "@angular/animations";
import {ToastItemComponent} from '../toast-item/toast-item.component';
import {ToastService} from '../../services/ui/toast.service';

@Component({
  selector: 'df-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [trigger('toastAnimation', [transition(':enter, :leave', [query('@*', animateChild())])])],
  imports: [
    ToastItemComponent,
    NgForOf,
    ToastItemComponent
  ]
})
export class ToastComponent implements OnDestroy {

  @Input() preventDuplicates: boolean = false;
  @Input() preventOpenDuplicates: boolean = false;
  @Output() onClose: EventEmitter<ToastCloseEvent> = new EventEmitter<ToastCloseEvent>();
  @Input() key: string | undefined;
  @Input() position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center' = 'top-right';
  @Input() showTransformOptions: string = 'translateY(100%)';
  @Input() hideTransformOptions: string = 'translateY(-100%)';
  @Input() showTransitionOptions: string = '300ms ease-out';
  @Input() hideTransitionOptions: string = '250ms ease-in';
  @ViewChild('container') containerViewChild: ElementRef | undefined;

  private messageSubscription: Subscription | undefined;
  private clearSubscription: Subscription | undefined;
  private messagesArchive: Message[] | undefined;
  public messages: Message[] = [];

  constructor(
    public messageService: ToastService,
    private cd: ChangeDetectorRef
  ) {
    this.messageSubscription = this.messageService.messageObserver.subscribe((messages) => {
      if (messages) {
        if (Array.isArray(messages)) {
          const filteredMessages = messages.filter((m) => this.canAdd(m));
          this.add(filteredMessages);
          return;
        }

        if (this.canAdd(messages)) this.add([messages]);
      }
    });

    this.clearSubscription = this.messageService.clearObserver.subscribe((key) => {
      if (!key) {
        this.messages = [];
        this.cd.markForCheck();
        return;
      }

      if (this.key === key) {
        this.messages = [];
        this.cd.markForCheck();
        return;
      }
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.clearSubscription?.unsubscribe();
  }

  private add(messages: Message[]): void {
    this.messages = this.messages ? [...this.messages, ...messages] : [...messages];

    if (this.preventDuplicates) {
      this.messagesArchive = this.messagesArchive ? [...this.messagesArchive, ...messages] : [...messages];
    }

    this.cd.markForCheck();
  }

  private canAdd(message: Message): boolean {
    let allow = this.key === message.key;

    if (allow && this.preventOpenDuplicates) {
      allow = !this.containsMessage(this.messages!, message);
    }

    if (allow && this.preventDuplicates) {
      allow = !this.containsMessage(this.messagesArchive!, message);
    }

    return allow;
  }

  private containsMessage(collection: Message[], message: Message): boolean {
    if (!collection) return false;
    return collection.find((m) => m.type === message.type && m.message == message.message) != null;
  }

  public onMessageClose(index: number): void {
    this.messages?.splice(index, 1);

    this.cd.detectChanges();
  }

  protected onAnimationEnd(event: AnimationEvent): void {
  }

}
