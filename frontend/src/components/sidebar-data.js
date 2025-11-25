import {
  House,
  Contact,
  Ruler,
  Frame,
  Map,
  PieChart,
  Settings2,
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
      title: "Measurements",
      url: "/measurements",
      icon: Ruler,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
      ],
    },
  ],
  Orders: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
