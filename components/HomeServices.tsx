'use client';

import Image from "next/image";
import { useInView } from "react-intersection-observer";
import styles from "@/app/styles/custom.module.css";
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export default function HomeServices() {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);

  const handleBookingClick = () => {
    if (session) {
      // If user is logged in, go directly to booking
      window.location.href = '/booking';
    } else {
      // If not logged in, show dialog
      setShowDialog(true);
    }
  };

  return (
    <section className="">
      <div className="py-10 bg-blue-carfully">
        <div className="max-w-screen-xl mx-auto  text-center">
          <p className="text-5xl lg:text-6xl mt-4 font-extrabold text-gray-200">
            Weil dein Auto das Beste verdient.
          </p>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto flex flex-row gap-x-10 p-6">
        <div className="hidden lg:block lg:basis-3/5">
          <img src="/img/CarsPromo.png" />
          {/* <Image
            src="/img/CarsPromo.png"
            width={600}
            height={300}
            alt="Cars Promo"
            // style={{
            //   objectFit: "contain",
            // }}
          /> */}
        </div>
        <div className="basis-2/5 flex flex-col grow">
          <span className="font-black text-xl">
            Premium Innen- und Außenwäsche
          </span>
          <p className="text-md">
            Unsere Premium Innen- und Außenwäsche bietet eine umfassende
            Reinigung und Pflege für Dein Fahrzeug. Mit hochwertigen
            Reinigungsmitteln sorgen wir dafür, dass Dein Auto sowohl innen als
            auch außen in neuem Glanz erstrahlt.
          </p>
          <div className="flex flex-row my-3">
            <div className="basis-2/3 flex flex-col gap-y-2">
              <div className="flex flex-row gap-x-2">
                <img
                  src="/img/IconEco.png"
                  style={{ width: 36, height: 22, objectFit: "contain" }}
                />
                <span>
                  <strong>Wasserlos</strong> du sparst bis zu 150L Wasser pro
                  Autowäsche!
                </span>
              </div>
              <div className="flex flex-row gap-x-2">
                <img
                  src="/img/IconCheck.png"
                  style={{ width: 22, height: 22, objectFit: "contain" }}
                />
                <span>
                  Speziell mit <strong>Anti Kratz-Formel</strong>
                </span>
              </div>
            </div>
            <div className="basis-1/3">
              <img
                src="/img/IconSatisfied.png"
                style={{ width: 150, height: 80, objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="flex flex-row items-center">
            <img
              src="/img/IconPhone.png"
              style={{ width: 70, height: 70, objectFit: "contain" }}
            />
            <p className="ml-3 font-black">
              Hast Du Fragen ?{" "}
              <a href="phone:+4917687731630" className="text-sky-700">
                +49 176 87731630
              </a>
            </p>
          </div>
          <div className="flex flex-row justify-around">
            <button
              onClick={handleBookingClick}
              className="bg-gradient-to-br from-orange-700 to-orange-300 hover:from-orange-800 hover:to-orange-400 px-2 py-3 font-bold text-xl rounded-xl text-gray-100 drop-shadow-lg"
            >
              Jetzt Buchen
            </button>
          </div>

          <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
            <DialogTitle>Wie möchten Sie fortfahren?</DialogTitle>
            <DialogContent>
              Wählen Sie bitte aus, ob Sie sich einloggen möchten oder als Gast fortfahren möchten.
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => window.location.href = '/authentication/login'}
                variant="outlined"
              >
                Einloggen
              </Button>
              <Button
                onClick={() => window.location.href = '/guest-booking'}
                variant="contained"
                color="primary"
              >
                Als Gast fortfahren
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
