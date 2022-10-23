import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class NFTHttpService {
	async fetchNFTs() {
		let r = await resolve(axios.get(`${WEB_API_BASE_URL}/nft?limit=2`));
		return r;
	}
}
