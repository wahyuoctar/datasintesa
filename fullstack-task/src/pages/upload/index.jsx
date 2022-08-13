import { useEffect, useRef, useState } from "react";
import clientPromise from "../../lib/mongodb";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UploadPage = ({ isConnected }) => {
  const [selectFile, setSelectFile] = useState(null);
  const uploadRef = useRef(null);
  const router = useRouter();

  const uploadRar = async () => {
    try {
      const formData = new FormData();
      formData.append("rar_file", selectFile);

      await axios.post("http://localhost:2000/api/upload", formData);

      toast.success("Upload Success!", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1000,
      });
      setSelectFile(null);
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed!", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1000,
      });
      setSelectFile(null);
    }
  };

  useEffect(() => {
    if (selectFile === null) {
      return;
    }
  }, [selectFile]);

  return (
    <div className="box-upload">
      <h2>Select File</h2>
      <input
        onChange={(e) => {
          setSelectFile(e.target.files[0]);
          toast.info(`File Attached!`, {
            position: toast.POSITION.BOTTOM_LEFT,
            autoClose: 1000,
          });
        }}
        type="file"
        ref={uploadRef}
        style={{ display: "none" }}
        accept=".rar, .zip, .csv, .xlsx, .xls, .gz"
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {selectFile ? (
          <>
            <button
              className="button-upload"
              onClick={() => setSelectFile(null)}
            >
              Discard
            </button>
            <button className="button-save" onClick={uploadRar}>
              Save
            </button>
          </>
        ) : (
          <button
            className="button-upload"
            onClick={() => uploadRef.current.click()}
          >
            Upload
          </button>
        )}
      </div>
      <div style={{ marginTop: "20px", textAlign: "start" }}>
        <button
          style={{ width: "auto", fontSize: "smaller", padding: "5px" }}
          className="button-upload"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

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

export default UploadPage;
