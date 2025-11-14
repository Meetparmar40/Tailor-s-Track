import ViewToggle from "./layout/ViewToggle.jsx"
import Avatars from "@/components/layout/Avatars"
import SearchBar from "./layout/SearchBar.jsx"
import { Button } from "@/components/ui/button.jsx";
import { Share2, UserRoundPlus } from "lucide-react";
import BreadCrumbs from "@/components/BreadCrumbs"
import { useViewStore } from "@/hooks/use-view-store.js";


export default function Header({ title, description, onAddNew }) {
    const { view, setView } = useViewStore();
    const showViewToggle = title === "Dashboard";
    
    return (
        <div className="my-2">
            <div className="flex justify-between">
                <BreadCrumbs className="text-muted-foreground" />
                <div className="flex gap-2">
                  <Avatars />
                  <Button variant="outline">
                    <UserRoundPlus fill="foreground" fillOpacity="20%" />
                    <span>Add Admin</span>
                  </Button>
                </div>
            </div>
            <div className="text-accent-foreground text-2xl">{description}</div>
            <div className="flex items-center my-4 w-full">
                {showViewToggle && <ViewToggle setView={setView} view={view} />}

                <div className="flex gap-x-2 ml-auto">
                    <SearchBar />
                    <Button  variant="outline" >
                        <Share2 />
                        <p className="mb-1">Share</p>
                    </Button>
                    
                    <Button onClick={onAddNew}>
                        <span className="mb-1">+</span>
                        <span className="mb-1">Add New</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}