import Layout from "@/components/Layout";
import { ProductsContext } from "@/components/ProductsContexts";
import { useState, useContext, useEffect } from "react";

export default function CheckoutPage() {
  const [ProductsInfos, setProductsInfos] = useState([]);
  const { SelectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [email, setEmail] = useState("");
  const [UserName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [AddressVisible, setAddressVisible] = useState(false);
  const [NewStreet, setNewStreet] = useState("");
  const [NewCity, setNewCity] = useState("");
  const [NewPincode, setNewPincode] = useState("");
  const [NewState, setNewState] = useState("");


  const handleAddress = () => {
    setAddressVisible(!AddressVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      let userData = null;
      if (typeof window !== "undefined") {
        userData = localStorage.getItem("User");
      }
      const parsedUser = JSON.parse(userData);
      setUserName(parsedUser?.data?.name || null);
      setEmail(parsedUser?.data?.email || null);
      setAddress(parsedUser?.data?.address || null);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const uniqueIds = [...new Set(SelectedProducts)];
        const response = await fetch("api/products?ids=" + uniqueIds.join(","));
        const json = await response.json();
        setProductsInfos(json);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (SelectedProducts.length > 0) {
      fetchProducts();
    } else {
      setProductsInfos([]);
    }
  }, [SelectedProducts, setProductsInfos]);

  async function oneMoreProduct(id) {
    const sign = '+';
    const response = await fetch("/api/Cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, _id:id, sign}),
    });

    if(response.ok){
    setSelectedProducts(prev => [...prev, id]);
    }
  }
  async function oneLessProduct(id) {
    const sign = '-';
    const response = await fetch("/api/Cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, _id:id, sign}),
    });

    if(response.ok){
      const indexToRemove = SelectedProducts.indexOf(id);
      if (indexToRemove !== -1) {
        setSelectedProducts((p) => {
          return p.filter((value, index) => index !== indexToRemove);
        });
      }
    }
    
  }

  let SubTotal = 0;
  let Delivery = 40;

  if (SelectedProducts?.length) {
    for (let id of SelectedProducts) {
      const product = ProductsInfos.find((p) => p._id === id);

      // Check if the product is found
      if (product) {
        const Price = product.price;
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
      {!SelectedProducts.length && (
        <div className="flex h-full w-full justify-center text-2xl font-bold m-5">
          <div className="p-10 flex flex-col justify-center">
            <img src="/products/emptycart.png" alt="" />
            <div className="py-10 flex justify-center text-gray-400">
              Your cart is empty!
            </div>
          </div>
        </div>
      )}

      {SelectedProducts.length ? (
        <div className="flex w-full justify-center items-center font-bold text-3xl py-4 mr-2 border-b bg-gray-200">
          Y<svg
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
          </svg>ur Cart
        </div>
      ) : (
        ""
      )}

      {SelectedProducts.length
        ? ProductsInfos.map((productInfo) => (
            <div key={productInfo._id} className="flex my-7 px-2">
              <div className="bg-gray-100 p-3 ml-5 rounded-xl shrink-0 h-fit w-1/6 max-w-32">
                <img className="w-24" src={productInfo.picture} alt="" />
              </div>
              <div className="px-6 w-5/6 my-2">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                {/* <p className="text-sm text-gray-500">
                  {productInfo.description.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p> */}
                <div className="flex">
                  <div className="grow">₹{productInfo.price}</div>
                  <div>
                    <button
                      onClick={() => oneLessProduct(productInfo._id)}
                      className="border border-emerald-400 px-2 rounded-lg text-emerald-500"
                    >
                      -
                    </button>
                    <span className="px-2 font-semibold">
                      {
                        SelectedProducts.filter((id) => id === productInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={() => oneMoreProduct(productInfo._id)}
                      className="bg-emerald-400 px-2 rounded-lg text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        : ""}

      {SelectedProducts.length ? (
                 <div className="flex flex-col items-center my-8">
                 <span
                   className="text-gray-800 border-t font-bold flex hover:cursor-pointer py-4"
                   onClick={handleAddress}
                 >
                   Change Shipping Address
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth="1.5"
                     stroke="currentColor"
                     className="w-3 h-3 mx-1"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                     />
                   </svg>
                 </span>
                 <div
                   className="px-2 text-gray-600 font-semibold flex flex-wrap items-center justify-center border border-gray-400 rounded-md"
                   style={{ textAlign: "center",marginLeft:"5%",marginRight:"5%" }}
                 >
                 </div>
               
                           {AddressVisible && (
                             <div className="flex flex-wrap justify-center w-full mt-4" style={{backgroundColor:"rgb(0,0,0,.5)"}}>
                                 <div>
                                   <input
                                     type="text"
                                     placeholder="Street..."
                                     value={NewStreet}
                                     onChange={(e) => setNewStreet(e.target.value)}
                                     className="p-1 m-2 border border-gray-300 rounded"
                                   />
                                 </div>
                                 <div>
                                   <input
                                     type="text"
                                     placeholder="City..."
                                     value={NewCity}
                                     onChange={(e) => setNewCity(e.target.value)}
                                     className="p-1 m-2 border border-gray-300 rounded"
                                   />
                                 </div>
                                 <div>
                                   <input
                                     type="text"
                                     placeholder="Pincode..."
                                     value={NewPincode}
                                     onChange={(e) => setNewPincode(e.target.value)}
                                     className="p-1 m-2 border border-gray-300 rounded"
                                   />
                                 </div>
                                 <div>
                                   <input
                                     type="text"
                                     placeholder="State..."
                                     value={NewState}
                                     onChange={(e) => setNewState(e.target.value)}
                                     className="p-1 m-2 border border-gray-300 rounded"
                                   />
                                 </div>
                             </div>
                           )}
                         </div>
      ): "" }

      {SelectedProducts.length ? (
        <>
          <form action={`/api/checkout_session?email=${encodeURIComponent(email)}&street=${encodeURIComponent(address.street)}&city=${encodeURIComponent(address.city)}&pincode=${encodeURIComponent(address.pincode)}&state=${encodeURIComponent(address.state)}`} method="POST">
            <div className="mt-20 px-10">
              <div className="flex">
                <h3 className="grow mb-2 text-gray-500">SubTotal:</h3>
                <h3 className="font-bold">₹{SubTotal}</h3>
              </div>
              <div className="flex">
                <h3 className="grow mb-2 text-gray-500">Delivery:</h3>
                <h3 className="font-bold">₹{Delivery}</h3>
              </div>
              <div className="flex my-2 border-t border-emerald-400 border-dashed">
                <h3 className="grow mb-2 text-gray-500">Total:</h3>
                <h3 className="font-bold">₹{Total}</h3>
              </div>
            </div>
            <div className="mx-5">
              <input
                type="hidden"
                name="products"
                value={SelectedProducts.join(",")}
              />
              <button
                type="submit"
                className="bg-emerald-400 py-2 rounded-lg text-white w-full my-4 shadow-emerald-200 shadow-lg"
              >
                Pay ₹{Total}
              </button>
            </div>
          </form>
        </>
      ) : (
        ""
      )}
    </Layout>
  );
}
