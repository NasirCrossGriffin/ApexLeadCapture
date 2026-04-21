import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    primary: {
      main: "#4f8cff",
    },
  },
});

export default function AppointmentDatePicker({
  dt,
  setIsoString,
  setDt
} : {
  dt : Dayjs | null;
  setIsoString: React.Dispatch<React.SetStateAction<string>>;
  setDt : React.Dispatch<React.SetStateAction<Dayjs | null>>;
}) {

  React.useEffect(() => {
    const isoString = dt ? dt.toISOString() : '';
    console.log(isoString)
    setIsoString(isoString);
  }, [dt])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Appointment date & time"
          value={dt}
          onChange={setDt}
          disablePast
          slotProps={{
            textField: {
              fullWidth: true,
            } as any,
          }}
        />
    </LocalizationProvider>

    </ThemeProvider>
  );
}
