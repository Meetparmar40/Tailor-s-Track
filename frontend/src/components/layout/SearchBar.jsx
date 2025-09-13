import{ Search } from "lucide-react"
export default function SearchBar(){
    return (
        <div className="flex items-center gap-2 border-[1px] rounded-xl border-slate-500 px-4 py-0 w-auto hover:bg-slate-200">
            <Search className="w-4 h-4 text-slate-500 " />
            <input type="text" placeholder="Search here..." className="mb-1 outline-none text-sm text-slate-700 placeholder:text-slate-500 bg-transparent" />
        </div>
    );
}