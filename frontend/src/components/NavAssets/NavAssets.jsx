import { useNavigate, useLocation } from "react-router";

import { translateAssets } from "../../utils/assets";

import MyButton from "../../components/UI/Button/MyButton";

import classes from "./NavAssets.module.css";

const NavAssets = ({ tabs }) => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const user = JSON.parse(localStorage.getItem("user"));
	const forAdmin = ["users", "handbooks"]

	if (user.role !== "admin") {
		tabs = tabs.filter((tab) => !forAdmin.includes(tab));
	}
	
	
	const isActive = (key) => {
		return location.pathname === `/assets/${key}`;
	};

	return (
		<div className={classes.side}>

			{tabs.map((key) => (
				key !== 'user' &&
				<MyButton
					key={key}
					text={translateAssets(key)}
					onClick={() => navigate(`/assets/${key}`)}
					style={{ width: "100%", cursor: "pointer" }}
					isActive={isActive(key)}
				/>
			))}
		</div>
	);
};

export default NavAssets;
