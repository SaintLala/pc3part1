"use client";
import axios from "axios";
import {useRouter} from "next/navigation";


function Buttons({ productid }) {

    const router =  useRouter();

    return (
        <div className="flex gap-x-2 justify-evenly">
            <button
                className="text-white font-bold bg-blue-500 hover:bg-blue-700 py-3 px-8 rounded"
                onClick={() =>{
                    router.push(`/products/edit/${productid}`)
                }}
            >
                Editar
            </button>

            <button className="text-white font-bold bg-red-500 hover:bg-red-700 py-2 px-6 rounded"
                onClick={ async () => {
                    if (confirm('¿Estas Seguro de Eliminar Este Producto?')) {
                        const res = axios.delete('/api/products/' + productid)
                        if( (await res).status === 204){
                            router.push('/products')
                            router.refresh()
                        }
                    } else {
                        console.log("Cancelado")
                    }
                }}
            >
                Eliminar
            </button>
        </div>
    )
}

export default Buttons