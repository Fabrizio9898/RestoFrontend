"use client";

import Footer from "@/components/Footer/Footer";
import NavbarUsuario from "@/components/NavbarUsuario/NavbarUsuario";
import { ErrorHelper } from "@/helpers/errors/error-helper";
import { createRestaurant } from "@/helpers/restaurant-helpers/register-restaurant";
import { swalNotifyError } from "@/helpers/swal/swal-notify-error";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IRestaurant } from "@/interfaces/restaurant.interface";
import { API_URL } from "@/config/config";
import Unauthorized from "@/app/unauthorized";
import { useLocalStorage } from "@/helpers/auth-helpers/useLocalStorage";
import { IUser } from "@/interfaces/user.interface";
import { UserRole } from "@/enums/role.enum";
import { HttpMessagesEnum } from "@/enums/httpMessages.enum";

const RegisterRestaurantView: React.FC = () => {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(true);
  const [iuser, setUser] = useLocalStorage("userSession", "");
  const user: Partial<IUser> = iuser.user;

  const [formData, setFormData] = useState<Partial<IRestaurant>>({
    name: "",
    address: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (user === null && user === undefined || user.role !== UserRole.CONSUMER) {
      setIsAllowed(false);

      swalNotifyError(new ErrorHelper(HttpMessagesEnum.INSUFFICIENT_PERMISSIONS, "")).then((result) => {

        if (result.isConfirmed) {
          window.location.href = "/pageUser";
        }
      });

    }

  }, [user])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files && files[0]) {
      setImageFile(files[0]);
      // No asignamos el File a imgUrl, solo guardamos el archivo
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user.role === UserRole.CONSUMER) {
      try {
        const restaurantData = { ...formData };
        // Si hay una imagen, la subimos al backend
        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile); // 'image' debe coincidir con el nombre en el backend

          // Subimos la imagen al backend
          const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
          });

          console.log('response de upload', uploadResponse);


          if (!uploadResponse.ok) {
            throw new Error("Error al subir la imagen");
          }

          const uploadData = await uploadResponse.json();
          console.log('url', uploadData.url);


          // Guardamos la URL de la imagen en los datos del restaurante
          if (uploadData.url) {
            restaurantData.imgUrl = uploadData.url;
          }
        }

        await createRestaurant(restaurantData);

        if (typeof window !== "undefined") {
          localStorage.removeItem("userSession");
        }

        router.push("/login");
      } catch (error) {
        if (error instanceof ErrorHelper) {
          swalNotifyError(error);
        } else {
          console.log("Error desconocido " + error);
        }
      }
    } else {
      window.location.href = "/pageUser"
      swalNotifyError(new ErrorHelper(HttpMessagesEnum.UNAUTHORIZED, ""))
    }

  };

  return (
    <>
      {isAllowed ?
        <>
          <NavbarUsuario />
          <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 px-4 md:px-20">
            {/* Sección Izquierda */}
            <div className="md:w-1/2 space-y-6 mb-8 md:mb-0">
              <img src="/Rest0logo.png" alt="Logo" className="w-24 mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">
                ¡CREA TU CUENTA GRATIS!
              </h1>
              <h2 className="text-4xl font-extrabold text-gray-900">
                Potencia tu negocio con Rest0
              </h2>
              <p className="text-lg text-gray-700">
                Software punto de venta para <span className="font-bold">todo</span>{" "}
                tipo de <span className="font-bold">negocio gastronómico</span>
              </p>
            </div>

            {/* Sección Derecha */}
            <div className="md:w-1/2 bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Ingresá tus datos para empezar
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700">
                    Nombre del negocio
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu local"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 text-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-gray-700">
                    Dirección
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Dirección"
                    minLength={5}
                    maxLength={30}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    name="description"
                    placeholder="Descripción del negocio"
                    maxLength={500}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">
                    Imagen Principal (Opcional)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white font-medium py-2 rounded-lg hover:bg-gray-800"
                >
                  CREAR CUENTA GRATIS
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </>
        :
        <Unauthorized />}
    </>
  );
};

export default RegisterRestaurantView;
