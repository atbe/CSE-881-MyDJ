import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NapsterService {
	private accessToken: string;
	readonly API_BASE_URL = "https://api.napster.com/v2.2";
	readonly IMG_BASE_URL = "https://direct.napster.com/imageserver/v2/";

	constructor(private httpClient: HttpClient) {}

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	getArtistId(artistName: string): Observable<any> {
		return this.httpClient.get(
			`${this.API_BASE_URL}/search?query=${artistName}&type=artist&per_type_limit=1`,
			{
				headers: {
					"Authorization": `Bearer ${this.accessToken}`
				}
			});
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

	getAlbumCoverImageUrl(albumId: string): string {
		return `${this.IMG_BASE_URL}/albums/${albumId}/images/500x500.jpg`;
	}
}

