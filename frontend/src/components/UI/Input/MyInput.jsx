import React from "react";

import classes from "./MyInput.module.css";

const MyInput = ({ onChange, type, placeholder, className = '' }) => {
	return (
		<input
			className={classes.input + " " + className}
			onChange={onChange}
			type={type}
			placeholder={placeholder}
		/>
	);
};

export default MyInput;
