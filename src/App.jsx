import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReactJson from "react-json-view";
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const App = () => {
  const [payload, setPayload] = useState({
    database_name: "",
    collection_name: "",
    limit: null,
    offset: null,
  });
  const [jsonDataList, setJsonDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchTime, setFetchTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startTime = performance.now(); 
    try {
      const response = await axios.post(
        "https://100105.pythonanywhere.com/api/v3/experience_report_services/?type=retrive_data",
        payload
      );
      const data = response.data.response;
      setJsonDataList([data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      const endTime = performance.now(); 
      const timeTaken = endTime - startTime;
      setFetchTime(timeTaken / 1000); 
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
   
    if (name === "limit" || name === "offset") {
      if (!isNaN(value)) {
        setPayload((prevPayload) => ({
          ...prevPayload,
          [name]: parseInt(value), 
        }));
      }
    } else {
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h3" component="h1">
          Datacube Data Viewer
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Database Name"
            name="database_name"
            value={payload.database_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Collection Name"
            name="collection_name"
            value={payload.collection_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Limit"
            name="limit"
            type="number" 
            value={payload.limit}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Offset"
            name="offset"
            type="number" 
            value={payload.offset}
            onChange={handleInputChange}
            margin="normal"
          />
          <Button variant="contained" type="submit" color="primary">
            Fetch Data
          </Button>
        </form>
        <br />
        {loading && <CircularProgress />}
        {fetchTime && (
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Data fetched in {fetchTime.toFixed(2)} seconds
          </Typography>
        )}
        {!loading &&
          jsonDataList.map((jsonData, index) => (
            <div key={index}>
              <ReactJson src={jsonData} displayDataTypes={false} theme="twilight" collapsed= {true} name={false}/>
              <hr />
            </div>
          ))}
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default App;
