import { Component, OnInit } from '@angular/core';
import User from '../../services/user/user.model';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-select-artists',
	templateUrl: './select-artists.component.html',
	styleUrls: ['./select-artists.component.less']
})
export class SelectArtistsComponent implements OnInit {
	artists = Array.from(Array(50).keys());
	user: User;

	constructor(
		private _userService: UserService,
		private router: Router) {
		this.user = this._userService.getUser();
	}

	ngOnInit() {
	}

	toggleArtist(artistName: any) {
		console.log("Toggling " + artistName);
		if (this.user.favoriteArtists.indexOf(artistName) >= 0) {
			this.user.favoriteArtists = this.user.favoriteArtists.filter(a => a !== artistName);
			return;
		}
		this.user.favoriteArtists.push(artistName);
		console.log(this.user.favoriteArtists);
	}

	onDone() {
		this._userService.setUser(this.user);
		this.router.navigate(["/music-player"]);
	}

	isArtistSelected(artistName: string): boolean {
		return this.user.favoriteArtists.indexOf(artistName) >= 0;
	}
}
