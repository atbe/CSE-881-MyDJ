import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NapsterService {
	public isSetup = false;
	private readonly API_KEY = "MWRkMTAzMmEtZDg1OS00MjgxLTlkOWItYWZiZDRjZTFiZWJh";
	private readonly API_SECRET = "M2YwMWMyNmItNTUzZi00MWI3LThhYTQtZjY3MjkwM2Y4ODUy";

	private accessToken: string;
	private refreshToken: string;
	readonly API_BASE_URL = "https://api.napster.com/v2.2";

	artistCache = {};
	artistCoverUrlCache = {};
	albumCoverUrlCache = {};

	constructor(private httpClient: HttpClient) {}

	async init() {
		const key = window.btoa(`${this.API_KEY}:${this.API_SECRET}`);
		return this.httpClient.post('https://api.napster.com/oauth/token', {
			username: "lupasaw@heros3.com",
			password: "eaUQx2HdaVxI72UV475n",
			grant_type: 'password'
		}, {headers: {"Authorization": `Basic ${key}`}}).toPromise().then((authData: any) => {
			console.log("HERE's some data = ");
			console.log(authData);
			this.accessToken = authData['access_token'];
			this.refreshToken = authData['refresh_token'];
			this.isSetup = true;
			return Promise.resolve();
		});
	}

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	getArtist(artistName: string): Observable<any> {
		if (artistName in this.artistCache) {
			return of(this.artistCache[artistName]);
		}

		return this.httpClient.get(
			`${this.API_BASE_URL}/search?query=${artistName}&type=artist&per_type_limit=1`,
			{
				headers: {
					"Authorization": `Bearer ${this.accessToken}`
				}
			}).pipe(
				map(data =>  {
					if (data['meta']['returnedCount'] !== 1) {
						return null;
					} else {
						this.artistCache[artistName] = data['search']['data']['artists'][0];
						return this.artistCache[artistName];
					}
				}
			));
	}

	getRandomTopTrackForArtist(artistId: string): Observable<any> {
		return this.httpClient.get(
			`${this.API_BASE_URL}/artists/${artistId}/tracks/top?limit=30`,
			{
				headers: {
					"Authorization": `Bearer ${this.accessToken}`
				}
			});
	}

	getAccessToken() {
		return this.accessToken;
	}

	getRefreshToken() {
		return this.refreshToken;
	}

	getApiKey() {
		return this.API_KEY;
	}

	getArtistCoverUrl(artistId: string): Observable<string> {
		if (artistId in this.artistCoverUrlCache) {
			return of(this.artistCoverUrlCache[artistId]);
		}

		return this.httpClient.get(
			`${this.API_BASE_URL}/artists/${artistId}/images`,
			{
				headers: {
					"Authorization": `Bearer ${this.accessToken}`
				}
			}).pipe(
				map(data =>  {
					if (data['meta']['returnedCount'] === 0) {
						return null;
					} else {
						const images: any[] = data['images'];
						const coverUrl = images.filter(i => i['width'] === 356).pop()['url'];
						this.artistCoverUrlCache[artistId] = coverUrl;
						return coverUrl;
					}
				}
		));
	}

	getAlbumCoverUrl(albumId: string): Observable<string> {
		if (albumId in this.albumCoverUrlCache) {
			return of(this.albumCoverUrlCache[albumId]);
		}

		return this.httpClient.get(
			`${this.API_BASE_URL}/albums/${albumId}/images`,
			{
				headers: {
					"Authorization": `Bearer ${this.accessToken}`
				}
			}).pipe(
			map(data =>  {
					if (data['meta']['returnedCount'] === 0) {
						return null;
					} else {
						const images: any[] = data['images'];
						const coverUrl = images.filter(i => i['width'] === 500).pop()['url'];
						this.albumCoverUrlCache[albumId] = coverUrl;
						return coverUrl;
					}
				}
			));
	}
}

