import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesModule } from './pages/pages.module';
import { ServicesModule } from './services/services.module';
import { GuardsModule } from './guards/guards.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		PagesModule,
		ServicesModule,
		GuardsModule
	],
	exports: [
		PagesModule,
		ServicesModule,
		GuardsModule
	]
})
export class SharedModule { }
