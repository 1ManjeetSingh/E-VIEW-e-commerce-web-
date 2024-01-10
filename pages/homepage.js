import { useEffect, useState, useContext } from "react";
import Product from "@/components/Product";
import React from "react";
import { initMongoose } from "@/lib/mongoose";
import { findAllProducts } from "./api/products";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { UserContext } from "@/components/UserContext";
import UserIcon from "@/components/UserIcon";
import { toast } from "react-toastify";
import { OrdersContext } from "@/components/OrdersContext";
import { ProductsContext } from "@/components/ProductsContexts";
import { EmailContext } from "@/components/EmailContext";



const FilterCategoryButton = ({ label, onClick, isSelected }) => (
  <div
    className={`rounded-md p-1 border m-1 text-sm cursor-pointer ${isSelected ? 'bg-emerald-200' : 'bg-gray-200'}`}
    onClick={onClick}
  >
    {label}
  </div>
);
const FilterBrandButton = ({ label, onClick, isSelected }) => (
  <div
    className={`rounded-md p-1 border m-1 text-sm cursor-pointer ${isSelected ? 'bg-violet-200' : 'bg-orange-100'}`}
    onClick={onClick}
  >
    {label}
  </div>
);

export default function Home({ InitialProducts }) {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const categoriesName = [...new Set(InitialProducts.map((p) => p.category))];
  const { User, setUser } = useContext(UserContext);
  const { Orders, setOrders } = useContext(OrdersContext);
  const { SelectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [Products, setProducts] = useState(InitialProducts);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedBrandFilters,setSelectedBrandFilters] = useState([]);
  const [categoryBrandsVisible, setCategoryBrandsVisible] = useState({});
  const {email,setEmail} = useContext(EmailContext);


  //can make brands in product schema but i only want to show perticular famous brands.
  //can add price filters in brands.
  const brandsName = {
    mobile: ["iphone", "galaxy", "vivo","redmi"],
    audio: ["sony","galaxy Bud","Airpods"],
    laptop: ["Asus","MSI","Macbook"],
    Books: ["Adventure","Love Story","Fantasy","Knowledge","finance"],
  };

  const handleCategorySearch = (category) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(category)) {
        const updatedBrandFilters = selectedBrandFilters.filter((filter) => !brandsName[category].includes(filter));
      setSelectedBrandFilters(updatedBrandFilters);
        // Remove the category if already selected
        return prevFilters.filter((filter) => filter !== category);
      } else {
        // Add the category if not selected
        return [...prevFilters, category];
      }
    });
    setCategoryBrandsVisible((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  

  const handleBrandSearch = (brand) => {
    if (selectedBrandFilters.includes(brand)) {
      setSelectedBrandFilters(selectedBrandFilters.filter((filter) => filter !== brand));
    } else {
      setSelectedBrandFilters([...selectedBrandFilters, brand]);
    }
  };

  useEffect(() => {
    // console.log("Hello");
    // console.log(typeof email,email);
    // console.log(JSON.stringify({email}));
    const handle=async()=>{
    try{
        const response = await fetch('/api/CartOrderDetails',{
          method : 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body : JSON.stringify({email})
        })
        if(response.ok){
        const data = await response.json();
        toast.success("Order Placed Successfully.");     //give toast first always
        setSelectedProducts(data.Cart);
        setOrders(data.Orders);
        router.push("/homepage");
        //  console.log(data.Cart,data.Orders);
        }
        else{
          console.log("failed!")
        }
      }catch{
        console.error("Error during login:", error);
      }
    };
    if (window.location.href.includes('success')){
      handle();
    }
  }, [router?.query,SelectedProducts]);


  useEffect(() => {
    const filteredProducts = InitialProducts.filter((p) => {
      if(selectedBrandFilters.length>0){
        const brandFilter = selectedBrandFilters.some((filter) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.description.toLowerCase().includes(filter.toLowerCase())
      );
      return brandFilter;
      }
      const categoryFilter = selectedFilters.includes(p.category);
      return (
        (selectedFilters.length === 0 || categoryFilter)
      );
    });
    setProducts(filteredProducts);
  }, [selectedFilters,selectedBrandFilters, InitialProducts]);

  useEffect(() => {
    if (phrase) {
      const filteredProducts = InitialProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(phrase.toLowerCase()) ||
          p.category.toLowerCase().includes(phrase.toLowerCase()) ||
          p.description.toLowerCase().includes(phrase.toLowerCase())
      );
      console.log(filteredProducts)
      setProducts(filteredProducts);
    } else {
      setProducts(InitialProducts);
    }
  }, [phrase, InitialProducts]);

  return (
    <Layout>
      <div className="mt-4">
        <div className="flex">
          <input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            type="text"
            placeholder="Search for products..."
            className="w-full mr-2 ml-4 px-4 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
          />
          <UserIcon />
        </div>
        <div>
          <div className="mt-2">
            <div className="w-full">
              <div className="flex flex-wrap text-lg ml-2 mt-1">
                <button
                  onClick={() => {
                    setSelectedFilters([]);
                    setSelectedBrandFilters([]);
                    setCategoryBrandsVisible({});
                    setProducts(InitialProducts);
                    setPhrase("");
                  }}
                  className={`rounded-md p-1 border m-1 text-sm cursor-pointer bg-red-100`}
                  >Remove</button>
                {categoriesName.map((categoryName) => (
                  <React.Fragment key={categoryName}>
                    <FilterCategoryButton
                      label={categoryName}
                      onClick={() => handleCategorySearch(categoryName)}
                      isSelected={selectedFilters.includes(categoryName)}
                    />
                    {categoryBrandsVisible[categoryName] && brandsName[categoryName] && (
                      brandsName[categoryName].map((brand) => (
                        <FilterBrandButton
                          key={brand}
                          label={brand}
                          onClick={() => handleBrandSearch(brand)}
                          isSelected={selectedBrandFilters.includes(brand)}
                        />
                      ))
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          {categoriesName.map((categoryName) => (
            <div key={categoryName}>
              {Products.find((p) => p.category === categoryName) && (
                <div>
                  <h2 className="m-5 text-3xl w-20 flex justify-center">
                    {categoryName}
                  </h2>
                  <div className="flex overflow-scroll snap-x scrollbar-hide">
                    {Products.filter((p) => p.category === categoryName).map(
                      (ProductsInfo) => (
                        <div key={ProductsInfo._id} className="snap-start">
                          <Product {...ProductsInfo} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await initMongoose();
  const InitialProducts = await findAllProducts();
  return {
    props: {
      InitialProducts: JSON.parse(JSON.stringify(InitialProducts)),
    },
  };
}
