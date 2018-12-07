import { Component, OnInit, ViewChild } from '@angular/core';
import User from '../../services/user/user.model';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { MydjMlService } from '../../services/mydj-ml.service';
import { NapsterService } from '../../services/napster.service';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material';
import { hasOwnProperty } from 'tslint/lib/utils';

@Component({
	selector: 'app-select-artists',
	templateUrl: './select-artists.component.html',
	styleUrls: ['./select-artists.component.less']
})
export class SelectArtistsComponent implements OnInit {
	currentPage: number = null;
	readonly PAGE_SIZE = 12;
	isLoading = true;
	maxPage;
	pageNumbers: number[];

	artists: any[];
	user: User;
	artistImageUrls: string[] = null;

	// MatPaginator Output
	pageEvent: PageEvent;
	@ViewChild(MatPaginator) paginator: MatPaginator;

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

		this.maxPage = await this.mydjMlService.getTopArtistsMaxPageSize(this.PAGE_SIZE).toPromise();
		this.pageNumbers = Array.from(Array(this.maxPage).keys());
		await this.loadFirstPage();
	}

	async loadFirstPage() {
		await this.loadPage();
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
		this.mydjMlService.getPredictedArtists(this.user, 50).subscribe((predictions: string[]) => {
			console.log("Here's the predictions");
			console.log(predictions);
			this.user.predictedArtists = predictions;
			this._userService.setUser(this.user);
			this.router.navigate(["/music-player"]);
		});
	}

	isArtistSelected(artistName: string): boolean {
		return this.user.favoriteArtists.indexOf(artistName) >= 0;
	}

	getArtistCoverUrl(artist: any): string {
		return this.artistImageUrls[this.artists.indexOf(artist)];
	}

	private async loadPage(): Promise<void> {
		this.isLoading = true;
		return new Promise<void>(async (res, rej) => {
			const pageNumber = this.pageEvent !== null && this.pageEvent !== undefined ? this.pageEvent.pageIndex : 0;
			console.log(pageNumber);
			this.artists = await this.mydjMlService.getTopArtists(this.PAGE_SIZE, pageNumber).toPromise();
			this.artists = await Promise.all(this.artists.map(a => this.napsterService.getArtist(a).toPromise()));
			this.artists = this.artists.filter(a => a !== null && a !== undefined);
			this.artistImageUrls = await Promise.all(this.artists.map(a => {
				return this.napsterService.getArtistCoverUrl(a['id']).toPromise()
					.then((data) => data)
					.catch((err) => "https://co.napster.com/assets/brand/napster/no-artist-image-4df82e881f8dafcae329c021b3f84af97756ef85f35735009011f6602962d323.png");
			}));
			this.isLoading = false;
			res();
		});
	}

	public onPageEvent(event: PageEvent) {
		this.pageEvent = event;
		const requestedPage = this.pageEvent.pageIndex;
		const previousPage = this.pageEvent.previousPageIndex;
		this.currentPage = requestedPage;
		this.loadPage();
	}

	public async onGoToPage(pageNum: number) {
		console.log("HMM + " + pageNum);
		console.log(this.pageEvent);
		this.currentPage = pageNum;
		this.paginator.pageIndex = this.currentPage;
		this.paginator.page.emit(
			{
				pageIndex: pageNum,
				pageSize: this.PAGE_SIZE,
				previousPageIndex: this.currentPage,
				length: this.maxPage * this.PAGE_SIZE
			} as PageEvent);
		this.loadPage();
	}
}
