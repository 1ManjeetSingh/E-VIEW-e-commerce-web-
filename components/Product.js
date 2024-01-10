import { useState, useContext, useEffect } from "react";
import { ProductsContext } from "./ProductsContexts";
import { EmailContext } from "./EmailContext";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import handle from "@/pages/api/products";


export default function Product({ _id, name, description, price, picture }) {
  const router = useRouter();
  const { SelectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [IsClicked, setIsClicked] = useState(false);
  const [IsVisible, setIsVisible] = useState(false);
  const {email} = useContext(EmailContext);

  async function addProduct() {
    const sign = '+';
    const response = await fetch("/api/Cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, _id, sign}),
    });
    if(response.ok){
    toast.success(`${name} Added to cart`, {
      style:{
        borderRadius:'50px',
      },
    });
    setSelectedProducts(prev => [...prev, _id]);
    setIsVisible(true);
    setTimeout(()=>{
      setIsVisible(false);
    },1000);
    }else{
      if(response.status === 500){
        toast.warn(`${name} Added to cart`, {
          className: 'toast',
          style:{
            borderRadius:'50px',
          },
        });
      }
    }
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 50);
  }
  
  const handleItemView=()=>{
    router.push(`/itemView?&product=${encodeURIComponent(_id)}`)
  }


  return (
    <>
     <ToastContainer
     position="top-center"
     autoClose={1000}
     />
    <div className="m-3">
      <div className=" w-64 ">
        <div onClick={handleItemView} className="mb-2">
        <div className=" flex justify-center">
          <h3 className=" font-bold text-lg p-1">{name}</h3>
        </div>
        <div className=" bg-blue-100 p-5 rounded-xl min-h-72 flex items-center">
          <img src={picture} alt=""/>
        </div>
        {/* <p className="text-sm mt-2 text-gray-500 min-h-40">{description && description.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}</p> */}
        </div>
        <div className="flex pt-1 ">
          <div className="text-2xl font-bold grow ">₹{price}</div>
          <button onClick={addProduct} className={`text-white text-lg py-1 px-3 rounded-xl ${IsClicked ? "bg-emerald-200" : "bg-emerald-400"}`}>
            +
          </button>
        </div>
      </div>
    </div>
   </> 
  );
}