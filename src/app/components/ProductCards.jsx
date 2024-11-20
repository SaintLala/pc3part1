import Link from "next/link";

function ProductCards({ product }) {
    return (
        <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="max-w-sm overflow-hidden shadow-lg bg-blue-900 rounded-lg border-gray-800 mb-3 hover:bg-blue-700 hover:cursor-pointer"
        >
        {product.image &&
            (
                <div className="flex overflow-hidden h-40 bg-sky-900 items-center justify-center">
                    <img src={product.image} className="h-60 object-cover rounded-lg"></img>
                </div>
            )
        }            
            <div className="px-6 py-4">
                <h1 className="text-xl mb-2 text-center font-bold text-white">
                    {product.name}
                </h1>
                <h2 className="text-2xl text-blue-300">
                    S/. {product.price.toFixed(2)}
                </h2>
                <p className="text-xl text-gray-300">
                    {product.description}
                </p>
            </div>
        </Link>
    );
}

export default ProductCards;
