import { OrdersContext } from "@/components/OrdersContext";
import { useState, useContext, useEffect } from "react";
import Layout from "@/components/Layout";
import { UserContext } from "@/components/UserContext";

export default function CheckoutPage() {
  const [OrdersInfos, setOrdersInfos] = useState([]);
  const { Orders, setOrders } = useContext(OrdersContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const uniqueIds = [...new Set(Orders)];
        const response = await fetch("api/products?ids=" + uniqueIds.join(","));
        const json = await response.json();
        setOrdersInfos(json);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (Orders.length > 0) {
      fetchProducts();
    } else {
      setOrdersInfos([]);
    }
  }, [Orders, setOrdersInfos]);

  let SubTotal = 0;
  let Delivery = 40;
  if (Orders?.length) {
    for (let id of Orders) {
      const order = OrdersInfos.find((p) => p._id === id);

      if (order) {
        const Price = order.price;
        SubTotal += Price;
      }
    }
  }
  if (SubTotal > 1000) {
    Delivery = 0;
  }
  let Total = SubTotal + Delivery;

  return (
    <Layout>
      {!Orders.length && (
        <div className="flex h-full w-full justify-center text-2xl font-bold m-5">
          <div className="p-10 flex flex-col justify-center">
            <img src="/products/emptycart.png" alt="" />
            <div className="py-10 flex justify-center text-gray-400">
              No Order Placed!
            </div>
          </div>
        </div>
      )}

      {Orders.length ? (
        <div className="flex w-full justify-center items-center font-bold text-3xl py-4 mr-2 border-b bg-gray-200">
          Y
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 pt-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          ur Orders
        </div>
      ) : (
        ""
      )}

      {Orders.length ? (
        <div className="m-3">
          {OrdersInfos.map((productInfo) => (
            <div key={productInfo._id} className="flex my-7">
              <div className="bg-gray-100 p-3 ml-5 rounded-xl shrink-0 h-fit w-1/6 max-w-32">
                <img className="w-24" src={productInfo.picture} alt="" />
              </div>
              <div className="px-6 w-5/6">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <div className="flex my-2">
                  <div className="grow">
                    ₹{productInfo.price}
                    <div>Date</div>
                    <div>on the way/Delivered</div>
                  </div>
                  <div className="p-1 mb-1">
                    <div className="flex items-center text-sm text-gray-700 border border-black p-1 rounded-md">
                      Quantity :{Orders.filter((id) => id === productInfo._id).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
}
