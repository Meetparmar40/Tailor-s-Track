import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import logo from "../assets/images/logo.png"
import { GradualSpacing } from "./ui/TextAnimation"

export default function CompanyLogo() {
  const { state } = useSidebar()
  
  if (!logo) {
    return null
  }
  
  const [Logo, setLogo] = React.useState(logo);
  

  if (!Logo) {
    return null
  }

  return (
    <div className="flex items-center">
      <img 
        src={Logo} 
        alt="Company Logo" 
        className="h-10 w-auto object-contain mt-1"
      />
      {(state == "expanded") && <div className="font-RedHatDisplay text-slate-700">
        <GradualSpacing text="Mentro" />
      </div>}
    </div>
  );
}

const pageContent = {
  'home': {
    title: 'Dashboard',
    content: 'Welcome to your main dashboard. Here you can see an overview of all your orders and activities.'
  },
  'new-orders': {
    title: 'New Orders',
    content: 'Manage and process new incoming orders. Review customer requirements and assign to production.'
  },
  'in-progress': {
    title: 'In Progress',
    content: 'Monitor orders currently being processed. Track progress and update status as needed.'
  },
  'repair': {
    title: 'Repair',
    content: 'Handle items that require repair or rework. Manage repair schedules and quality checks.'
  },
  'done': {
    title: 'Completed Orders',
    content: 'View all completed orders ready for delivery or pickup. Generate reports and invoices.'
  },
  'customers': {
    title: 'Customer Management',
    content: 'Manage customer information, preferences, and order history. Handle customer communications.'
  },
  'measurements': {
    title: 'Measurements',
    content: 'Record and manage customer measurements. Ensure accuracy for custom orders.'
  },
  'settings': {
    title: 'Settings',
    content: 'Configure application settings, user preferences, and system parameters.'
  }
};