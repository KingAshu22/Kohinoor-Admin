import {
  Boxes,
  Brush,
  Goal,
  LayoutDashboard,
  Package,
  Pipette,
  Shapes,
  ShoppingBag,
  Tag,
  User,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "Collections",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Products",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Orders",
  },
  {
    url: "/vendors",
    icon: <User />,
    label: "Vendors",
  },
  {
    url: "/raw-material",
    icon: <Goal />,
    label: "Raw Material",
  },
  {
    url: "/polish",
    icon: <Brush />,
    label: "Polish",
  },
  {
    url: "/color",
    icon: <Pipette />,
    label: "Color",
  },
  {
    url: "/packaging",
    icon: <Package />,
    label: "Packaging",
  },
  {
    url: "/boxes",
    icon: <Boxes />,
    label: "Boxes",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Customers",
  },
];
