import React from "react";

import classes from "./MyButton.module.css";

const MyButton = ({ text, onClick, style, isActive, disabled, className = '' }) => {
	return (
		<button
			className={`${classes.button} ${isActive && classes.active} ${disabled && classes.disabled} ${className}`}
			onClick={onClick}
			style={style}
		>
			{text}
		</button>
	);
};

export default MyButton;
