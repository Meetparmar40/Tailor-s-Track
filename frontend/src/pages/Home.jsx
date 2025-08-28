import DextopViewHome from "../components/DextopViewHome.jsx"
import MobileViewHome from "../components/MobileViewHome.jsx";
import { useMediaQuery } from "react-responsive";


export default function HomePage(){
  const isMobile = useMediaQuery({query :"(max-width: 768px)"});
  const userName = "Meet"
  const orders = [
    {
      id: 1,
      name: "John Doe",
      date: "2025-08-15",
      orders: [
        { type: "Shirt", quantity: 2},
        { type: "Pants", quantity: 1},
        { type: "Kurta", quantity: 3 }
      ],
      tag: 1,
    },
    {
      id: 2,
      name: "Aisha Khan",
      date: "2025-08-14",
      orders: [{ type: "Kurta", quantity: 3 }],
      tag: 2,
    },
    {
      id: 3,
      name: "Ravi Patel",
      date: "2025-08-13",
      orders: [{ type: "Suit", quantity: 1}],
      tag: 0,
    },
    {
      id: 4,
      name: "Meera Singh",
      date: "2025-08-12",
      orders: [{ type: "Dress", quantity: 2 }],
      tag: 3,
    },
    {
      id: 5,
      name: "Kapil Sharma",
      date: "2025-08-12",
      orders: [{ type: "Dress", quantity: 2 }],
      tag: 0,
    },
    {
      id: 6,
      name: "Kapil Sharma",
      date: "2025-08-12",
      orders: [{ type: "Dress", quantity: 2 }],
      tag: 0,
    },
    {
      id: 7,
      name: "Kapil Sharma",
      date: "2025-08-12",
      orders: [{ type: "Dress", quantity: 2 }],
      tag: 0,
    },
    {
      id: 8,
      name: "Kapil Sharma",
      date: "2025-08-12",
      orders: [{ type: "Dress", quantity: 2 }],
      tag: 0,
    },
  ];
  return (
    <>
      {isMobile
        ? <MobileViewHome orders={orders} userName={userName} />
        : <DextopViewHome orders={orders} userName={userName} />
      }
    </>
  )
}