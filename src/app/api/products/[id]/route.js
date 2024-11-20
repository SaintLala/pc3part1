import { NextResponse } from "next/server";
import { conexion } from "@/Libs/mysql";
import cloudinary from "@/Libs/cloudinary";
import { processImage } from "@/Libs/processimage";

export async function GET(request, { params }) {

    try {
        const { id } = await params;

        const result = await conexion.query("SELECT * FROM product WHERE id = ?", [id]);

        if (result.length === 0) {
            return NextResponse.json(
                {
                    message: 'Producto no encontrado',
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(result[0]);

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
}

export async function PUT(request, { params }) {

    const { id } = await params;
    console.log(id)

    try {

        const data = await request.formData();

        const image = data.get("image")

        const updatedData = {
            name: data.get("name"),
            price: data.get("price"),
            description: data.get("description"),
        }

        if (!updatedData.name) {
            return NextResponse.json(
                {
                    message: "Nombre es requerido",
                }, {
                status: 400
            });
        }

        if (image) {
            console.log(image)
            const buffer = await processImage(image);
            console.log(buffer)
            const res = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                    },
                    async (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                )
                    .end(buffer);
            });

            updatedData.image = res.secure_url;
            console.log(updatedData)
        }

        const result = await conexion.query(
            "UPDATE product SET ? WHERE id = ?",
            [updatedData, id]
        );


        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: 'Producto no encontrado',
                },
                {
                    status: 404
                }
            );
        }

        const updatedProduct = await conexion.query(
            "SELECT * FROM product WHERE id = ?",
            [id]
        );

        return NextResponse.json(updatedProduct[0]);

    } catch (error) {
        console.error("Database error:", error.message);
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500
            }
        );
    }


}

export async function DELETE(request, { params }) {

    try {
        const { id } = await params;

        const result = await conexion.query("DELETE FROM product WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                {
                    message: 'Producto no encontrado',
                },
                {
                    status: 404
                }
            );
        }

        return new Response(null, {

            status: 204

        })

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
}