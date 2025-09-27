import { Link, useNavigate, useLocation } from "react-router"
import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
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
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "./ui/popover"
import { Button } from "./ui/button"
import { useAuth } from "../hooks/use-auth"

interface MenuLink {
	name: string
	link: string
	auth?: true
}

const MenuLinks: MenuLink[] = [
	{
		name: "Home",
		link: "/", 
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
				<Link to={s.link}>
					<span className="text-lg md:text-md">{s.name}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>)
	})
	}</SidebarMenu>
}

export function MobileSidebar() {
	const [open, setOpen] = useState(false)
	const auth = useAuth()
	const navigate = useNavigate()

	const location = useLocation()
	useEffect(() => {
		setOpen(false)
	}, [location.pathname])

	return <div className="visible lg:invisible">
		{open && <div className="fixed w-[100vw] h-[100vh] top-0 left-0 p-5 flex flex-col bg-white"> 
		<div className="flex flex-col items-center h-[100vh]">
			<Logo/>	
			<MenuLinksComponent 
				auth={auth}
				closeMenu={() => setOpen(false)}
				/>
			{auth.loggedIn && <div className="flex flex-col mt-2">
				<Popover>
					<PopoverTrigger className="">
						<AvatarCard/>
					</PopoverTrigger>
					<PopoverContent>
						<Button 
							variant="destructive"
							className="w-full"
							onClick={() => {
								auth.logout()
							}}>
							Logout
						</Button>
					</PopoverContent>
				</Popover>
				<Button asChild 
					className="bg-(--color-4)">
					<Link to="/new-post">
						New Post
					</Link>
				</Button>
			</div>}
			{!auth.loggedIn && <div className="flex flex-col gap-2 self-center mt-1 text-lg">
					<Button 
						variant="link"
						onClick={() => {
							navigate("/login")
						}}>
						Login
					</Button>
					<Button 
						variant="link"
						onClick={() => {
							navigate("/signup")
						}}>
						Signup
					</Button>
			</div>}
		</div>
	</div>}
	<div className="w-full fixed top-0 left-0 bg-white">
	<Button 
		onClick={() => {setOpen(!open); console.log(open)}} 
		variant="ghost" 
		className="text-lg"
	>
		<img src="/menu-dots.svg" 
			alt="show menu" 
			className="w-[30px]"/>
	</Button>
	</div>
	</div>
}

function Logo(props: {hideClass?: string}) {
	const {hideClass} = props
	return <Link to="/"><div className="flex pt-2 pl-2 group-data-[collapsible=icon]:p-0">
			<div
				className={"text-center title-font text-[2rem] "+hideClass}
			>Stovetop</div>
			<img className="w-[2rem]" src="/logo.svg"/>
		</div>
	</Link>
}

export function AppSidebar() {
	const auth = useAuth()
	const navigate = useNavigate()

	const hideClass = "group-data-[collapsible=icon]:hidden"

	return (<Sidebar 
			collapsible="icon"
			className="flex flex-col justify-between invisible lg:visible" side="left">
		<SidebarHeader>
			<Logo hideClass={hideClass}/>	
		</SidebarHeader>
		<SidebarContent className={"h-full "+hideClass}>
			<SidebarGroup className="">
				<MenuLinksComponent auth={auth}/>
			{/*
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
						</SidebarMenuButton>
					</SidebarMenuItem>

					{MenuLinks
						.filter((s: MenuLink) => auth.loggedIn || !s.auth)
						.map((s: MenuLink, i: number) => {
							return (<SidebarMenuItem key={i}>
								<SidebarMenuButton asChild>
									<Link to={s.link}>
										<span>{s.name}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>)
						})
					}
				</SidebarMenu>
					*/}
			</SidebarGroup>
			<SidebarFooter className="w-full absolute bottom-0">
			<div className="w-full gap-3 p-4 flex flex-col">
				<Popover>
					<PopoverTrigger className="">
						{auth.loggedIn && <AvatarCard/>}
					</PopoverTrigger>
					<PopoverContent>
						{auth.loggedIn && 
						<Button 
							variant="destructive"
							className="w-full"
							onClick={() => {
								auth.logout()
							}}>
							Logout
						</Button>}
					</PopoverContent>
				</Popover>
				{auth.loggedIn &&	
				<Button asChild 
					className="bg-(--color-4)">
					<Link to="/new-post">
						New Post
					</Link>
				</Button>
				}
				{!auth.loggedIn && <div className="flex gap-2 self-center">
					<Button 
						onClick={() => {navigate("/login")}}>
						Login
					</Button>
					<Button 
						variant="link"
						onClick={() => {navigate("/signup")}}>
						Signup
					</Button>
				</div>}
			</div>
			</SidebarFooter>
		</SidebarContent>
		<SidebarRail/>
	</Sidebar>)
}

export function LeftSidebar() {
	return (<Sidebar variant="inset" side="left" className="fixed bg-white">
		<SidebarHeader className="bg-white">
		</SidebarHeader>
		<SidebarContent className="bg-white">
		</SidebarContent>
	</Sidebar>)
}
