import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { COUNTRIES, Country } from './coutries';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import User from '../../services/user/user.model';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
	isLinear = false;
	firstFormGroup: FormGroup;
	ageFormGroup: FormGroup;
	genderFormGroup: FormGroup;
	countryFormGroup: FormGroup;

	countries: Country[] = COUNTRIES;

	constructor(
		private _formBuilder: FormBuilder,
		private _router: Router,
		private _userService: UserService) {}

	ngOnInit() {
		if (this._userService.getUser()) {
			this._router.navigate(["/select-artists"]);
		}

		this.firstFormGroup = this._formBuilder.group({
			nameCtrl: [Validators.required, Validators.nullValidator]
		});
		this.ageFormGroup = this._formBuilder.group({
			ageCtrl: [Validators.required, Validators.min(1)],
		});
		this.genderFormGroup = this._formBuilder.group({
			genderCtrl: [Validators.required]
		});
		this.countryFormGroup = this._formBuilder.group({
			countryCtrl: [Validators.required]
		});
	}

	onSubmit() {
		const user = {
			name: this.firstFormGroup.get('nameCtrl').value,
			age: +this.ageFormGroup.get('ageCtrl').value,
			gender: this.genderFormGroup.get('genderCtrl').value,
			country: this.countries.find(c => c.code === this.countryFormGroup.get('countryCtrl').value),
			favoriteArtists: []
		} as User;

		this._userService.setUser(user);

		this._router.navigate(["/select-artists"]);
	}
}

