import {
  BarChart3,
  BellRing,
  BrainCircuit,
  Filter,
  Home,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

const MobileSidebar = () => {
  return (
    <>
      <div className="p-4 border-b border-ghost flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-electric" />
        <span className="font-bold text-xl font-display bg-clip-text text-transparent bg-gradient-to-r from-electric to-blue-500">
          ZoraPredict
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start bg-sky/20 text-charcoal hover:bg-sky/30 rounded-lg"
            >
              <Home className="mr-2 h-4 w-4 text-electric" />
              Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <TrendingUp className="mr-2 h-4 w-4 text-stone" />
            Predictions
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <Zap className="mr-2 h-4 w-4 text-stone" />
            Trading
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <BellRing className="mr-2 h-4 w-4 text-stone" />
            Alerts
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <BarChart3 className="mr-2 h-4 w-4 text-stone" />
            Analytics
          </Button>
          <Separator className="my-4 bg-ghost" />
          <h3 className="text-xs font-medium text-stone px-4 py-2">
            Neural Settings
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <Filter className="mr-2 h-4 w-4 text-stone" />
            Filters
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <BrainCircuit className="mr-2 h-4 w-4 text-stone" />
            AI Configuration
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-stone hover:text-charcoal hover:bg-sky/20 rounded-lg"
          >
            <Settings className="mr-2 h-4 w-4 text-stone" />
            Settings
          </Button>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-ghost">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback className="bg-sky text-charcoal">JP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-charcoal">
              John Patel
            </span>
            <span className="text-xs text-stone">Pro Plan</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
