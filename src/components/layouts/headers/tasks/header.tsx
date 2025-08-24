import HeaderNav from "./header-nav";
import HeaderOptions from "./header-options";

export default function Header() {
	return (
		<div className="flex w-full flex-col items-center">
			<HeaderNav />
			<HeaderOptions />
		</div>
	);
}
