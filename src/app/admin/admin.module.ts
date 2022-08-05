
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrawflowDirective } from '../common/directives/app-drawflow.directive';

import { AdminRoutingModule, AdminRoutingComponents } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TextModalComponent } from './node-modals/text/text-modal.component';
import { QuillModule } from 'ngx-quill';
import { NodeSelectComponent } from './node-select/node-select';

@NgModule({
  declarations: [
    AdminComponent,
    AdminRoutingComponents,
    DrawflowDirective,
    TextModalComponent,
    NodeSelectComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    FormsModule,
    QuillModule.forRoot(),
  ],
  providers: [],
})
export class AdminModule { }
