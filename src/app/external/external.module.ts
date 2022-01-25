
import { NgModule } from '@angular/core';

import { ExternalRoutingModule, ExternalRoutingComponents } from './external-routing.module';
import { ExternalComponent } from './external.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ExternalComponent,
    ExternalRoutingComponents,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ExternalRoutingModule,
  ],
  providers: [],
})
export class ExternalModule { }
