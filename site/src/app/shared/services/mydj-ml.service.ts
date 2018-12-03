import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import User from './user/user.model';

@Injectable({
	providedIn: 'root'
})
export class MydjMlService {
	readonly API_BASE_URL = "https://cse881-mydj.appspot.com";
	topArtistsCache = {};

	constructor(private httpClient: HttpClient) { }

	getTopArtists(numArtists: number, pageNumber: number = 0): Observable<any> {
		const cacheKey = `${numArtists}:${pageNumber}`;
		if (cacheKey in this.topArtistsCache) {
			return this.topArtistsCache[cacheKey];
		}

		return this.httpClient.get(
			`${this.API_BASE_URL}/top_artists?pageSize=${numArtists}&pageNum=${pageNumber}`
		).pipe((data) => this.topArtistsCache[cacheKey] = data);
	}

	getTopArtistsMaxPageSize(pageSize: number): Observable<number> {
		return this.httpClient.get<number>(
			`${this.API_BASE_URL}/get_max_page?pageSize=${pageSize}`
		);
	}

	getPredictedArtists(user: User, numOfPredictions: number = 10) {
		return this.httpClient.post(
			`${this.API_BASE_URL}/top_n_artists?num_artists=${numOfPredictions}`, {
				gender: user.gender.toLowerCase(),
				age: user.age,
				country: user.country,
				artists_names: user.favoriteArtists.map(a => a.toLowerCase())
			}
		);
	}
}

