import { Component, OnDestroy, OnInit } from '@angular/core';
import Track from './track.model';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user/user.service';
import { NapsterService } from '../../services/napster.service';

declare var Napster: any;

@Component({
	selector: 'app-music-player',
	templateUrl: './music-player.component.html',
	styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {

	tracks: Track[];
	artistTopTracksCache = {};
	trackCache = {};

	alreadyPlayedSongs: Track[] = [];

	currentTrack: Track = null;
	currentArtist: any;
	isPlaying = false;
	currentTrackTotalTime: number;
	currentTrackCurrentTime: number;
	progressPercent: number;

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private napsterService: NapsterService) {

		// temporary
		// this.userService.likeArtist('The Beatles');
		// this.userService.likeArtist('Beyonce');
		// this.userService.likeArtist('Drake');
		// this.userService.likeArtist('21 savage');
		// this.userService.likeArtist('2pac');

		Napster.init({  consumerKey: this.napsterService.getApiKey(), isHTML5Compatible: true });
	}

	async ngOnInit() {
		if (!this.napsterService.isSetup) {
			await this.napsterService.init();
		}

		Napster.player.on('ready', (e) => {
			const params = {
				"accessToken": this.napsterService.getAccessToken(),
				"refreshToken": this.napsterService.getRefreshToken()
			};
			this.napsterService.setAccessToken(this.napsterService.getAccessToken());
			console.log("PARAMS = ");
			console.log(params);
			Napster.member.set(params);

			console.log("NAPSTER PLAYER READY");
			console.log(Napster);
			this.beginPlayback();
		});

		Napster.player.on('playevent', (e) => {
			const playing = e.data.playing;
			const paused = e.data.paused;
			const currentTrack = e.data.id.toLowerCase();

			console.log(playing);
			console.log(paused);
			console.log(currentTrack);

			// user clicked previous button
			console.log(this.trackCache);
			if (this.currentTrack !== null && this.currentTrack.id.toLowerCase() !== currentTrack) {
				const track: Track = this.trackCache[currentTrack];
				this.currentTrack = track;
				this.currentArtist = this.napsterService.getArtist(track.artistName);
			}
		});
	}

	ngOnDestroy() {
		this.onPause();
		Napster.member.unset();
	}

	private async beginPlayback() {
		Napster.player.clearQueue();
		await this.onPlayNextArtist();
	}

	async getNextArtist(): Promise<any> {
		let artist: any = null;
		while (artist === null) {
			const artistToPlay = this.userService.getRandomArtist();
			console.log("Starting play for " + artistToPlay);
			artist = await this.getArtist(artistToPlay);
			if (artist === null) {
				console.error("Failed to get artist = " + artistToPlay);
				continue;
			}
			return Promise.resolve(artist);
		}
	}

	getArtist(artistName: string): Promise<any> {
		return this.napsterService.getArtist(artistName).toPromise();
	}

	async getRandomTopTrackForArtist(artistId: string): Promise<Track> {
		if (artistId in this.artistTopTracksCache) {
			return Promise.resolve(this.getRandomTopTrackFromArtistCache(artistId));
		}

		return this.napsterService.getRandomTopTrackForArtist(artistId).toPromise().then((data) => {
			console.log(artistId);
			console.log("Search results:");
			console.log(data);
			this.artistTopTracksCache[artistId] = data['tracks'];
			return Promise.resolve(this.getRandomTopTrackFromArtistCache(artistId));
		});
	}

	getRandomTopTrackFromArtistCache(artistId: string): Track {
		const tracks = this.artistTopTracksCache[artistId];
		if (tracks.length === 0) {
			return null;
		}
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
		this.trackCache[song.id] = song;
		Napster.player.play(song.id.charAt(0).toUpperCase() + song.id.slice(1));
		this.isPlaying = true;
	}

	onPause() {
		Napster.player.pause();
		this.isPlaying = false;
	}

	onResume() {
		Napster.player.resume();
		this.isPlaying = true;
	}

	onLike(artistName: string) {
		this.userService.likeArtist(artistName);
	}

	onDislike(artistName: string) {
		this.userService.dislikeArtist(artistName);
	}

	onPrevious() {
		Napster.player.previous();
	}

	async onPlayNextArtist() {
		let artist = await this.getNextArtist();
		this.currentArtist = artist;
		let track: Track = null;
		while (track === null) {
			track = await this.getRandomTopTrackForArtist(artist['id']);
			if (track === null) {
				artist = await this.getNextArtist();
			}
		}
		track['coverImgUrl'] = await this.napsterService.getAlbumCoverUrl(track.albumId).toPromise();
		this.playSong(track);
	}
}
