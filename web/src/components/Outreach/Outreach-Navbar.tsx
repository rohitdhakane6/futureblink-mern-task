import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
export default function NavBar() {
  const location = useLocation().pathname.split("/")[2];

  const navItems: { name: string; path: string }[] = [
    { name: "Sequence", path: "/outreach/sequence" },
    { name: "Outbox", path: "/outreach/outbox" },
    { name: "Lists", path: "/outreach/lists" },
    { name: "Templates", path: "/outreach/templates" },
    { name: "Email Senders", path: "/outreach/email-senders" },
  ];

  return (
    <nav className="shadow-lg w-full z-10 bg-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <a href={`${item.path}`} key={item.name}>
              <Button
                variant={
                  location === item.path.split("/")[2] ? "default" : "ghost"
                }
                key={item.name}
              >
                {item.name}
              </Button>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
