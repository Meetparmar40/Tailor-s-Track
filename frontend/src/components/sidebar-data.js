import {
  House,
  Contact,
  Settings2,
  User,
} from "lucide-react"

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "../../assets/images/logomini.png",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: House,
      isActive: true,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Contact,
    },
    {
      title: "Account",
      url: "/account",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  Orders: [],
}
