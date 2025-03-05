import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ShipmentsComponent } from './components/shipments/shipments.component';

const routes: Routes = [
  { path: 'contacts', component: ContactsComponent },
  { path: 'shipments', component: ShipmentsComponent },
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
