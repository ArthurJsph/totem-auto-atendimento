const Pedido = () => {
  return (
    <div className="bg-white w-full max-w-sm p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-4">
     <h1 className="text-xl font-semibold">
      Sacola
     </h1>
     <button className="text-gray-500">
      <i className="fas fa-times">
      </i>
     </button>
    </div>
    <div className="flex items-center mb-4">
     <img alt="A plate of Tapioca Recheada" className="w-16 h-16 rounded-lg mr-4" height="60" src="https://storage.googleapis.com/a1aa/image/k1yRSaRjIynsqRWOvhoBLv7dgOwW6uI4ujbFlCWcp9I.jpg" width="60"/>
     <div className="flex-1">
      <h2 className="text-sm font-semibold">
       Tapioca Recheada
      </h2>
      <p className="text-sm text-gray-500">
       R$ 12,00
      </p>
     </div>
     <div className="flex items-center">
      <button className="text-gray-500">
       <i className="fas fa-minus">
       </i>
      </button>
      <span className="mx-2">
       1
      </span>
      <button className="text-red-500">
       <i className="fas fa-plus">
       </i>
      </button>
      <button className="text-gray-500 ml-4">
       <i className="fas fa-trash">
       </i>
      </button>
     </div>
    </div>
    <div className="border-t border-gray-200 pt-4">
     <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-500">
       Subtotal
      </span>
      <span className="text-sm text-gray-500">
       R$ 12,00
      </span>
     </div>
     <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-500">
       Descontos
      </span>
      <span className="text-sm text-gray-500">
       R$ 0,00
      </span>
     </div>
     <div className="flex justify-between font-semibold">
      <span>
       Total
      </span>
      <span>
       R$ 12,00
      </span>
     </div>
    </div>
    <button className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-4">
     Finalizar Pedido
    </button>
   </div>
  );
}

export default Pedido;