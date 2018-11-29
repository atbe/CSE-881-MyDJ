import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {
	MatButtonModule,
	MatFormFieldModule,
	MatGridListModule,
	MatInputModule,
	MatSelectModule,
	MatStepperModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectArtistsComponent } from './select-artists/select-artists.component';

@NgModule({
	declarations: [LoginComponent, SelectArtistsComponent],
	imports: [
		CommonModule,
		MatStepperModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatGridListModule,
		FormsModule
	]
})
export class PagesModule { }

