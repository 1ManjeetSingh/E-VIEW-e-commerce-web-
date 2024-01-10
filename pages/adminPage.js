import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();
  const [imagePath, setImagePath] = useState("");

  const handleAddItem = async () => {
    // Input validation
    if (name==="" || category==="" || price==="" || description==="" || imagePath==="" || !name || !category || !price || !description || !imagePath) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('/api/AddProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, category, price, description, imagePath }),
      });
  
      if (response.ok) {
        console.log("success");
        toast.success('Item Added Successfully',{
            position:'top-center'
        });
      } else {
        const data = await response.json();
        toast.error(data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error during product addition:', error);
      toast.error('An error occurred during product addition.');
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen">
        <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-fit flex flex-wrap justify-center">
      <div className='mx-10'>
        <h1 className="text-2xl font-bold mb-6 flex w-full justify-center py-6">Add Item</h1>
        <div className="flex flex-col my-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-100 rounded mb-2"
            placeholder="Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-100 rounded mb-2"
            placeholder="Category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-100 rounded mb-2"
            placeholder="Price..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <textarea
            type="text"
            className="w-full p-3 border border-gray-100 rounded mb-2"
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-100 rounded mb-2"
            placeholder="ImageURL..."
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />
          {/* // preview of item card */}
        </div>
        <button
          onClick={handleAddItem}
          className="w-full bg-indigo-500 text-white p-3 rounded hover:bg-indigo-600 transition duration-300"
        >
          Add to Web
        </button>
        </div>
        <div className= 'p-2'>
            <div className='flex w-full justify-center py-6 font-bold text-2xl bg-white'>Preview</div>
        <div className="mx-2 my-2 p-3 rounded-xl bg-gray-200">
      <div className=" w-64 ">
        <div className=" bg-blue-100 p-5 rounded-xl ">
          <img src={imagePath} alt="" />
        </div>
        <div className=" mt-2 ">
          <h3 className=" font-bold text-lg ">{name}</h3>
        </div>
        <p className="text-sm mt-2 text-gray-500 min-h-40 w-64 flex-col">{description && description.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}</p>
        <div className="flex mt-2 ">
          <div className="text-2xl font-bold grow ">₹{price}</div>
          <button className={`text-white text-lg py-1 px-3 rounded-xl bg-emerald-400`}>
            +
          </button>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}
