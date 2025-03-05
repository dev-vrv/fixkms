import React from "react";

import classes from "./MyButton.module.css";

const MyButton = ({ text, onClick, style, isActive, disabled }) => {
	return (
		<button
			className={`${classes.button} ${isActive && classes.active} ${disabled && classes.disabled}`}
			onClick={onClick}
			style={style}
		>
			{text}
		</button>
	);
};

export default MyButton;
