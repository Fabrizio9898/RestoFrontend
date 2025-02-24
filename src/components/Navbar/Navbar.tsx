"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IUserSession } from '@/interfaces/Interfaces.types';

// interface NavbarProps {
//   isLoggedInProp?: boolean;
// }

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<IUserSession | null>(null);

  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar si el usuario está logueado

  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     if (typeof window !== "undefined" && window.localStorage) {
  //       const userSession = localStorage.getItem("userSession");
  //       return !!userSession;
  //     }
  //     return false;
  //   };

  //   if (isLoggedInProp !== undefined) {
  //     // Si se proporciona isLoggedInProp, úsalo
  //     setIsLoggedIn(isLoggedInProp);

  //     // Si isLoggedInProp es true, asegúrate de que localStorage esté actualizado
  //     if (isLoggedInProp && !checkLoginStatus()) {
  //       localStorage.setItem("userSession", JSON.stringify({ isLoggedIn: true }));
  //     } else if (!isLoggedInProp && checkLoginStatus()) {
  //       // Si isLoggedInProp es false pero localStorage indica que está logueado, limpia localStorage
  //       localStorage.removeItem("userSession");
  //     }
  //   } else {
  //     // Si no se proporciona isLoggedInProp, usa localStorage
  //     setIsLoggedIn(checkLoginStatus());
  //   }
  // }, [isLoggedInProp]);


  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const aux = JSON.parse(localStorage.getItem("userSession")!);
      setUserData(aux);
    }
  }, []);

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center mt-6 max-w-5xl">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Rest0logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <p className="font-extrabold text-[24px] text-black">
            Rest0
          </p>
        </Link>

        {/* Botón de menú móvil */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
            {isOpen ? '✖️' : '☰'} {/* Ícono del menú */}
          </button>
        </div>

        {/* Links */}
        <ul className={`flex flex-col md:flex-row md:space-x-6 ${isOpen ? 'block' : 'hidden'} md:flex`}>
          <li className="mt-2 md:mt-0">
            <Link
              href="/contacto"
              className="italic text-black text-[24px] hover:underline active:scale-110 transition-transform duration-200"
            >
              Contacto
            </Link>
          </li>
          <li className="mt-2 md:mt-0">
            <Link
              href="/resenas"
              className="italic text-black text-[24px] hover:underline active:scale-110 transition-transform duration-200"
            >
              Reseñas
            </Link>
          </li>
          <li className="mt-2 md:mt-0">
            <Link
              href="/funcionalidades"
              className="italic text-black text-[24px] hover:underline active:scale-110 transition-transform duration-200"
            >
              Funcionalidades
            </Link>
          </li>
          <li className="mt-2 md:mt-0">
            <Link
              href="/precios"
              className="italic text-black text-[24px] hover:underline active:scale-110 transition-transform duration-200"
            >
              Precios
            </Link>
          </li>

          {userData?.token ?
            (
              <li className="mt-2 md:mt-0">
                <Link
                  href="/pageUser"
                  className="italic text-black text-[24px] hover:underline active:scale-110 transition-transform duration-200"
                >
                  Mi Cuenta
                </Link>
              </li>
            )
            :
            null
          }

        </ul>
      </div>

      <hr className="w-4/5 mx-auto mt-4 border-2"></hr>
    </nav>
  );
};

export default Navbar;