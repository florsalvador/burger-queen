import { Link } from "react-router-dom";

interface SidebarProps {
	activePage: string,
	onClickLogout(): void
}

function Sidebar({ activePage, onClickLogout }: SidebarProps) {
	const pages = [
		{ to: "/", key: "home", label: "Menu" },
		{ to: "/orders", key: "orders", label: "Orders" }
	];
	const isActive = (link: string) => link === activePage;
	const links = pages.map(link => (
		<Link 
			key={link.key}
			to={link.to}
			className={`block py-3 px-4 rounded-l-md ${isActive(link.key) ? "bg-gray-800" : ""}`}
		>
			<p className={`py-2 pl-4 rounded-md ${isActive(link.key) ? "text-white bg-rose-400" : ""}`}>
				{link.label}
			</p>
		</Link>
	));

	return (
		<div 
			className="w-[15%] flex flex-col text-rose-400 relative" 
			style={{"backgroundColor": "#1f1d2c"}}
		>
			<div className="pl-4 pt-4">
				{links}
			</div>
			<button 
				className="absolute bottom-8 left-1/2 -translate-x-1/2" 
				data-testid="logoutBtn" onClick={onClickLogout}
			>
				{"<"} Log out
			</button>
		</div>
	);
}

export default Sidebar
