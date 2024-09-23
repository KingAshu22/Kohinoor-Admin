import {
  ArrowDownUp,
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
    label: "Users",
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
    url: "/office",
    icon: <ArrowDownUp />,
    label: "Office",
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
    url: "/box",
    icon: <Boxes />,
    label: "Box",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Customers",
  },
];
