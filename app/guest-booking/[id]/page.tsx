import React from 'react';
import prisma from '@/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPersonRunning,
    faCheck,
    faX,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { TIMEZONE } from '@/constants';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIMEZONE);

export default async function GuestBookingConfirm({
    params,
}: {
    params: { id: string };
}) {
    const booking = await prisma.booking.findFirst({
        where: {
            id: params.id,
        },
        include: {
            user: true  // Include user to show guest email
        }
    });

    const car = await prisma.car.findFirst({
        where: {
            id: booking?.carId,
        },
    });

    const location = await prisma.location.findFirst({
        where: {
            id: booking?.locationId,
        },
    });

    const services = await prisma.servicesOnBookings.findMany({
        where: {
            bookingId: booking?.id,
        },
        include: {
            service: true,
        },
    });

    var description: string = '';
    services.forEach((e, i) => {
        description += `${e.service.name} `;
    });

    return (
        <div className="mx-auto max-w-7xl p-8">
            {booking?.paymentStatus === 'PAID' ||
                booking?.paymentStatus === 'FUEL_CARD' ? (
                <div className="flex flex-col">
                    <div className="text-2xl sm:text-4xl text-sky-700 mb-4">
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="w-10 h-10 mr-4"
                        />
                        Buchung erfolgreich
                    </div>
                    {booking?.isNow && (
                        <div className="text-xl sm:text-2xl text-slate-900 italic mb-12">
                            <div className="flex flex-row gap-x-2">
                                Wir machen uns sofort auf den Weg!
                                <FontAwesomeIcon
                                    icon={faPersonRunning}
                                    className="w-6 h-6 mt-[4px]"
                                />
                            </div>
                        </div>
                    )}
                    <table className="w-80 table-auto">
                        <tbody>
                            <tr className="h-10">
                                <td className="font-extrabold">
                                    Buchungsnummer
                                </td>
                                <td>{booking?.number}</td>
                            </tr>
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">
                                    Buchungsdatum
                                </td>
                                <td>
                                    {dayjs
                                        .tz(booking?.date)
                                        .format('DD.MM.YYYY HH:mm')}
                                </td>
                            </tr>
                            {!booking.isNow && (
                                <tr className="h-10 border-t-[1px] border-gray-400">
                                    <td className="font-extrabold">Termin</td>
                                    <td>
                                        {dayjs
                                            .tz(booking?.appointmentDate)
                                            .format('DD.MM.YYYY')}{' '}
                                        -{' '}
                                        {dayjs
                                            .tz(booking?.appointmentTime)
                                            .format('HH:mm')}
                                    </td>
                                </tr>
                            )}
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">E-Mail</td>
                                <td>{booking?.user?.email}</td>
                            </tr>
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">Standort</td>
                                <td>
                                    {location?.name}
                                    <br />
                                    {location?.street} {location?.number}
                                    <br />
                                    {location?.postalCode} {location?.city}
                                </td>
                            </tr>
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">Kennzeichen</td>
                                <td>{car?.licenseNumber}</td>
                            </tr>
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">
                                    Dienstleistungen
                                </td>
                                <td>{description}</td>
                            </tr>
                            <tr className="h-10 border-t-[1px] border-gray-400">
                                <td className="font-extrabold">Preis</td>
                                <td>{booking?.totalPrice} €</td>
                            </tr>
                        </tbody>
                    </table>

                    <div
                        className="p-4 mt-12 text-lg text-slate-900 rounded-lg bg-gray-200"
                        role="alert"
                    >
                        <span className="font-medium mr-2">Status</span>
                        Wir haben Ihnen eine E-Mail mit Ihren Zugangsdaten und der Buchungsbestätigung gesendet.
                        Sie können sich damit einloggen und den Status Ihrer Buchung in Ihrem{' '}
                        <a href="/user" className="font-bold text-sky-700">
                            Benutzerkonto
                        </a>{' '}
                        verfolgen. Zudem erhalten Sie eine E-Mail sobald wir mit
                        der Bearbeitung Ihrer Buchung begonnen haben und
                        anschließend eine E-Mail wenn wir Ihre Buchung
                        abgeschlossen haben.
                    </div>
                </div>
            ) : (
                <div className="flex flex-col text-gray-400">
                    <div className="text-2xl sm:text-4xl text-red-700 mb-4">
                        <FontAwesomeIcon
                            icon={faX}
                            className="w-10 h-10 mr-4"
                        />
                        Buchung fehlgeschlagen
                    </div>
                    <p>Status: {booking?.paymentStatus}</p>
                </div>
            )}
        </div>
    );
}
