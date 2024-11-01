import Image from "next/image";
import React, { useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "@/app/styles/custom.module.css";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

export const HeroComponent = () => {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const { ref: refHeroText, inView: isHeroTextVisible } = useInView({
    triggerOnce: true,
    initialInView: false,
  });
  const { ref: refHeroSubText, inView: isHeroSubTextVisible } = useInView({
    triggerOnce: true,
    initialInView: false,
  });

  const handleBookingClick = () => {
    if (session) {
      window.location.href = '/booking';
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <section className="bg-white max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row p-6">
          <div className="flex flex-col flex-1">
            <p className="font-black text-4xl mb-6">
              AUTOWÄSCHE?
              <br />
              PROBIER{"'"}S MAL OHNE
              <br />
              WASSER!
            </p>
            <p className=" text-gray-600 mb-6">
              Bei uns wird jedes Detail Deines Autos sorgfältig und ohne einen
              Tropfen Wasser mit der Hand gereinigt – perfekt für eine
              umweltfreundliche Autopflege.
            </p>

            <div className="flex flex-row">
              <div className="flex flex-row mr-4 flex-1">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-6 h-6 text-sky-700 mr-2"
                />
                <p>Wasserlos und ökologisch</p>
              </div>
              <div className="flex flex-row flex-1">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-6 h-6 text-sky-700 mr-2"
                />
                <p>Innen- und Außenreinigung</p>
              </div>
            </div>
            <div className="flex flex-row mt-2">
              <div className="flex flex-row mr-4 flex-1">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-6 h-6 text-sky-700 mr-2"
                />
                <p>mit Anti-Kratz Formel</p>
              </div>
              <div className="flex flex-row flex-1">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-6 h-6 text-sky-700 mr-2"
                />
                <p>100% Zufriedenheit</p>
              </div>
            </div>
            <div className="flex flex-row justify-around">
              <button
                onClick={handleBookingClick}
                className="mt-6 bg-gradient-to-br from-orange-700 to-orange-300 hover:from-orange-800 hover:to-orange-400  px-2 py-3 font-bold text-xl rounded-xl text-gray-100 drop-shadow-lg"
              >
                Jetzt Buchen
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-row mt-4 ">
            <div className="flex flex-row grow justify-center relative">
              {/* <Image
                src="/img/CarPromo.png"
                width={600}
                // sizes="(max-width: 768px) 100vw, 33vw"
                height={300}
                alt="Logo"
                style={{
                  objectFit: "contain",
                }}
              /> */}
              <img
                src="/img/CarPromo_final.png"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
};
