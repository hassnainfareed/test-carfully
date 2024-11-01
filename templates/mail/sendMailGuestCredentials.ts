import { MailBaseParams } from './mailBase';
import MailBase from './mailBase';
import { Resend } from 'resend';
import Logger from '@/utils/winstonLogger';

var logger = Logger('SendMailGuestCredentials');
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailGuestCredentials(
	email: string,
	password: string,
	bookingNumber: string,
	bookingAccessToken: string
) {
	logger.info(`started`);
	const bookingLink = `${process.env.SERVER_URL}/booking/guest/${bookingAccessToken}`;
	const loginLink = `${process.env.SERVER_URL}/authentication/login`;

	var mailBaseParams: MailBaseParams = {
		title: 'Willkommen bei Carfully',
		content: `
			Sehr geehrter Kunde,
			<br /><br />
			vielen Dank für Ihre Buchung (${bookingNumber}). Hier sind Ihre Zugangsdaten für Ihren Carfully Account:
			<br /><br />
			<strong>E-Mail:</strong> ${email}<br />
			<strong>Passwort:</strong> ${password}
			<br /><br />
			Sie können sich jetzt mit diesen Zugangsdaten einloggen und Ihre Buchungen verwalten.
			<br /><br />
			<div height="40" align="center">
				<p>Ihre Buchung können Sie hier einsehen:</p>
				<a href="${bookingLink}" style="
					font-family: 'Open sans', Arial, sans-serif;
					color: #0284c7;
					font-size: 16px;
					padding: 10px;
					text-decoration: none;
					border: 2px solid #0284c7;
					display: inline-block;
					margin: 10px 0;
				">Zur Buchung</a>
				<br /><br />
				<p>Oder loggen Sie sich hier ein:</p>
				<a href="${loginLink}" style="
					font-family: 'Open sans', Arial, sans-serif;
					color: #0284c7;
					font-size: 16px;
					padding: 10px;
					text-decoration: none;
					border: 2px solid #0284c7;
					display: inline-block;
					margin: 10px 0;
				">Zum Login</a>
			</div>
			<br /><br />
			Bei Fragen oder Problemen stehen wir Ihnen gerne zur
			Verfügung. Schreiben Sie einfach eine E-Mail an
			<a href="mailto:support@carfully.de">support@carfully.de</a>
			oder kontaktieren Sie uns telefonisch unter der Telefonnummer 
			<a href="tel:+49 1768 7731630">+49 1768 7731630</a>.
			<br /><br />
			Mit freundlichen Grüßen,<br />
			Ihr Carfully Team
		`,
	};

	const html = MailBase(mailBaseParams);

	try {
		logger.info(`Attempting to send email to ${email}`);
		const { data, error } = await resend.emails.send({
			from: process.env.EMAIL_FROM!,
			to: [email],
			subject: `Ihre Zugangsdaten und Buchungsbestätigung für Carfully`,
			html: html,
		});

		if (error) {
			logger.error(`Failed to send email: ${JSON.stringify(error)}`);
			return error;
		}

		logger.info(`Email sent successfully to ${email}`);
		return data;
	} catch (error) {
		logger.error(`Exception while sending email: ${JSON.stringify(error)}`);
		return error;
	}
}
