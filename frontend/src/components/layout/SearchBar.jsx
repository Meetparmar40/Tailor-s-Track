import{ Search } from "lucide-react"
export default function SearchBar(){
    return (
        <div className="flex items-center gap-3 border rounded-xl px-4 py-1 w-auto bg-primary-foreground  ">
            <Search className="w-4 h-4 text-foreground " />
            <input type="text" placeholder="Search here..." className="mb-1 outline-none text-md text-accent-foreground placeholder:text-foregrond  bg-transparent" />
        </div>
    );
}