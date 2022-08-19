import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { BotEditorComponent } from "./bot-editor/bot-editor.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'bot/:id', component: BotEditorComponent },
  { path: 'edit/:id', component: BotEditorComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
export const AdminRoutingComponents = [DashboardComponent, BotEditorComponent];
