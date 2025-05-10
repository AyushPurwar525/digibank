import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSummaryComponent } from './pages/account-summary/account-summary.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'account-summary', component: AccountSummaryComponent, canActivate: [AuthGuard] },
  { path: 'account-details', component: AccountDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'transfer', component: TransferComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: 'account-details/:accountNumber', component: AccountDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'transfer/:accountNumber', component: TransferComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
