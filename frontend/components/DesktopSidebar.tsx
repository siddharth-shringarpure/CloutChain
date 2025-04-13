import { BarChart3, BellRing, BrainCircuit, ChevronDown, Filter, Home, LogOut, Settings, TrendingUp, User, Zap } from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const DesktopSidebar = () => {
  return (
    <>
      <div className="p-4 flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-purple-500" />
        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          ZoraPredict
        </span>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start bg-purple-900/20 text-white hover:bg-purple-900/30"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Predictions
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <Zap className="mr-2 h-4 w-4" />
            Trading
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <BellRing className="mr-2 h-4 w-4" />
            Alerts
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Separator className="my-4 bg-purple-900/30" />
          <h3 className="text-xs font-medium text-zinc-500 px-4 py-2">
            Neural Settings
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            AI Configuration
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-purple-900/20"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-purple-900/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback className="bg-purple-900/50 text-white">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Patel</span>
            <span className="text-xs text-zinc-500">Pro Plan</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-900 border-purple-900/30"
            >
              <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-purple-900/30" />
              <DropdownMenuItem className="hover:bg-purple-900/20 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebar;
