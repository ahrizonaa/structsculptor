import './App.css';
import {
	ChakraBaseProvider,
	extendBaseTheme,
	theme as chakraTheme,
	Switch
} from '@chakra-ui/react';
import ColorPicker from './components/color-picker/ColorPicker';

import { Select, Textarea, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react';

const _theme = extendBaseTheme({
	components: {
		Button: chakraTheme.components.Button,
		Select: chakraTheme.components.Select,
		Switch: chakraTheme.components.Switch,
		Textarea: chakraTheme.components.Textarea
	}
});

function App() {
	let cvref = React.createRef();
	let cv;
	let currStructure = 'Select a Data Structure';
	let currFormat = 'Select a Format';

	useEffect(() => {
		cv = cvref.current.firstChild;
		cv.width = cvref.current.offsetWidth;
		cv.height = cvref.current.offsetHeight;
	});
	return (
		<ChakraBaseProvider theme={_theme}>
			<div className="app">
				<div className="controls-panel">
					<Select size="xs" placeholder={currStructure.name}></Select>
					<Select size="xs" placeholder={currFormat}></Select>
					<div className="toggle-panel">
						<Switch></Switch>
						<span>Directed</span>
					</div>
					<div className="examples-panel">
						<Button>1</Button>
						<Button>2</Button>
						<Button>3</Button>
					</div>

					<Textarea placeholder="Here is a sample placeholder" />
				</div>
				<div ref={cvref} className="canvas-panel">
					<canvas></canvas>
					<ColorPicker title="BG" />
					<ColorPicker title="Node" />
					<ColorPicker title="Edge" />
				</div>
			</div>
		</ChakraBaseProvider>
	);
}

export default App;
