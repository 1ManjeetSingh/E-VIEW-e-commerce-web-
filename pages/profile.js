// pages/profile.js
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function ProfilePage() {
  const router = useRouter();
  const [userPicture, setUserPicture] = useState(null);
  const [UserName, setUserName] = useState("");
  const [UserAddress, setUserAddress] = useState("");
  const [IsUserAdmin, setIsUserAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [AddressVisible, setAddressVisible] = useState(false);
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [NewStreet, setNewStreet] = useState("");
  const [NewCity, setNewCity] = useState("");
  const [NewPincode, setNewPincode] = useState("");
  const [NewState, setNewState] = useState("");
  const [NewUserName, setNewUserName] = useState("");
  const [NameVisible, setNameVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  // const [selectedFile, setSelectedFile] = useState();
  const [ImageVisible, setImageVisible] = useState(false);
  const [ShowPassword, setShowPassword] = useState(false);
  const [imagePath, setImagePath] = useState('');

  const [loading, setLoading] = useState(false);

  const handleAddress = () => {
    setAddressVisible(!AddressVisible);
    setNameVisible(false);
    setPasswordVisible(false);
    setImageVisible(false);
  };

  const handlePassword = () => {
    setPasswordVisible(!PasswordVisible);
    setAddressVisible(false);
    setNameVisible(false);
    setImageVisible(false);
  };

  const handleName = () => {
    setNameVisible(!NameVisible);
    setAddressVisible(false);
    setPasswordVisible(false);
    setImageVisible(false);
  };

  const handleImageVisible = () => {
    setImageVisible(!ImageVisible);
    setAddressVisible(false);
    setNameVisible(false);
    setPasswordVisible(false);
  };


  const [parsedUserAddress, setParsedUserAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let userData = null;
      if (typeof window !== "undefined") {
        userData = localStorage.getItem("User");
      }
      const parsedUser = JSON.parse(userData);
      setUserPicture(parsedUser?.data?.picture || null);
      setUserName(parsedUser?.data?.name || null);
      setParsedUserAddress(parsedUser?.data?.address || null);
      setIsUserAdmin(parsedUser?.data?.isAdmin || null);
      setEmail(parsedUser?.data?.email || null);
    };
    fetchData();
  }, []);


  const handleSetNewAddress = (e) => {
    //////////////////
    e.preventDefault();
    //////////////////
    if (!NewState || !NewPincode || !NewCity || !NewStreet ||NewStreet==="" || NewCity==="" || NewPincode==="" || NewState==="") {
      alert("Please fill in all sections!");
      return;
    } else {
      const address = {
        street: NewStreet,
        city: NewCity,
        pincode: NewPincode,
        state: NewState,
      };
      fetch("/api/resetAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          address,
        }),
      })
        .then((response) => {
          if (response.ok) {
            let userData = null;
            if (typeof window !== "undefined") {
              userData = localStorage.getItem("User");
            }
            const parsedUser = JSON.parse(userData);
            parsedUser.data.address = address; // Update the address
            localStorage.setItem("User", JSON.stringify(parsedUser));
            setUserAddress(address);
          } else {
            console.log("API call failed");
          }
        })
        .catch((error) => {
          console.error("Error during API call:", error);
        });
    }
    setNewStreet("");
    setNewCity("");
    setNewPincode("");
    setNewState("");
    toast.success("Address Updated Successfully. Reload to See", {
      duration: 1000,
      position: "top-center",
    });
  };

  const handleSetUserName = async () => {
    if (!NewUserName || NewUserName==="") {
      alert("Please enter a new Username!");
      return;
    }
    try {
      const response = await fetch("/api/reset-UserName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, NewUserName }),
      });

      if (response.ok) {
        let userData = null;
        if (typeof window !== "undefined") {
          userData = localStorage.getItem("User");
        }
        const parsedUser = JSON.parse(userData);
        parsedUser.data.name = NewUserName;
        localStorage.setItem("User", JSON.stringify(parsedUser));
        setUserAddress(`${NewStreet},${NewCity}(${NewPincode}),${NewState}.`);
        setUserName(NewUserName);
        setNewUserName("");
        setNameVisible(!NameVisible);
        alert(`Username changed successfully.`);
      } else {
        const data = await response.json();
        alert(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during Username change:", error);
      alert("An error occurred during Username change.");
    }
  };

  const handleImageUpload = async () => {
    if (!imagePath || imagePath==='') {
      alert("Please enter path!");
      return;
    }
    try {
      const response = await fetch("/api/reset-profilepic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, imagePath }),
      });

      if (response.ok) {
        setImagePath("");
        setImageVisible(false)
        setUserPicture(imagePath);
        toast.success("Profile changed successfully.",{
          position:"top-center",
        });
      } else {
        const data = await response.json();
        alert(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during profile reset:", error);
      alert("An error occurred during profile reset.");
    }
  };

  const handleResetPassword = async () => {
    if (!password || password==='') {
      alert("Please enter a new password!");
      return;
    }
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setPassword("");
        setPasswordVisible(!PasswordVisible);
        toast.success("Password changed successfully.");
      } else {
        const data = await response.json();
        toast.error(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("An error occurred during password reset.");
    }
  };

  const handleArrow = () => {
    router.push("/homepage");
  };

  return (
    <div className="min-h-screen">
      <ToastContainer/>
      <div className="flex flex-col justify-center items-center p-4 bg-white rounded-lg min-h-screen">
        <div className="border rounded-xl py-4 bg-gray-100 shadow-lg">
          <div className="flex items-center mb-5">
            <div onClick={handleArrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </div>
            <div className="flex justify-center font-bold text-3xl w-full mr-9">
              Profile
            </div>
          </div>

          {/* Part-2-Profile Image */}
          <div className="flex justify-center items-center mb-2">
            <div className="flex justify-center items-center mb-2">
              <div
                className="h-24 w-24 rounded-full overflow-hidden border-4 border-blue-500 hover:border-blue-700 transition-all duration-300"
                onClick={handleImageVisible}
              >
                <div className="object-cover w-full h-full">
                  <img src={userPicture} alt="" />
                </div>
              </div>
              <div className="flex h-24">
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
              </div>
            </div>
          </div>

          {ImageVisible && (
            <div className="flex justify-center rounded-sm px-3 mb-5" style={{backgroundColor:"rgb(0,0,0,.5)"}}>
              {/* <input
                type="file"
                accept="image/*"
                onChange={({ target }) => {
                  if (target.files) {
                    const file = target.files[0];
                    setUserPicture(URL.createObjectURL(file));
                    setSelectedFile(file);
                  }
                }}
                className="my-4 p-1 border border-gray-600"
              /> */}
               <input
                type="text"
                placeholder="ImageURL"
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                className="p-1 mx-2 my-4 border border-gray-300 rounded"
              />
              <button
                // disabled={uploadingImage}
                onClick={handleImageUpload}
                className="p-1 my-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
              >
                {uploadingImage ? "Uploading" : "Upload"}
              </button>
            </div>
          )}

          {/* Part-3-User Name */}
          <div className="mb-6 flex justify-center" onClick={handleName}>
            <h1 className="text-3xl font-bold text-center">{UserName}</h1>
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
          </div>
          {NameVisible && (
            <div className="flex justify-center -my-2" style={{backgroundColor:"rgb(0,0,0,.5)"}}>
              <input
                type="text"
                placeholder="New UserName"
                value={NewUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="p-1 mx-2 my-4 border border-gray-300 rounded"
              />
              <button
                onClick={handleSetUserName}
                className="p-1 my-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
              >
                Submit
              </button>
            </div>
          )}

          {/* Part-4-User Address */}
          <div className="flex flex-col items-center my-8">
  <span
    className="text-gray-800 border-t font-bold flex hover:cursor-pointer py-4"
    onClick={handleAddress}
  >
    Shipping Address
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
    {parsedUserAddress && (
      <>
        <div className="px-1">{parsedUserAddress.street},</div>
        <div>{parsedUserAddress.city},</div>
        <div>({parsedUserAddress.pincode})</div>
        <div>{parsedUserAddress.state}.</div>
      </>
    )}
  </div>

            {AddressVisible && (
              <div className="flex justify-center w-full my-4" style={{backgroundColor:"rgb(0,0,0,.5)"}}>
                <form onSubmit={handleSetNewAddress}>
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
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="p-1 my-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="flex flex-col justify-center my-8 items-center">
            <span
              className="text-gray-800 border-t font-bold flex py-4 hover:cursor-pointer"
              onClick={handlePassword}
            >
              Reset Password
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
            {PasswordVisible && (
              <div className="flex w-full justify-center" style={{backgroundColor:"rgb(0,0,0,.5)"}}>
                <div className="flex">
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!ShowPassword)}
                  >
                    {ShowPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-8 w-7 bg-white rounded-md mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-8 w-7 bg-white rounded-md mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type={ShowPassword ? "text" : "password"}
                    id="password"
                    className="w-full my-4 mr-1 border border-gray-100 rounded"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  className="p-1 my-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-300"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
  );
}
