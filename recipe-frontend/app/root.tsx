import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

import {
	SidebarProvider, 
	SidebarInset,
	SidebarTrigger,
} from "../src/components/ui/sidebar";
import { MobileSidebar, AppSidebar } from "../src/components/app-sidebar"

import { AuthProvider } from "./hooks/use-auth"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Recipe Finder" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
	return ( <html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://fonts.gstatic.com"/>
		<link href="https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&family=Marck+Script&display=swap" rel="stylesheet"/>
			<Meta />
			<Links />
		</head>
		<body>
			{children}
			<ScrollRestoration />
			<Scripts />
		</body>
	</html>);
}


export default function App() {
	return <AuthProvider>
		<SidebarProvider defaultOpen={true}>
			<SidebarInset>
				<div className="flex w-[100vw] justify-center pt-10 pb-10">
					<Outlet />
				</div>
				<AppSidebar/>
				<MobileSidebar/>
			</SidebarInset>
		</SidebarProvider>
	</AuthProvider>
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
