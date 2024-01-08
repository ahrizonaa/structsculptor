class AnimeService {
	id;
	enabled = true;
	ids;
	cancelling = false;

	constructor() {
		this.id = undefined;
		this.ids = [];
	}

	IsActive() {
		return this.ids.length != 0;
	}
	IsInactive() {
		return this.ids.length == 0;
	}
	Request(fn) {
		this.ids.push(window.requestAnimationFrame(fn));
	}
	Cancel() {
		this.cancelling = true;
		for (let id of this.ids) {
			window.cancelAnimationFrame(id);
		}
		this.ids = [];
		this.cancelling = false;
	}
}

const Anime = new AnimeService();

export default Anime;
