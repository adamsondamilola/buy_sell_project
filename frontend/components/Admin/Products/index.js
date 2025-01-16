"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Trash2Icon } from "lucide-react";
import formatNumberToCurrency from "../../../utils/numberToMoney";
import StatusComponent from "../../../components/Status";
import endpointsPath from "../../../constants/EndpointsPath";
import requestHandler from "../../../utils/requestHandler";
import categoryName from "../../../constants/CategoryNames";

const AdminProductsListComponent = (props) => { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Fetch products from the backend
  useEffect(()=>{
    const getProducts = async (page = 1) => {
      setLoading(true);
      try {
        const response = await requestHandler.get(
          `${props.endpoint}?page=${page}&limit=10`,
          true
        );
  
        if (response.statusCode === 200) {
          const result = response.result.data;
          setProducts(result.products);
          setTotalPages(result.totalPages);
          //localStorage.setItem("my_products", JSON.stringify(result.products));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts()
  },[props.endpoint])

  // Handlers
  const handleView = (productId, category) => {
    toast.success("Please wait...");
    if(category === categoryName.vehicles) router.push(`/admin/products/view-vehicle/${productId}`, undefined, { shallow: true });
    else if(category === categoryName.motorcyclesTricycles) router.push(`/admin/products/view-motorcycle-and-tricyle/${productId}`, undefined, { shallow: true });
    else router.push(`/admin/products/view/${productId}`, undefined, { shallow: true });
  };

  const handleEdit = (productId) => {
    toast.success("Please wait...");
    router.push(`/admin/products/edit/${productId}`, undefined, { shallow: true });
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await requestHandler.deleteReq(
          `${endpointsPath.product}/${productId}`,
          true
        );

        if (response.statusCode === 200) {
          toast.success(response.result.message || "Product deleted successfully");
          const filteredProducts = products.filter((product) => product._id !== productId);
          setProducts(filteredProducts);
          //localStorage.setItem("my_products", JSON.stringify(filteredProducts));
        } else {
          toast.error(response.result.message || "Failed to delete product");
        }
      } catch (error) {
        toast.error("Error deleting product");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:py-20">
      <h2 className="text-2xl font-bold mb-6">{props.title}</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 text-start px-4 border-b">Product Name</th>
                <th className="py-2 text-start px-4 border-b">Price</th>
                <th className="py-2 text-start px-4 border-b">Product</th>
                <th className="py-2 text-start px-4 border-b">Status</th>
                <th className="py-2 text-start px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b">{product.title}</td>
                    <td className="py-2 px-4 border-b">
                      {formatNumberToCurrency(product.price)}
                    </td>
                    <td className="py-2 px-4 border-b">{product.sub_category}</td>
                    <td className="py-2 px-4 border-b"><StatusComponent status={product.status}/></td>
                    <td className="py-2 px-4 border-b">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <button
                          onClick={() => handleView(product._id, product.category)}
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
                        >
                          View
                        </button>
                        {/*<button
                          onClick={() => handleEdit(product._id)}
                          className="w-full bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-700"
                        >
                          Edit
                        </button>*/}
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="w-full flex bg-red-500 text-white justify-center px-4 py-2 rounded hover:bg-red-700"
                        >
                          <Trash2Icon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsListComponent;
