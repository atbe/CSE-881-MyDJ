import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './shared/pages/login/login.component';
import { SelectArtistsComponent } from './shared/pages/select-artists/select-artists.component';

import { IsSignedUpGuard } from './shared/guards/is-signed-up.guard';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'select-artists', component: SelectArtistsComponent, canActivate: [IsSignedUpGuard] },
	{ path: '',   redirectTo: '/login', pathMatch: 'full' },
	// { path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
