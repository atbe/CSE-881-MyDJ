import { Component, OnInit } from '@angular/core';
import Track from './track.model';
import * as querystring from 'querystring';
import { HttpClient } from '@angular/common/http';
import User from '../../services/user/user.model';
import { UserService } from '../../services/user/user.service';
import { NapsterService } from '../../services/napster.service';
declare var Napster: any;

@Component({
	selector: 'app-music-player',
	templateUrl: './music-player.component.html',
	styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit {
	tracks: Track[];
	artistCache = {};
	artistTopTracksCache = {};

	alreadyPlayedSongs: Track[] = [];

	currentTrack: Track;
	currentArtist: any;

	private readonly API_KEY = "MWRkMTAzMmEtZDg1OS00MjgxLTlkOWItYWZiZDRjZTFiZWJh";
	private readonly API_SECRET = "M2YwMWMyNmItNTUzZi00MWI3LThhYTQtZjY3MjkwM2Y4ODUy";

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private napsterService: NapsterService) {
		this.userService.likeArtist('The Beatles');
		this.userService.likeArtist('Beyonce');
		this.userService.likeArtist('Drake');
		this.userService.likeArtist('21 savage');
		this.userService.likeArtist('2pac');
		console.log(Napster);
		Napster.init({  consumerKey: this.API_KEY, isHTML5Compatible: true });
		// Napster.member.set({""})
	}

	ngOnInit() {
		const key = window.btoa(`${this.API_KEY}:${this.API_SECRET}`);
		this.http.post('https://api.napster.com/oauth/token', {
			username: "lupasaw@heros3.com",
			password: "eaUQx2HdaVxI72UV475n",
			grant_type: 'password'
		}, {headers: {"Authorization": `Basic ${key}`}}).subscribe((authData: any) => {
			console.log("HERE's some data = ");
			console.log(authData);

			Napster.player.on('ready', (e) => {
				const params = {
					"accessToken": authData['access_token'],
					"refreshToken": authData['refresh_token']
				};
				this.napsterService.setAccessToken(authData['access_token']);
				console.log("PARAMS = ");
				console.log(params);
				Napster.member.set(params);

				console.log("NAPSTER PLAYER READY");
				console.log(Napster);
				this.beginPlayback();
			});
		});
	}

	private async beginPlayback() {
		Napster.player.clearQueue();
		const artist = await this.getNextArtist();
		this.currentArtist = artist;
		const track = await this.getRandomTopTrackForArtist(artist['id']);
		this.playSong(track);
	}

	async getNextArtist(): Promise<any> {
		let artist: any = null;
		while (artist === null) {
			const artistToPlay = this.userService.getRandomArtist();
			console.log("Starting play for " + artistToPlay);
			artist = await this.getArtistId(artistToPlay);
			if (artist === null) {
				console.error("Failed to get artist = " + artistToPlay);
				continue;
			}
			return Promise.resolve(artist);
		}
	}

	async getArtistId(artistName: string): Promise<any> {
		if (artistName in this.artistCache) {
			return Promise.resolve(this.artistCache[artistName]);
		}

		return this.napsterService.getArtistId(artistName).toPromise().then((data: any) => {
			if (data['meta']['returnedCount'] !== 1) {
				return Promise.reject('Could not find artist ID for artist = ' + artistName);
			} else {
				this.artistCache[artistName] = data['search']['data']['artists'][0];
				return Promise.resolve(data['search']['data']['artists'][0]);
			}
		});
	}

	async getRandomTopTrackForArtist(artistId: string): Promise<Track> {
		if (artistId in this.artistTopTracksCache) {
			return Promise.resolve(this.getRandomTopTrackFromArtistCache(artistId));
		}

		return this.napsterService.getRandomTopTrackForArtist(artistId).toPromise().then((data) => {
			console.log("Search results:");
			console.log(data);
			this.artistTopTracksCache[artistId] = data['tracks'];
			return Promise.resolve(this.getRandomTopTrackFromArtistCache(artistId));
		});
	}

	getRandomTopTrackFromArtistCache(artistId: string): Track {
		const tracks = this.artistTopTracksCache[artistId];
		let track: Track = null;
		while (track === null) {
			track = tracks[Math.floor(Math.random() * tracks.length)];
			if (this.alreadyPlayedSongs.filter(t => t.id === track['id']).length) {
				continue;
			}
			this.alreadyPlayedSongs.push(track);
			return track;
		}
	}

	playSong(song: Track) {
		console.log("Playing song" + song.name);
		this.currentTrack = song;
		Napster.player.play(song.id.charAt(0).toUpperCase() + song.id.slice(1));
	}

	onPause() {
		Napster.player.pause();
	}

	onResume() {
		Napster.player.resume();
	}

	onNext() {
		this.getNextArtist().then((artist: any) => {
			console.log("OnNext");
			console.log(artist);
			this.currentArtist = artist;
			return this.getRandomTopTrackForArtist(artist['id']);
		}).then((track: Track) => {
			return this.playSong(track);
		});
	}
}
