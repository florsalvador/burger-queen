interface HeaderProps {
	role: string | null
}

function Header({ role }: HeaderProps) {
	return (
		<div 
			className="
				flex justify-between py-4 px-8 sticky top-0 z-20 
				box-border text-slate-300 bg-gray-800 shadow-md"
		>
			<h1 className="text-2xl font-semibold">
				Burger Queen
			</h1>
			<p className="self-end">Welcome {role}</p>
		</div>
	);
}

export default Header
