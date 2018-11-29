import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsSignedUpGuard } from './is-signed-up.guard';

@NgModule({
	declarations: [],
	imports: [
		CommonModule
	],
	providers: [
		IsSignedUpGuard
	]
})
export class GuardsModule { }
