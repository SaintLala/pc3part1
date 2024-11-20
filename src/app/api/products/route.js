
import { NextResponse } from "next/server";
import { conexion } from "@/Libs/mysql";
import cloudinary from "@/Libs/cloudinary";
import { unlink } from "fs/promises";
import { processImage } from "@/Libs/processimage";

export async function GET() {

    try {
        const result = await conexion.query('SELECT * FROM product');

        return NextResponse.json
            (result)

    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500
            });
    }

}

export async function POST(request) {

    try {

        const data = await request.formData();
        const image = data.get("image")

        if (!data.get("name")) {
            return NextResponse.json(
                {
                    message: "Nombre es requerido",
                }, {
                status: 400
            });
        }

        if (!image) {

            return NextResponse.json({
                message: "Imagen es requerida",
            }, {
                status: 400,
            }
            )
        }

        const buffer = await processImage(image);

        const res = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "image",
                    },
                    async (err, result) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }

                        resolve(result);
                    }
                )
                .end(buffer);
        });

        const result = await conexion.query('INSERT INTO product SET ?', {
            name: data.get("name"),
            description: data.get("description"),
            price: data.get("price"),
            image: res.secure_url,
        });

        return NextResponse.json({
            name: data.get("name"),
            description: data.get("description"),
            price: data.get("price"),
            id: result.insertId,
        });

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500
            });
        }
}