import axios from "axios"
import Buttons from "./Buttons";

async function loadProduct(productId) {
    const { data } = await axios.get('http://localhost:3000/api/products/' + productId)
    return data;
}

async function ProductPage({ params }) {
    const { id } = await params
    const product = await loadProduct(id);

    return (
        <section className="flex justify-center items-center h-[calc(100vh-10rem)]">

            <div className='flex w-4/6 h-2/6 justify-center '>

                <div className="p-4 bg-white w-1/3">
                    <h3 className="text-blue-600 font-extrabold">
                        {product.name}
                    </h3>
                    <h4 className="text-green-500 font-bold">
                        Precío : {product.price}
                    </h4>
                    <p className="text-slate-700 font-bold">
                        Descripción : {product.description}
                    </p>
                    <br />
                    <hr className="py-0.5" />
                    <br />
                    <Buttons productid={product.id} />
                </div>
                <img src={product.image} className="w-1/3 border-4 border-blue-400 rounded-r-lg"></img>
            </div>
        </section>
    )
}

export default ProductPage