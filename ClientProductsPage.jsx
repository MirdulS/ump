import React, { useEffect, useState } from 'react';
import { Users, Search, Edit, Trash2 } from 'lucide-react';
import ActionsMenu from './ActionsMenu';
import {
  fetchClientProducts,
  deleteClientProductById,
} from '../data/clientproduct';

const ClientProductsPage = () => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [clientProductMap, setClientProductMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const colorClasses = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-red-100 text-red-800',
    'bg-teal-100 text-teal-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const loadClientProducts = async () => {
    try {
      const data = await fetchClientProducts();
      const map = {};
      data.forEach(({ clientId, clientName, productName, productId }) => {
        if (!map[clientName]) map[clientName] = [];
        map[clientName].push({ productName, productId, clientId });
      });
      setClientProductMap(map);
    } catch (err) {
      console.error('Error loading client-products:', err);
    }
  };

  useEffect(() => {
    loadClientProducts();
  }, []);

  const handleDelete = async (clientId, productId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteClientProductById(token, `${clientId}-${productId}`);
      loadClientProducts();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredMap = Object.entries(clientProductMap).filter(([clientName]) =>
    clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Clients & Their Products</h1>
      </div>

      <div className="flex items-center gap-3 px-6 pt-4">
        <Users className="text-gray-500" size={20} />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Client View</h2>
          <p className="text-sm text-gray-500">See which products are used by each client</p>
        </div>
      </div>

      {/* 🔍 Search and Actions Menu */}
      <div className="px-6 mt-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <ActionsMenu
          isOpen={isActionsOpen}
          onToggle={() => setIsActionsOpen(!isActionsOpen)}
          onSelect={() => setIsActionsOpen(false)}
        />
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by client name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredMap.map(([clientName, productList], index) => (
          <div
            key={clientName}
            className="p-6 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{clientName}</h3>
                <p className="text-sm text-gray-500">{productList.length} Products</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {productList.map(({ productName, productId, clientId }, i) => (
                <div
                  key={productId}
                  className={`flex items-center px-3 py-1 text-xs font-medium rounded-full gap-2 ${
                    colorClasses[(index + i) % colorClasses.length]
                  }`}
                >
                  {productName}
                  <button
                    onClick={() => alert(`Edit clicked for ${productName}`)}
                    className="text-xs hover:text-gray-900"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(clientId, productId)}
                    className="text-xs hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientProductsPage;





// import React, { useEffect, useState, useRef } from 'react';
// import { Users, Package } from 'lucide-react';
// import ActionsMenu from './ActionsMenu';
// import { fetchProducts } from '../data/products';
// import { fetchClientProducts } from '../data/clientproduct';

// const ClientProductsPage = () => {
//   const [isActionsOpen, setIsActionsOpen] = useState(false);
//   const [hoveredProductId, setHoveredProductId] = useState(null);
//   const [showPopover, setShowPopover] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [clientProducts, setClientProducts] = useState([]);
//   const hoverTimeout = useRef();

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const productsData = await fetchProducts();
//         const clientProductsData = await fetchClientProducts();
//         setProducts(productsData);
//         setClientProducts(clientProductsData);
//       } catch (err) {
//         console.error('Error loading data:', err);
//       }
//     };
//     loadData();
//   }, []);

//   const getClientNamesForProduct = (productId) => {
//     return clientProducts
//       .filter((entry) => entry.productId === productId)
//       .map((entry) => entry.clientName);
//   };

//   const handleMouseEnter = (productId) => {
//     clearTimeout(hoverTimeout.current);
//     setHoveredProductId(productId);
//     setShowPopover(true);
//   };

//   const handleMouseLeave = () => {
//     hoverTimeout.current = setTimeout(() => {
//       setShowPopover(false);
//       setHoveredProductId(null);
//     }, 150);
//   };

//   const handlePopoverEnter = () => {
//     clearTimeout(hoverTimeout.current);
//     setShowPopover(true);
//   };

//   const handlePopoverLeave = () => {
//     setShowPopover(false);
//     setHoveredProductId(null);
//   };

//   // Color palette cycling
//   const colorClasses = [
//     'bg-blue-100 text-blue-800',
//     'bg-green-100 text-green-800',
//     'bg-purple-100 text-purple-800',
//     'bg-yellow-100 text-yellow-800',
//     'bg-pink-100 text-pink-800',
//     'bg-red-100 text-red-800',
//     'bg-teal-100 text-teal-800',
//     'bg-indigo-100 text-indigo-800',
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="px-6 py-4 bg-white border-b border-gray-200">
//         <h1 className="text-2xl font-semibold text-gray-900">Client Products</h1>
//       </div>

//       {/* Subtitle */}
//       <div className="flex items-center gap-3 px-6 pt-2 pb-2">
//         <Package className="text-gray-500" size={20} />
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">Finance Products</h2>
//           <p className="text-sm text-gray-500">
//             Overview of all products and their client associations
//           </p>
//         </div>
//       </div>

//       {/* ActionsMenu */}
//       <div className="px-6 pt-4 pb-2">
//         <ActionsMenu
//           isOpen={isActionsOpen}
//           onToggle={() => setIsActionsOpen(!isActionsOpen)}
//           onSelect={() => setIsActionsOpen(false)}
//         />
//       </div>

//       {/* Product Cards */}
//       <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-2 lg:grid-cols-3">
//         {products.map((product, index) => {
//           const clientNames = getClientNamesForProduct(product.productId);
//           const color = colorClasses[index % colorClasses.length];

//           return (
//             <div
//               key={product.productId}
//               className="p-6 transition-all duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:-translate-y-1"
//             >
//               <div className="flex items-center gap-3 mb-2">
//                 <span className={`px-3 py-1 text-xs font-medium rounded-full ${color}`}>
//                   {product.productName}
//                 </span>
//               </div>
//               <p className="mb-4 text-gray-700">Clients using this product:</p>
//               <div className="relative flex items-center gap-2 mt-2">
//                 <Users className="text-blue-500" size={16} />
//                 <span
//                   className="text-sm font-semibold text-gray-800 cursor-pointer"
//                   onMouseEnter={() => handleMouseEnter(product.productId)}
//                   onMouseLeave={handleMouseLeave}
//                 >
//                   {clientNames.length} Clients
//                 </span>

//                 {/* Popover */}
//                 {showPopover &&
//                   hoveredProductId === product.productId &&
//                   clientNames.length > 0 && (
//                     <div
//                       className="absolute left-0 z-20 w-48 p-3 mt-8 text-xs text-gray-900 bg-white border border-gray-200 rounded-lg shadow-lg opacity-95"
//                       onMouseEnter={handlePopoverEnter}
//                       onMouseLeave={handlePopoverLeave}
//                     >
//                       <div className="mb-1 font-semibold text-gray-700">
//                         Associated Clients:
//                       </div>
//                       <ul className="list-disc list-inside">
//                         {clientNames.map((name, idx) => (
//                           <li key={idx}>{name}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ClientProductsPage;
