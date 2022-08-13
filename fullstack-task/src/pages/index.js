import clientPromise from "../lib/mongodb";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [data, setData] = useState([]);
  const [label, setLabel] = useState([]);
  const [enodebId, setEnodebId] = useState("");
  const [cellId, setCellId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:2000/api/graph", {
        params: {
          cellId,
          enodebId,
          endDate,
          startDate,
        },
      });

      const data = res.data;

      setLabel(
        Object.keys(data).map(function (key) {
          return moment(data[key].resultTime).format("YYYY-MM-DD");
        })
      );

      setData(
        Object.keys(data).map(function (key) {
          return data[key].availability;
        })
      );

      toast.success("You Found The Data!", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message, {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1000,
      });
    }
  };

  const dataGraph = {
    labels: label,
    datasets: [
      {
        label: "Availability",
        data: data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Contoh",
      },
    },
  };
  return (
    <div className="box">
      <h2>What are you looking for ?</h2>
      <div className="filter-box">
        <div>
          <p style={{ margin: 0 }}>Search Enodeb</p>
          <input
            type="string"
            placeholder="Search Enodeb"
            onChange={(e) => setEnodebId(e.target.value)}
          />
        </div>
        <div>
          <p style={{ margin: 0 }}>Search Cell</p>
          <input
            type="string"
            placeholder="Search Cell"
            onChange={(e) => setCellId(e.currentTarget.value)}
          />
        </div>
        <div>
          <p style={{ margin: 0 }}>Start Date</p>
          <input
            type="date"
            placeholder="Start Date"
            style={{ height: "22px" }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <p style={{ margin: 0 }}>End Date</p>
          <input
            placeholder="End Date"
            type="date"
            style={{ height: "22px" }}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <p style={{ margin: 0 }}>&nbsp;</p>
          <button className="button-search" onClick={fetchData}>
            Search
          </button>
        </div>
      </div>
      <div style={{ padding: 3 }}>
        <Line data={dataGraph} options={options} height="100px" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          className="button-search"
          onClick={() => router.push("/upload")}
        >
          Go to Upload Page
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
