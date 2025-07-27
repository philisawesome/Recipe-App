import { Link } from "react-router"
export default function Post({className}: any) {
	const style = className || "w-[300px] h-[300px] bg-slate-400"
	return <Link to="/post/1234">
		<div className={style}></div>
	</Link>
}
