import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { EmailContext } from "../components/EmailContext";
import { ProductsContext } from "@/components/ProductsContexts";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mongoose from "mongoose";
import { initMongoose } from "@/lib/mongoose";
import { findAllProducts } from "./api/products";
import UserIcon from "@/components/UserIcon";
import Product from "@/components/Product";



export default function ItemView({AllProducts}) {
    const [phrase, setPhrase] = useState("");
  const router = useRouter();
  const { SelectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [IsClicked, setIsClicked] = useState(false);
  const [IsVisible, setIsVisible] = useState(false);
  const { email } = useContext(EmailContext);
  const [product, setProduct] = useState([]);
  const productId = decodeURIComponent(router?.query?.product);
  // const [itemToBuy, setitemToBuy] = useState("");

  useEffect(() => {
    if (phrase) {
      const filteredProducts = AllProducts.find(
        (p) =>
          p.name.toLowerCase().includes(phrase.toLowerCase())
      );
      if(!filteredProducts){
        setProduct(AllProducts.find((p)=> p._id === productId));
        // setitemToBuy(product._id);
      }
      else{
      setProduct(filteredProducts);
      // setitemToBuy(product._id);
      }
    }
    else{
        setProduct(AllProducts.find((p)=> p._id === productId));
        // setitemToBuy(product._id);
        // console.log(typeof itemToBuy,typeof product._id);
        // console.log(itemToBuy,product._id)
    }
  }, [phrase]);


  async function addProduct() {
    const sign = '+';
    const response = await fetch("/api/Cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, _id: product._id, sign }),
    });

    if (response.ok) {
      toast.success(`${product.name} Added to cart`, {
        style: {
          borderRadius: '50px',
        },
      });
      setSelectedProducts(prev => [...prev, product._id]);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 100);
    } else {
      if (response.status === 500) {
        toast.warn(`${product.name} Added to cart`, {
          className: 'toast',
          style: {
            borderRadius: '50px',
          },
        });
      }
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 50);
  }

 
  const handleArrow = () => {
    router.push("/homepage");
  };
  const goToCart=()=>{
    router.push("/checkout")
  }

  return (
    <>
     <div className="flex mt-4">
          <input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            type="text"
            placeholder="Search for products..."
            className="w-full mr-2 ml-4 px-4 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
          />
          <UserIcon />
        </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
      />
      <div className="w-full">
        <div className="flex flex-wrap m-3 bg-gray-200 rounded-lg">
        <div className="font-semibold text-2xl w-full flex justify-center border border-black rounded-lg mx-2">
        <div onClick={handleArrow} className="grow h-full flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </div>
            <div className="flex justify-center w-full">{product.name}</div>

        </div>
          <div className="bg-blue-100 p-5 rounded-xl min-h-64 flex items-center m-5 w-full justify-center">
            <img src={product.picture} alt="" className="max-h-96" />
          </div>
          <div className="mt-4 flex-col w-full" style={{marginLeft:"1%",marginRight:"1%"}}>
          <div className="font-semibold text-lg">{product.name}</div>
          <p className="text-sm mt-2 text-gray-700 min-h-24">{product.description && product.description.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}</p>
          <div className="pt-1">
        <div className="flex">
            <div className="text-2xl font-bold grow my-3">₹{product.price}</div>
            <div className="flex items-center align-middle mr-3">
            <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
          onClick={goToCart}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
            </div>
        </div>
            <button onClick={addProduct} className={`w-full my-1 text-white text-lg py-1 px-3 rounded-md ${IsClicked ? "bg-orange-100" : "bg-orange-300"}`}>
              Add to cart
            </button>
            {/* <button onClick={buyNow} className={`w-full my-2 text-white text-lg py-1 px-3 rounded-md bg-emerald-400`}>
              Buy Now
            </button> */}
              <form action={`/api/checkout_session_itemView?email=${email}`} method="POST">
            <div>
              <input
                type="hidden"
                name="products"
                value={product._id}
              />
              <button
                type="submit"
                className="bg-emerald-400 py-2 rounded-lg text-white w-full my-4 shadow-emerald-200 shadow-lg"
              >
                Buy Now
              </button>
              </div>
              </form>
          </div>
        </div>
        </div>
      </div>
      <div className="mt-6 mx-1">
            <div key={product.category}>
                <div>
                  <h2 className="m-5 text-3xl w-20 flex justify-center">
                    more
                  </h2>
                  <div className="flex overflow-scroll snap-x scrollbar-hide">
                    {AllProducts.filter((p) => (p.category === product.category && p.name !== product.name)).map(
                      (ProductsInfo) => (
                        <div key={ProductsInfo._id} className="snap-start">
                          <Product {...ProductsInfo} />
                        </div>
                      )
                    )}
                  </div>
                </div>
            </div>
        </div>
    </>
  );
}

export async function getServerSideProps() {
    await initMongoose();
    const AllProducts = await findAllProducts();
    return {
      props: {
        AllProducts: JSON.parse(JSON.stringify(AllProducts)),
      },
    };
  }