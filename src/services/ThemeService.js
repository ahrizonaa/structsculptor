import fontColorContrast from 'better-font-color-contrast';

class ThemeService {
	EdgeColor = '#EEEEEE';
	NodeColor = '#D1D1D1';
	NodeFontSize = '0.66rem';
	NodeFontFamily = 'monospace';
	NodeFontColor = '#212121';
	ArrowheadSize = 10;
	BackgroundColor = '#494949ff';

	FontDark = '#000000';
	TabsFontDark = '#00000099';
	FontLight = '#FFFFFF';
	TabsFontLight = '#FFFFFF99';
	UIDark = '#515151';
	UILight = '#FFFFFF';

	root;

	constructor() {
		this.root = document.querySelector(':root');
		this.ChangeBackground(this.BackgroundColor);
		this.root.style.setProperty('--theme-ui', this.UIDark);
		this.root.style.setProperty('--theme-font', fontColorContrast(this.UIDark));
		this.root.style.setProperty(
			'--theme-tabs-font',
			fontColorContrast(this.UIDark)
		);
	}

	ChangeBackground(color) {
		this.BackgroundColor = color;
		this.root.style.setProperty('--theme-background', this.BackgroundColor);
		this.root.style.setProperty(
			'--theme-floating-font',
			fontColorContrast(this.BackgroundColor)
		);
	}

	brightness(color) {
		var r, g, b, hsp;

		if (color.match(/^rgb/)) {
			color = color.match(
				/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
			);

			r = color[1];
			g = color[2];
			b = color[3];
		} else {
			color = +(
				'0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
			);

			r = color >> 16;
			g = (color >> 8) & 255;
			b = color & 255;
		}

		hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

		if (hsp > 127.5) {
			return 'light';
		} else {
			return 'dark';
		}
	}
}

const Theme = new ThemeService();

export default Theme;
