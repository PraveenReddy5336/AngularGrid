import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[contextMenu]'
})
export class ContextMenuDirective {
  @Input() public contextMenuSubject: any;
  @Input() public contextMenu: ContextMenuComponent;

  constructor(private contextMenuService: ContextMenuService) { }

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(event: MouseEvent): void {
    this.contextMenuService.show.next({
      contextMenu: this.contextMenu,
      event,
      item: this.contextMenuSubject,
    });
    event.preventDefault();
    event.stopPropagation();
  }

}
