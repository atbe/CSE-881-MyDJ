import { Injectable } from '@angular/core';
import User from './user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private storage: Storage = localStorage;

	constructor() { }

	public setUser(user: User) {
		this.storage.setItem("currentUser", JSON.stringify(user));
	}

	public getUser(): User {
		return JSON.parse(this.storage.getItem("currentUser")) as User;
	}

	public likeArtist(artistName: string, artistId: string = null) {
		const user = this.getUser();
		if (user.favoriteArtists.indexOf(artistName) === -1) {
			user.favoriteArtists.push(artistName);
			this.setUser(user);
		}
	}

	public dislikeArtist(artistName: string, artistId: string = null) {
		const user = this.getUser();
		if (user.favoriteArtists.indexOf(artistName) >= 0) {
			user.favoriteArtists = user.favoriteArtists.filter(artist => artist !== artistName);
			this.setUser(user);
		}
	}

	public logout() {
		this.storage.clear();
	}

	public getRandomArtist(): string {
		return this.getUser().favoriteArtists[Math.floor(Math.random() * this.getUser().favoriteArtists.length)];
	}
}
