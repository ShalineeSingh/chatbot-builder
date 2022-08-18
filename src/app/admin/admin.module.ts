
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
import { NodeService } from './node-select/node-list.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BotEmulatorComponent } from './bot-emulator/bot-emulator.component';
import { ButtonModalComponent } from './node-modals/button/button-modal.component';
import { MediaModalComponent } from './node-modals/media/media-modal.component';
import { FileUploadModule } from 'ng2-file-upload';
import { CardModalComponent } from './node-modals/card/card-modal.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminRoutingComponents,
    DrawflowDirective,
    TextModalComponent,
    NodeSelectComponent,
    BotEmulatorComponent,
    ButtonModalComponent,
    MediaModalComponent,
    CardModalComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    FormsModule,
    QuillModule.forRoot(),
    NgxSliderModule,
    FileUploadModule,
  ],
  providers: [NodeService],
})
export class AdminModule { }
