import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent} from "./components/change-password/change-password.component";

const routes: Routes = [
  
    { path: "", component: ChangePasswordComponent },
    { path: "**", redirectTo: "", pathMatch: "full" }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
