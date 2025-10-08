import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "./ui/sidebar"
import { AvatarCard } from "./avatar-card"
import { Button } from "./ui/button"
//import { useAuth } from "../hooks/use-auth"

interface MenuLink {
	name: string
	link: string
	auth?: true
}

const MenuLinks: MenuLink[] = [
	{
		name: "Home",
		link: "/index", 
	},
	{
		name: "Search",
		link: "/search", 
	},
	{
		name: "My Profile",
		link: "/user/bill",
		auth: true,
	},
]

function MenuLinksComponent(props: {auth: any, closeMenu?: ()=>any}) {
	const {auth, closeMenu} = props
	return <SidebarMenu className="w-fit">
	{
	MenuLinks.filter((s: MenuLink) => auth.loggedIn || !s.auth)
	.map((s: MenuLink, i: number) => {
		return (<SidebarMenuItem key={i}>
			<SidebarMenuButton asChild>
				<a href={s.link}>
					<span className="text-xl md:text-md">
						{s.name}
					</span>
				</a>
			</SidebarMenuButton>
		</SidebarMenuItem>)
	})
	}</SidebarMenu>
}

function ProfileSection(props: {auth: any}) {
	const {auth} = props
	//const navigate = useNavigate()

	return <div className="w-fit lg:w-full gap-3 p-4 flex flex-col">
		{auth.loggedIn && <div>
			<AvatarCard user={auth.user}/>
			<Button asChild 
				className="bg-(--color-4) w-full">
				<Link to="/new-post">
					New Post
				</Link>
			</Button>
		</div>}
		{!auth.loggedIn && <div className="flex gap-2 self-center">
			<Button asChild> 
				<a href="/login">
				Login
				</a>
			</Button>
			<Button asChild variant="link">
				<a href="/signup">
					Signup
				</a>
			</Button>
		</div>}
	</div>
}

function Logo() {
	return <a href="/index" className="flex pt-2 pl-2 group-data-[collapsible=icon]:p-0">
		<div
			className="text-center title-font
			text-[2rem] group-data-[collapsible=icon]:hidden"
		>Stovetop</div>
		<img className="w-[2rem]" src="/logo.svg"/>
	</a>
}

// Navbar for desktop/tablet, see MobileSidebar for mobile variant
export function AppSidebar() {
	const auth = {}

	return <Sidebar 
			collapsible="icon"
			className="flex flex-col overflow-hidden
			justify-between invisible h-[100vh] lg:visible" side="left">
		<SidebarHeader>
			<Logo/>
		</SidebarHeader>
		<SidebarContent className={"group-data-[collapsible=icon]:hidden"}>
			<SidebarGroup className="">
				<MenuLinksComponent auth={auth}/>
			</SidebarGroup>
			<SidebarFooter className="w-full absolute bottom-0">
				<ProfileSection auth={auth}/>
			</SidebarFooter>
		</SidebarContent>
		<SidebarRail/>
	</Sidebar>
}

// Navbar for mobile, same functionality as AppSidebar
export function MobileSidebar(props: {
	open: boolean, setOpen: any}) {
	const {open, setOpen} = props
	const auth = {}//useAuth()

	return <div className="visible lg:invisible">
		{/* Menu/Navbar for mobile */ }
		{open && <div className="fixed w-[100vw] h-[100vh] top-0 left-0 p-5 pt-9 flex flex-col bg-white"> 
			<div className="flex flex-col items-center h-[100vh]">
				<Logo/>	
				<MenuLinksComponent 
					auth={auth}
					closeMenu={() => setOpen(false)}
					/>
				<ProfileSection auth={auth}/>
			</div>
		</div>}
	</div>
}

export function SidebarWrapper() {
	const [open, setOpen] = useState(false)

	return <div>
		<SidebarProvider defaultOpen={true} 
		className={open?"fixed z-3 lg:z-1":"fixed z-0 lg:z-1"}
		>
			<AppSidebar/>
			<MobileSidebar open={open} setOpen={setOpen}/>
		</SidebarProvider>

		{/* Button to open menu */ }

		<div className="visible lg:invisible absolute top-0 left-0 bg-white z-5">
			<Button 
				onClick={() => {setOpen(!open)}} 
				variant="ghost" 
				className="text-lg"
			>
				<img src="/menu-dots.svg" 
					alt="show menu" 
					className="w-[3rem]"/>
			</Button>
		</div>
	</div>
}
