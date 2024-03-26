import "./App.css";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Centered content */}
      <div>
        <Button>Click me</Button>
        <div className="mt-6">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/38688596?s=400&u=6d7b3a7ff4590d793d4e73bb2399a7020ea36d52&v=4" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
