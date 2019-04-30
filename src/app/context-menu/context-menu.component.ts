import { Component, OnInit, ContentChildren, QueryList, Input, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ContextMenuService, IContextMenuClickEvent } from './context-menu.service';
import { Subscription } from 'rxjs';
import { ContextMenuItemDirective } from './context-menu-item.directive';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'context-menu',
  template: ` `,
  styles: [`
    .cdk-overlay-container {
      position: fixed;
      z-index: 1000;
      pointer-events: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .ngx-contextmenu.cdk-overlay-pane {
      position: absolute;
      pointer-events: auto;
      box-sizing: border-box;
    }
  `],
})
export class ContextMenuComponent implements OnInit {

  @Input() public menuClass = '';

  private subscription: Subscription = new Subscription();

  public item: any;
  public event: MouseEvent | KeyboardEvent;
  @ContentChildren(ContextMenuItemDirective) public menuItems: QueryList<ContextMenuItemDirective>;
  public visibleMenuItems: ContextMenuItemDirective[] = [];

  constructor(private _contextMenuService: ContextMenuService, ) {
    this.subscription.add(this._contextMenuService.show.subscribe(menuEvent => {
      this.onMenuEvent(menuEvent);
    }));
  }

  ngOnInit() {
  }

  public onMenuEvent(menuEvent: IContextMenuClickEvent): void {
    const { contextMenu, event, item } = menuEvent;
    if (contextMenu && contextMenu !== this) {
      return;
    }
    this.event = event;
    this.item = item;
    this.setVisibleMenuItems();
    this._contextMenuService.openContextMenu({ ...menuEvent, menuItems: this.visibleMenuItems, menuClass: this.menuClass });
    // this._contextMenuService.close.asObservable().pipe(first()).subscribe(closeEvent => this.close.emit(closeEvent));
    // this.open.next(menuEvent);
  }

  public isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean {
    return this.evaluateIfFunction(menuItem.visible);
  }

  public setVisibleMenuItems(): void {
    this.visibleMenuItems = this.menuItems.filter(menuItem => this.isMenuItemVisible(menuItem));
  }

  public evaluateIfFunction(value: any): any {
    if (value instanceof Function) {
      return value(this.item);
    }
    return value;
  }

}
