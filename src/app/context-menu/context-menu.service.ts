import { Injectable, ElementRef, ComponentRef } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';
import { Subject, Subscription } from 'rxjs';
import { ContextMenuItemDirective } from './context-menu-item.directive';
import { Overlay, ScrollStrategyOptions, OverlayRef } from '@angular/cdk/overlay';
import { ContextMenuContentComponent } from './context-menu-content/context-menu-content.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  public show: Subject<IContextMenuClickEvent> = new Subject<IContextMenuClickEvent>();
  public close: Subject<CloseContextMenuEvent> = new Subject();
  private overlays: OverlayRef[] = [];
  private fakeElement: any = {
    getBoundingClientRect: (): ClientRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    })
  };

  constructor(private overlay: Overlay,
    private scrollStrategy: ScrollStrategyOptions, ) { }

  public openContextMenu(context: IContextMenuContext) {
    const { anchorElement, event } = context;
    const mouseEvent = event as MouseEvent;

    this.fakeElement.getBoundingClientRect = (): ClientRect => ({
      bottom: mouseEvent.clientY,
      height: 0,
      left: mouseEvent.clientX,
      right: mouseEvent.clientX,
      top: mouseEvent.clientY,
      width: 0,
    });
    this.closeAllContextMenus({ eventType: 'cancel', event });
    const positionStrategy = this.overlay.position().connectedTo(
      new ElementRef(anchorElement || this.fakeElement),
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' })
      .withFallbackPosition(
        { originX: 'start', originY: 'top' },
        { overlayX: 'start', overlayY: 'bottom' })
      .withFallbackPosition(
        { originX: 'end', originY: 'top' },
        { overlayX: 'start', overlayY: 'top' })
      .withFallbackPosition(
        { originX: 'start', originY: 'top' },
        { overlayX: 'end', overlayY: 'top' })
      .withFallbackPosition(
        { originX: 'end', originY: 'center' },
        { overlayX: 'start', overlayY: 'center' })
      .withFallbackPosition(
        { originX: 'start', originY: 'center' },
        { overlayX: 'end', overlayY: 'center' })
      ;
    this.overlays = [this.overlay.create({
      positionStrategy,
      panelClass: 'ngx-contextmenu',
      scrollStrategy: this.scrollStrategy.close(),
    })];
    this.attachContextMenu(this.overlays[0], context);
  }

  public attachContextMenu(overlay: OverlayRef, context: IContextMenuContext): void {
    const { event, item, menuItems, menuClass } = context;

    const contextMenuContent: ComponentRef<ContextMenuContentComponent> = overlay.attach(new ComponentPortal(ContextMenuContentComponent));
    contextMenuContent.instance.item = item;
    contextMenuContent.instance.menuItems = menuItems;
    contextMenuContent.instance.overlay = overlay;
    (<OverlayRefWithContextMenu>overlay).contextMenu = contextMenuContent.instance;

    const subscriptions: Subscription = new Subscription();
    subscriptions.add(contextMenuContent.instance.execute.asObservable()
      .subscribe((executeEvent) => this.closeAllContextMenus({ eventType: 'execute', ...executeEvent })));
    subscriptions.add(contextMenuContent.instance.closeAllMenus.asObservable()
      .subscribe((closeAllEvent) => this.closeAllContextMenus({ eventType: 'cancel', ...closeAllEvent })));
    contextMenuContent.onDestroy(() => {
      subscriptions.unsubscribe();
    });
    contextMenuContent.changeDetectorRef.detectChanges();
  }

  public closeAllContextMenus(closeEvent: CloseContextMenuEvent): void {
    if (this.overlays) {
      this.close.next(closeEvent);
      this.overlays.forEach((overlay, index) => {
        overlay.detach();
        overlay.dispose();
      });
    }
    this.overlays = [];
  }
}

export interface IContextMenuClickEvent {
  anchorElement?: Element | EventTarget;
  contextMenu?: ContextMenuComponent;
  event?: MouseEvent | KeyboardEvent;
  item: any;
  activeMenuItemIndex?: number;
}

export interface IContextMenuContext extends IContextMenuClickEvent {
  menuItems: ContextMenuItemDirective[];
  menuClass: string;
}

export interface CancelContextMenuEvent {
  eventType: 'cancel';
  event?: MouseEvent | KeyboardEvent;
}
export interface ExecuteContextMenuEvent {
  eventType: 'execute';
  event?: MouseEvent | KeyboardEvent;
  item: any;
  menuItem: ContextMenuItemDirective;
}
export type CloseContextMenuEvent = ExecuteContextMenuEvent | CancelContextMenuEvent;

export interface OverlayRefWithContextMenu extends OverlayRef {
  contextMenu?: ContextMenuContentComponent;
}

