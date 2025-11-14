import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { tagConfig } from "./constants";

export default function SheetViewHeader({
  displayName,
  isCreating,
  isOrderContext,
  mode,
  selectedTag,
  onTagChange,
  isSavingTag
}) {
  return (
    <SheetHeader className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {displayName}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-base">
            {isCreating 
              ? (mode === "createOrder" ? "Creating new order" : "Creating new customer")
              : (isOrderContext ? "Order Details" : "Customer Details")
            }
          </SheetDescription>
        </div>
        
        {!isCreating && (
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2">
              <Select 
                value={selectedTag?.toString()} 
                onValueChange={onTagChange}
                disabled={isSavingTag}
              >
                <SelectTrigger className="w-[130px] h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tagConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", config.bg)} />
                        {config.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {isSavingTag && <Spinner size="sm" className="h-3 w-3" />}
            </div>
          </div>
        )}
      </div>
    </SheetHeader>
  );
}
