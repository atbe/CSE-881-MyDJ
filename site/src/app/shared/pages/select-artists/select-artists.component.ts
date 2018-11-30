import { Component, OnInit } from '@angular/core';
import User from '../../services/user/user.model';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { MydjMlService } from '../../services/mydj-ml.service';
import { NapsterService } from '../../services/napster.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-select-artists',
	templateUrl: './select-artists.component.html',
	styleUrls: ['./select-artists.component.less']
})
export class SelectArtistsComponent implements OnInit {
	isLoading = true;

	artists: any[];
	user: User;
	private artistImageUrls: string[] = null;

	constructor(
		private _userService: UserService,
		private router: Router,
		private mydjMlService: MydjMlService,
		private napsterService: NapsterService) {
		this.user = this._userService.getUser();
	}

	async ngOnInit() {
		if (!this.napsterService.isSetup) {
			await this.napsterService.init();
		}

		this.artists = await this.mydjMlService.getTopArtists(12).toPromise();
		this.artists = await Promise.all(this.artists.map(a => this.napsterService.getArtist(a).toPromise()));
		this.artistImageUrls = await Promise.all(this.artists.map(a => this.napsterService.getArtistCoverUrl(a['id']).toPromise()));
		this.isLoading = false;
	}

	toggleArtist(artist: any) {
		const artistName = artist['name'];
		console.log(artist);
		if (this.user.favoriteArtists.indexOf(artistName) >= 0) {
			this._userService.dislikeArtist(artistName);
			this.user = this._userService.getUser();
			return;
		}
		this._userService.likeArtist(artistName);
		this.user = this._userService.getUser();
	}

	onDone() {
		this._userService.setUser(this.user);
		this.router.navigate(["/music-player"]);
	}

	isArtistSelected(artistName: string): boolean {
		return this.user.favoriteArtists.indexOf(artistName) >= 0;
	}

	getArtistCoverUrl(artist: any): string {
		return this.artistImageUrls[this.artists.indexOf(artist)];
	}
}
