import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Recipe Finder" },
  ];
}

export default function Home() {
	return <div className="">Recipe Finder Home page</div>;
}
