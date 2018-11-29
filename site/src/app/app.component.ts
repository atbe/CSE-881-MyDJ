import { Component } from '@angular/core';
import { UserService } from './shared/services/user/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.less']
})
export class AppComponent {
	title = 'MyDJ';

	constructor(
		private _userService: UserService,
		private _router: Router) {}

	public logout() {
		this._userService.logout();
		this._router.navigate(["/login"]);
	}

	public goHome() {
		this._router.navigate(["/home"]);
	}

	public isLoggedIn(): boolean {
		return this._userService.getUser() !== null;
	}
}
