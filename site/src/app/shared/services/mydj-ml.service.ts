import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MydjMlService {
	readonly API_BASE_URL = "https://cse881-mydj.appspot.com";

	constructor(private httpClient: HttpClient) { }

	getTopArtists(numArtists: number): Observable<any[]> {
		return this.httpClient.get(
			`${this.API_BASE_URL}/top_artists?count=${numArtists}&seed=2`
		);
	}
}

