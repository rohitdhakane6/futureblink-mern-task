import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
export default function NavBar() {
  const location = useLocation().pathname.split("/")[1];

  const navItems: { name: string; path: string }[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Outreach", path: "/outreach" },
  ];

  return (
    <nav className="shadow-lg fixed w-full z-10 top-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <a href="/">Future Blink</a>
        </div>

        <div className="flex space-x-4">
          {navItems.map((item) => (
            <a href={`${item.path}`} key={item.name}>
              <Button
                variant={
                  location == item.path.split("/")[1] ? "default" : "ghost"
                }
                key={item.name}
              >
                {item.name}
              </Button>
            </a>
          ))}
        </div>

        <div>
          <a href="/login" className="hover:underline">
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}
