import { Component, OnInit } from '@angular/core';
import Track from './track.model';
import * as querystring from 'querystring';
import { HttpClient } from '@angular/common/http';
declare var Napster: any;

@Component({
	selector: 'app-music-player',
	templateUrl: './music-player.component.html',
	styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit {
	tracks: Track[];

	private readonly API_KEY = "MWRkMTAzMmEtZDg1OS00MjgxLTlkOWItYWZiZDRjZTFiZWJh";
	private readonly API_SECRET = "M2YwMWMyNmItNTUzZi00MWI3LThhYTQtZjY3MjkwM2Y4ODUy";

	constructor(private http: HttpClient) {
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
				console.log("PARAMS = ");
				console.log(params);
				Napster.member.set(params);

				console.log("NAPSTER PLAYER READY");
				console.log(Napster);
				Napster.player.clearQueue();
				Napster.api.get(false, '/tracks/top', (data: any) => {
					this.tracks = data.tracks;
					console.log(this.tracks);
				});
			});
		});
	}

	playSong(song: Track) {
		console.log("Playing song" + song.name);
		Napster.player.play(song.id.charAt(0).toUpperCase() + song.id.slice(1));
	}

	onPause() {
		Napster.player.pause();
	}

	onResume() {
		Napster.player.resume();
	}

}
