"use client";
import React, { useState, useEffect } from "react";
import { Location, Service, ServicesOnLocations } from "@prisma/client";
import LocationService from "@/services/LocationService";
import ServiceService from "@/services/ServiceService";
import { GUID_EMPTY } from "@/constants";
import {
  Button,
  Container,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  deDE,
  useGridApiRef,
} from "@mui/x-data-grid";
// import { TIMEZONE } from "@/constants";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

interface Props {
  locationId: string;
}

export default function LocationDetails({ params }: { params: Props }) {
  const [location, setLocation] = useState<Location | undefined>();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<String[]>();
  // const [servicesOnLocations, setServicesOnLocations] = useState<
  //   ServicesOnLocations[] | null
  // >();
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const locationService = new LocationService();
  const serviceService = new ServiceService();

  const router = useRouter();

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    deDE
  );

  const apiRef = useGridApiRef();

  type PropType =
    | "id"
    | "name"
    // | "latitude"
    // | "longitude"
    | "street"
    | "number"
    | "postalCode"
    | "city"
    | "activeFromDate"
    | "whatsAppReceiver"
    | "smsReceiver"
    | "emailReceiver"
    | "highBookings"
    | "maxBookings"
    | "mondayStart"
    | "mondayEnd"
    | "tuesdayStart"
    | "tuesdayEnd"
    | "wednesdayStart"
    | "wednesdayEnd"
    | "thursdayStart"
    | "thursdayEnd"
    | "fridayStart"
    | "fridayEnd"
    | "saturdayStart"
    | "saturdayEnd"
    | "sundayStart"
    | "sundayEnd";

  interface SonTextFieldProps {
    propType: PropType;
    label: string;
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      name: "",
      // latitude: null as number | null,
      // longitude: null as number | null,
      street: "",
      number: "",
      postalCode: 0,
      city: "",
      activeFromDate: null as Dayjs | null,
      whatsAppReceiver: null as string | null,
      smsReceiver: null as string | null,
      emailReceiver: null as string | null,
      highBookings: null as number | null,
      maxBookings: null as number | null,
      mondayStart: null as Dayjs | null,
      mondayEnd: null as Dayjs | null,
      tuesdayStart: null as Dayjs | null,
      tuesdayEnd: null as Dayjs | null,
      wednesdayStart: null as Dayjs | null,
      wednesdayEnd: null as Dayjs | null,
      thursdayStart: null as Dayjs | null,
      thursdayEnd: null as Dayjs | null,
      fridayStart: null as Dayjs | null,
      fridayEnd: null as Dayjs | null,
      saturdayStart: null as Dayjs | null,
      saturdayEnd: null as Dayjs | null,
      sundayStart: null as Dayjs | null,
      sundayEnd: null as Dayjs | null,
    },
  });

  useEffect(() => {
    if (params.locationId === GUID_EMPTY) {
      setIsNew(true);
      return;
    }

    locationService.get(params.locationId).then((data) => {
      setLocation(data);
      reset({
        id: data.id,
        name: data.name,
        // latitude: data.latitude,
        // longitude: data.longitude,
        street: data.street,
        number: data.number,
        postalCode: data.postalCode,
        city: data.city,
        activeFromDate: data.activeFromDate ? dayjs(data.activeFromDate) : null,
        whatsAppReceiver: data.whatsAppReceiver,
        smsReceiver: data.smsReceiver,
        emailReceiver: data.emailReceiver,
        highBookings: data.highBookings,
        maxBookings: data.maxBookings,
        mondayStart: data.mondayStart,
        mondayEnd: data.mondayEnd,
        tuesdayStart: data.tuesdayStart,
        tuesdayEnd: data.tuesdayEnd,
        wednesdayStart: data.wednesdayStart,
        wednesdayEnd: data.wednesdayEnd,
        thursdayStart: data.thursdayStart,
        thursdayEnd: data.thursdayEnd,
        fridayStart: data.fridayStart,
        fridayEnd: data.fridayEnd,
        saturdayStart: data.saturdayStart,
        saturdayEnd: data.saturdayEnd,
        sundayStart: data.sundayStart,
        sundayEnd: data.sundayEnd,
      });
    });

    serviceService.getAll().then((data) => setServices(data));
    locationService.getIncludeServices(params.locationId).then((data) => {
      // setServicesOnLocations(data.ServicesOnLocations);

      let initialArray: string[] = [];
      data.ServicesOnLocations.forEach((sl: ServicesOnLocations) => {
        initialArray.push(sl.serviceId);
      });

      apiRef.current.setRowSelectionModel(initialArray); // initial

      setSelectedRowKeys(initialArray!);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: any) => {
    setIsSaving(true);
    if (isNew) {
      locationService.create(data);
    } else {
      locationService.update(data);
    }

    router.push("/admin/locations");
  };

  const SonTextField = ({ params }: { params: SonTextFieldProps }) => {
    return (
      <Controller
        name={params.propType}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            value={field.value ?? ""}
            InputLabelProps={{ shrink: true }}
            label={params.label}
            {...register(params.propType)}
          />
        )}
      />
    );
  };

  const SonNumberField = ({ params }: { params: SonTextFieldProps }) => {
    return (
      <Controller
        name={params.propType}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            InputLabelProps={{ shrink: true }}
            value={field.value ?? ""}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label={params.label}
            {...register(params.propType, { valueAsNumber: true })}
          />
        )}
      />
    );
  };

  const SonDateTimeField = ({ params }: { params: SonTextFieldProps }) => {
    return (
      <Controller
        control={control}
        name={params.propType}
        render={({ field }) => {
          return (
            <DateTimePicker
              slotProps={{
                actionBar: {
                  actions: ["clear"],
                },
              }}
              format="DD.MM.YYYY HH:mm"
              label={params.label}
              value={dayjs(field.value) ?? dayjs()}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          );
        }}
      />
    );
  };

  const SonTimeField = ({ params }: { params: SonTextFieldProps }) => {
    return (
      <Controller
        control={control}
        name={params.propType}
        render={({ field }) => {
          return (
            <TimePicker
              timeSteps={{ minutes: 15 }}
              slotProps={{
                actionBar: {
                  actions: ["clear"],
                },
              }}
              format="HH:mm"
              label={params.label}
              value={dayjs(field.value) ?? dayjs()}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          );
        }}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Dienstleistung",
      width: 150,
    },

    {
      field: "description",
      headerName: "Beschreibung",
      width: 150,
    },
    {
      field: "price",
      headerName: "Preis",
      width: 150,
    },
  ];

  const onRowSelectionModelChange = async (
    rowSelectionModel: GridRowSelectionModel
  ) => {
    if (rowSelectionModel && selectedRowKeys) {
      if (rowSelectionModel.length > selectedRowKeys!.length) {
        // row added
        const serviceIds = rowSelectionModel
          .map((x) => x.toString())
          .filter((x) => !selectedRowKeys?.includes(x.toString()));
        if (serviceIds && serviceIds.length > 0) {
          const serviceId = serviceIds[0];
          setSelectedRowKeys([...selectedRowKeys!, serviceIds.toString()]);
          await locationService.insertServiceOnLocations(
            location?.id!,
            serviceId
          );
        }
      } else {
        // row removed
        const serviceIds = selectedRowKeys!.filter(
          (x) =>
            !rowSelectionModel.map((x) => x.toString()).includes(x.toString())
        );
        if (serviceIds && serviceIds.length > 0) {
          const serviceId = serviceIds[0].toString();
          await locationService.removeServiceOnLocations(
            location?.id!,
            serviceId
          );
          setSelectedRowKeys(
            selectedRowKeys!.filter((a) => a !== serviceId.toString())
          );
        }
      }
    }
  };

  return (
    <Container maxWidth={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item lg={12} container spacing={2}>
          <Grid
            item
            lg={12}
            xl={6}
            container
            spacing={2}
            alignContent={"start"}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Allgemein</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <SonTextField params={{ propType: "name", label: "Name" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <SonTextField params={{ propType: "street", label: "Straße" }} />
            </Grid>
            <Grid item xs={12} md={2}>
              <SonTextField
                params={{ propType: "number", label: "Hausnummer" }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <SonNumberField
                params={{ propType: "postalCode", label: "PLZ" }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SonTextField params={{ propType: "city", label: "Stadt" }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SonDateTimeField
                params={{ propType: "activeFromDate", label: "Aktiv ab" }}
              />
            </Grid>
          </Grid>

          <Grid item lg={12} xl={6} container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Benachrichtigungen</Typography>
            </Grid>
            <Grid item xs={12}>
              <SonTextField
                params={{ propType: "emailReceiver", label: "E-Mail" }}
              />
            </Grid>
            <Grid item xs={12}>
              <SonTextField
                params={{ propType: "smsReceiver", label: "SMS" }}
              />
            </Grid>
            <Grid item xs={12}>
              <SonTextField
                params={{ propType: "whatsAppReceiver", label: "WhatsApp" }}
              />
            </Grid>
          </Grid>

          <Grid
            item
            lg={12}
            xl={6}
            container
            spacing={2}
            alignContent={"start"}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Konfiguration</Typography>
            </Grid>
            <Grid item xs={12}>
              <SonNumberField
                params={{
                  propType: "highBookings",
                  label: "Warnung bei gleichzeitigen Buchungen ab",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <SonNumberField
                params={{
                  propType: "maxBookings",
                  label:
                    "Temporäre Deaktivierung des Standorts bei gleichzeitigen Buchungen ab",
                }}
              />
            </Grid>
          </Grid>

          <Grid
            item
            lg={6}
            xs={12}
            container
            spacing={2}
            alignContent={"start"}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Öffnungszeiten</Typography>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "mondayStart",
                    label: "Montag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "mondayEnd",
                    label: "Montag Ende",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "tuesdayStart",
                    label: "Dienstag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "tuesdayEnd",
                    label: "Dienstag Ende",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "wednesdayStart",
                    label: "Mittwoch Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "wednesdayEnd",
                    label: "Mittwoch Ende",
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "thursdayStart",
                    label: "Donnerstag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "thursdayEnd",
                    label: "Donnerstag Ende",
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "fridayStart",
                    label: "Freitag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "fridayEnd",
                    label: "Freitag Ende",
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "saturdayStart",
                    label: "Samstag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "saturdayEnd",
                    label: "Samstag Ende",
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "sundayStart",
                    label: "Sonntag Start",
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <SonTimeField
                  params={{
                    propType: "sundayEnd",
                    label: "Sonntag Ende",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} paddingTop={2}>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Speichern
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container item xs={12} spacing={2}>
        <Grid item lg={6} xs={12} container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Freigeschaltete Dienstleistungen
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ThemeProvider theme={theme}>
              <DataGrid
                rows={services}
                apiRef={apiRef}
                columns={columns}
                hideFooter={true}
                checkboxSelection
                onRowSelectionModelChange={onRowSelectionModelChange}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
              />
            </ThemeProvider>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
