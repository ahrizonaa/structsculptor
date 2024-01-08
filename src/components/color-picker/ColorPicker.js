import './ColorPicker.css';
import { Input } from '@chakra-ui/react';

function ColorPicker({ title }) {
	return (
		<div className="cp">
			<Input className="cp-input" type="color" />
			<span className="cp-title">{title}</span>
		</div>
	);
}

export default ColorPicker;
