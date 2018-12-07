import { Country } from '../../pages/login/coutries';

export default interface User {
	name: string;
	age: number;
	gender: string;
	country: Country;
	favoriteArtists: string[];
	predictedArtists: string[];
}
