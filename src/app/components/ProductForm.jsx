"use client";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { NextResponse } from "next/server";

function ProductForm() {

    const [product, setProduct] = useState({
        name: "",
        price: 0,
        description: "",
    });

    const [file, setFile] = useState(null);
    const form = useRef(null);
    const router = useRouter();
    const params = useParams();

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (params.id) {
            axios.get("/api/products/" + params.id).then((res) => {
                setProduct({
                    name: res.data.name,
                    price: res.data.price,
                    description: res.data.description,
                });
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = await params.id;
        console.log(id)

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.description);

        if (file) {
            formData.append("image", file);
        }

        try {
            if (!id) {
                const res = await axios.post("/api/products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log(res)

            } else {
                const res = await axios.put("/api/products/" + id, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                console.log(res)
            }

            form.current.reset();
            router.refresh();
            router.push("/products");

        } catch (error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 500
                }
            );
        }

    };

    return (
        <div className="flex justify-center mt-10">
            <form className="bg-blue-900 shadow-md rounded-lg px-6 pt-4 pb-6 mb-1 w-96"
                onSubmit={handleSubmit} ref={form}>

                <label htmlFor="name"
                    className="block text-white text-sm font-bold mb-1">
                    Nombre:
                </label>
                <input name="name" autoFocus type="text"
                    className="shadow appearance-none border rounded w-full py-1 px-1 bg-blue-700 text-white"
                    placeholder="Nombre" value={product.name} onChange={handleChange} />

                <label htmlFor="price"
                    className="block text-white text-sm font-bold mb-1">
                    Precio:
                </label>
                <input name="price" type="text"
                    className="shadow appearance-none border rounded w-full py-1 px-1 bg-blue-700 text-white"
                    min={0} value={product.price} onChange={handleChange} />

                <label htmlFor="description"
                    className="block text-white text-sm font-bold mb-1">
                    Descripción:
                </label>
                <textarea name="description" rows={3}
                    className="shadow appearance-none border rounded w-full py-1 px-1 bg-blue-700 text-white resize-none"
                    placeholder="Descripción" value={product.description} onChange={handleChange} />

                <label htmlFor="productImage"
                    className="block text-white text-sm font-bold mb-1">
                    Imagen:
                </label>
                <input type="file"
                    className="shadow appearance-none border rounded w-full py-1 px-1 bg-blue-700 text-white mb-2"
                    onChange={(e) => {
                        setFile(e.target.files[0])
                    }}
                />

                {file && <img
                    className="w-60 object-contain mx-auto mb-4 mt-4 border-4 border-blue-700 rounded-md"
                    src={URL.createObjectURL(file)} />}

                <div className="text-white font-bold">
                    <button className={params.id ?
                        "bg-blue-500 hover:bg-blue-600 rounded py-4 px-4 w-full"
                        : "bg-black hover:bg-gray-800 rounded py-4 px-4 w-full"}>
                        {params.id ? "Actualizar Datos" : "Guardar Datos"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductForm;
