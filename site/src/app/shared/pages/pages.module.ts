import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule, MatCardModule,
	MatFormFieldModule,
	MatGridListModule,
	MatInputModule, MatRippleModule,
	MatSelectModule,
	MatStepperModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SelectArtistsComponent } from './select-artists/select-artists.component';
import { LoginComponent } from './login/login.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [LoginComponent, SelectArtistsComponent, MusicPlayerComponent],
	imports: [
		CommonModule,
		MatStepperModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatGridListModule,
		FormsModule,
		FlexLayoutModule,
		MatRippleModule,
		MatCardModule,
		HttpClientModule
	]
})
export class PagesModule { }

