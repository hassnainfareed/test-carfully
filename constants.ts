import { AddressType, GenderType } from "@prisma/client";

export const GUID_EMPTY: string = "00000000-0000-0000-0000-000000000000";
export const ROLE_ADMIN: string = "admin";
export const ROLE_EMPLOYEE: string = "employee";
export const ROLE_USER: string = "user";
export const INVOICE_PAD_START: number = 7;
export const TAX_AMOUNT: number = 0.19;

export const SUNDAY: number = 0;
export const MONDAY: number = 1;
export const TUESDAY: number = 2;
export const WEDNESDAY: number = 3;
export const THURSDAY: number = 4;
export const FRIDAY: number = 5;
export const SATURDAY: number = 6;
export const QUARTER_HOUR: number = 15;

// export const TIMEZONE: string = "America/Toronto";
export const TIMEZONE: string = "Europe/Berlin";

export const GENDER_TYPES = [
  { value: GenderType.NOT_SPECIFIED, display: "Keine Angaben" },
  { value: GenderType.FEMALE, display: "Frau" },
  { value: GenderType.MALE, display: "Herr" },
];

export const ADDRESS_TYPES = [
  { value: AddressType.PRIVATE, display: "Privat" },
  { value: AddressType.BUSINESS, display: "Geschäftlich" },
];

export const COOKIE_KEY_LOCATION_ID = "carfully.management.locationId";
export const COOKIE_KEY_CONSENT = "carfully.user.cookie_consent";

export const CARFULLY_LOGO_BASE64: string =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWYAAAAwCAYAAAAihtBIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkY2RUY5RTk4RTI0MTFFRThGOERDQzM5REMxRUQzMUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkY2RUY5RUE4RTI0MTFFRThGOERDQzM5REMxRUQzMUEiPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+T251cjwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvZGM6Y3JlYXRvcj4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij7DnGJlcnNjaHJpZnQgaGluenVmw7xnZW4gLSA1PC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPHhtcE1NOkRlcml2ZWRGcm9t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";