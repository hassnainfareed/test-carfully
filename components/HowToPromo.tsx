import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';


export default function HowToPromo() {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);

  const handleBookingClick = () => {
    if (session) {
      window.location.href = '/booking';
    } else {
      setShowDialog(true);
    }
  };

  return (
    <div className="bg-blue-carfully flex flex-col lg:flex-row justify-items-end">
      <div className="lg:basis-1/2 text-gray-200 bg-[url('/img/ParkingSpace1.png')] h-[600px] bg-right"></div>
      <div className="lg:basis-1/2 flex flex-col p-8 max-w-screen-sm">
        <span className="text-4xl lg:text-6xl pl-10 text-gray-200 font-kanit font-semibold">
          <p>Wir kümmern uns</p>
          <p>um Dein Auto,</p>
          <p>während Du</p>
          <p>
            <span className="text-sky-600">einkaufen</span> gehst!
          </p>
        </span>
        <div className="flex flex-row my-5 pl-10 text-gray-200">
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
              src="/img/IconSatisfiedWhite.png"
              style={{ width: 150, height: 80, objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center ml-10">
          <img
            src="/img/IconPhone.png"
            style={{ width: 70, height: 70, objectFit: "contain" }}
          />
          <p className="ml-3 font-black text-gray-200">
            Hast Du Fragen ?{" "}
            <a href="phone:+4917687731630" className="text-sky-700">
              +49 176 87731630
            </a>
          </p>
        </div>
        <div className="flex flex-row justify-around">
          <button
            onClick={handleBookingClick}
            className="bg-gradient-to-br from-orange-700 to-orange-300 hover:from-orange-800 hover:to-orange-400  px-2 py-3 font-bold text-xl rounded-xl text-gray-100 drop-shadow-lg"
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

      {/*         
      <div className="max-w-screen-xl mx-auto  text-center">
        <p className="text-2xl font-extrabold text-blue-400">
          Wasserlos? Ja, richtig!
        </p>
        <p className="text-5xl lg:text-6xl mt-4 font-extrabold text-gray-200">
          Glanz ohne Wasser und Kratzer!
        </p>
        <div className="flex flex-row justify-center text-xl mt-4 w-full font-thin text-gray-200 text-center">
          <p className="w-[720px]">
            Unsere Trockenwäsche hebt mit nur einem Sprühvorgang den Schmutz
            effektiv an und ermöglicht eine mühelose Reinigung ohne Kratzer. Das
            Ergebnis ist ein auf Hochglanz poliertes Auto, das aussieht wie neu.
          </p>
        </div>
      </div> */}
    </div>
  );
}
