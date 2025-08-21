import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import { DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

const ToggleMobile = ({ serverId }: { serverId: string }) => {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden p-0" >
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 h-screen gap-0 flex">
                    <DialogTitle className="hidden">Server Navigation</DialogTitle>
                    <div className="flex p-0 h-full w-full">
                        <NavigationSidebar />
                        <ServerSidebar serverId={serverId} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default ToggleMobile;