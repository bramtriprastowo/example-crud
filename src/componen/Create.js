import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

function Edit() {
  const [data, setData] = useState({}); //State
  const [provinsi, setProvinsi] = useState([]);
  const [listProvinsi, setListProvinsi] = useState([]);
  const [idProvinsi, setIdProvinsi] = useState("");
  const [listKabupaten, setListKabupaten] = useState([]);
  const [idKabupaten, setIdKabupaten] = useState("");
  const [listKecamatan, setListKecamatan] = useState([]);
  const { id } = useParams();
  const ref0 = useRef();
  let navigate = useNavigate();

  //untuk record data sementara yang dimasukin ke state
  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setData((a) => {
      return type === "number"
        ? { ...a, [name]: Number(value) }
        : { ...a, [name]: value };
    });
  };

  const handleChangeMUI = (e, value) => {
    setData((a) => {
      return { ...a, [ref0.current.getAttribute("name")]: value }
    });
  };

  // data yang udh di masukkin di submit ke axios
  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, jalan, provinsi, kabupaten, kecamatan, kelurahan } = data;
    axios
      .post(`https://61601920faa03600179fb8d2.mockapi.io/pegawai`, {
        nama,
        jalan,
        provinsi,
        kabupaten,
        kecamatan,
        kelurahan,
      })
      .then((res) => {
        console.log(res);
        alert("Berhasil di Create");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        alert("Gagal di Create");
        window.location.reload();
      });
  };

  useEffect(() => {
    //fungsi untuk nampilin data di awal
    console.log("Jalan")
    axios
      .get(`https://dev.farizdotid.com/api/daerahindonesia/provinsi`)
      .then((response) => {
        setProvinsi(response.data.provinsi.map((item) => item.nama));
        setListProvinsi(response.data.provinsi);
      })
  }, []);
  console.log(data);

  useEffect(() => {
    const setIdProvinsiFunction = () => {
      const idProvinsiAPI = listProvinsi.find(item => item.nama == data.provinsi);
      setIdProvinsi(idProvinsiAPI ? idProvinsiAPI.id : "");
    }

    const getKabupaten = () => {
      axios
        .get(`https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${idProvinsi}`)
        .then((response) => {
          setListKabupaten(response.data.kota_kabupaten);
        })
    }

    setIdProvinsiFunction();
    getKabupaten(idProvinsi);
  }, [data.provinsi, listProvinsi, idProvinsi])

  useEffect(() => {
    const setIdKabupatenFunction = () => {
      const idKabupatenAPI = listKabupaten.find(item => item.nama == data.kabupaten);
      setIdKabupaten(idKabupatenAPI ? idKabupatenAPI.id : "");
    }
    const getKecamatan = () => {
      axios
        .get(`https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${idKabupaten}`)
        .then((response) => {
          setListKecamatan(response.data.kecamatan);
        })
    }
    setIdKabupatenFunction();
    getKecamatan(idKabupaten)
  }, [data.kabupaten, idKabupaten, listKabupaten])
  
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nama" className="form-label">
            nama
          </label>
          <input
            name="nama"
            onChange={handleChange}
            type="text"
            className="form-control"
            aria-describedby="nama"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="jalan" className="form-label">
            Jalan
          </label>
          <input
            name="jalan"
            onChange={handleChange}
            type="text"
            className="form-control"
            aria-describedby="Jalan"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="provinsi" className="form-label">
            Provinsi
          </label>

          <Autocomplete
            disablePortal
            id="provinsi"
            ref={ref0}
            name="provinsi"
            options={provinsi}
            // sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="provinsi" />}
            onChange={handleChangeMUI}
          />
        </div>

        <div className="mb-3">
          <TextField
          id="kota_kabupaten"
          select
          label="Kota / Kabupaten"
          defaultValue=""
          helperText="Silakan masukkan kota / kabupaten"
          name="kabupaten"
          onChange={handleChange}
        >
          {listKabupaten.map((option) => (
            <MenuItem key={option.id} value={option.nama}>
              {option.nama}
            </MenuItem>
          ))}
        </TextField>
        </div>

        <div className="mb-3">
          <TextField
          id="kecamatan"
          select
          label="Kecamatan"
          defaultValue=""
          helperText="Silakan masukkan kecamatan"
          name="kecamatan"
          onChange={handleChange}
        >
          {listKecamatan.map((option) => (
            <MenuItem key={option.id} value={option.nama}>
              {option.nama}
            </MenuItem>
          ))}
        </TextField>
        </div>

        <div className="mb-3">
          <label htmlFor="kelurahan" className="form-label">
            Kelurahan
          </label>
          <input
            name="kelurahan"
            onChange={handleChange}
            type="text"
            className="form-control"
            aria-describedby="kelurahan"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Edit;
