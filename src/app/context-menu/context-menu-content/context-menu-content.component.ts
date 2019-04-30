import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, HostListener, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { ContextMenuItemDirective } from '../context-menu-item.directive';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-context-menu-content',
  templateUrl: './context-menu-content.component.html',
  styleUrls: ['./context-menu-content.component.scss']
})
export class ContextMenuContentComponent implements OnInit, AfterViewInit {
  @Input() public menuItems: ContextMenuItemDirective[] = [];
  @Input() public item: any;
  @Input() public overlay: OverlayRef;
  @Output() public closeAllMenus: EventEmitter<{ event: MouseEvent }> = new EventEmitter();
  @Output() public execute: EventEmitter<{ event: MouseEvent | KeyboardEvent, item: any, menuItem: ContextMenuItemDirective }>
    = new EventEmitter();
  private subscription: Subscription = new Subscription();
  @ViewChild('menu') public menuElement: ElementRef;
  @ViewChildren('li') public menuItemElements: QueryList<ElementRef>;
  constructor() { }

  ngOnInit() {
    this.menuItems.forEach(menuItem => {
      menuItem.currentItem = this.item;
      this.subscription.add(menuItem.execute.subscribe(event => this.execute.emit({ ...event, menuItem })));
    });
  }

  stopEvent($event: MouseEvent) {
    $event.stopPropagation();
  }

  ngAfterViewInit() {
    this.overlay.updatePosition();
  }

  public onMenuItemSelect(menuItem: ContextMenuItemDirective, event: MouseEvent | KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const CommandText = menuItem.template.elementRef.nativeElement; // ._projectedViews[0].nodes[0].renderText.data.trim();
    menuItem.triggerExecute(this.item, menuItem, event);
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  public closeMenu(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) {
      return;
    }
    this.closeAllMenus.emit({ event });
  }

}
