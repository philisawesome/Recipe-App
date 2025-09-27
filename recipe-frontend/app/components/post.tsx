import { Link } from "react-router"
export default function Post({className}: any) {
	const style = className || 
		`bg-slate-400 
		w-[95vw] h-[95vw]
		md:w-[300px] md:h-[300px] `
	return <Link to="/post/1234">
		<div className={style}></div>
	</Link>
}
