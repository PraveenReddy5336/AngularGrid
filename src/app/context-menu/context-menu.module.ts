import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ContextMenuDirective } from './context-menu.directive';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuItemDirective } from './context-menu-item.directive';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuContentComponent } from './context-menu-content/context-menu-content.component';


@NgModule({
  declarations: [
    ContextMenuDirective,
    ContextMenuComponent,
    ContextMenuItemDirective,
    ContextMenuContentComponent,
  ],
  entryComponents: [
    ContextMenuContentComponent,
  ],
  exports: [
    ContextMenuDirective,
    ContextMenuComponent,
    ContextMenuContentComponent,
    ContextMenuItemDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
  ],
})
export class ContextMenuModule {
  // public static forRoot(options?: IContextMenuOptions): ModuleWithProviders {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ContextMenuModule,
      providers: [
        ContextMenuService,
        // {
        //   provide: CONTEXT_MENU_OPTIONS,
        //   useValue: options,
        // },
      ],
    };
  }
}
