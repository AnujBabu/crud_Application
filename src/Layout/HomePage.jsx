import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';

const HomePage = () => {

  const navigate = useNavigate()
  const [pageSize, setPageSize] = React.useState(5);
  const [data, setData] = useState([])
  const initData = {
    name: '',
    age: '',
    email: '',
    mobile: "",
    address: '',
    designation: ''
  }
  const [isUpdate, setIsupdate] = useState(false)
  const [datas, setDatas] = useState(initData)
  const [isValidate, setIsvalidate] = useState(initData)
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDatas(initData)
    setIsupdate(false)
  }
  const getData = () => {

    axios.get("http://localhost:5100/get-tableData").then((response) => {
      const gettingData = response.data.map((item, i) => {
        return {
          id: i + 1,
          name: item.name,
          mobile: item.mobile,
          email: item.email,
          address: item.address,
          age: item.age,
          designation: item.designation,
          _id: item._id
        }
      })
      setData(gettingData)
    })
      .catch((err) => {
        console.log("Something went wrong", err)
      });
  }

  useEffect(() => {
    getData()
  }, [])

  const emailPattern = /^([_\-\.1-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
  const regexMobile = /^[0-9]{10,12}$/;
  const regexName = /^[a-zA-Z ]{2,25}$/;
  const handleValidate = (e) => {
    let obj = {}, status = true
    if (emailPattern.test(datas.email) == false) {
      obj.email = "Validation Error eg: xxxx@ss.zz"
      status = false
    }
    if (regexMobile.test(datas.mobile) == false) {
      obj.mobile = "Validation err ,number length 10-12"
      status = false
    }
    if (datas.age <= 1 || datas.age > 100) {
      obj.age = "Validation err ,age between 1-99"
      status = false
    }
    if (regexName.test(datas.name) == false) {
      obj.name = "Validation Error eg: Use only alphbetical Character , length 2-25"
      status = false
    }
    setIsvalidate(obj);
    return status;
  }
  const handleChange = (props) => (e) => {
    setDatas({ ...datas, [props]: e.target.value })
    handleValidate()

  };


  const handleEdi = (editData) => {
    console.log("dataEdit", editData)
    setDatas(editData)
    setIsupdate(true)
    setOpen(true)
  }
  const handleUpdate = async (editData) => {
    if (datas.email === "" || datas.name === "" || datas.mobile === "" || datas.age === "" || datas.address === "" || datas.designation === "") {
      return
    } else {
      let status = true;
      status = handleValidate()
      if (status) {
        console.log("beforeUpdate Data", datas)
        await axios({
          url: "http://localhost:5100/update",
          method: "PUT",
          data: datas,
        })
          .then((response) => {
            console.log('Updated ', response)
            setOpen(false)
            setDatas(initData)
            setIsupdate(false)
            getData()
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: "Data Updated ",
              timer: 1500
            })
          })
          .catch((err) => {
            console.log("Something went wrong", err)
            setOpen(false)
            Swal.fire({
              icon: 'error',
              title: 'Invalid',
              text: 'Server crashed'
            })
          });
      }
    }
  }


  const handleDele = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5100/delete/${id}`)
        getData()
        setOpen(false)
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  const columns = [
    { field: 'id', headerName: 'Sr. No.', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 240,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'mobile',
      headerName: 'Mobile Number',

      sortable: true,
      width: 200,

    },
    {
      field: 'address',
      headerName: 'Address',
      type: 'string',
      width: 260,
      editable: true,
    },
    {
      field: 'designation',
      headerName: 'Designation',

      sortable: true,
      width: 260,

    },
    {
      field: 'Edit',
      headerName: 'edit',
      width: 110,
      renderCell: (params) => (
        <div>
          <EditIcon onClick={() => { handleEdi(params.row) }} />
        </div>
      ),

    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 160,
      renderCell: (params) => (
        <div>
          <DeleteIcon onClick={() => { handleDele(params.row._id) }} />
        </div>
      ),



    },
  ];
  const addData = () => {
    setOpen(true)
  }
  const addedData = async () => {
    if (datas.email === "" || datas.name === "" || datas.mobile === "" || datas.age === "" || datas.address === "" || datas.designation === "") {
      return
    } else {
      let status = true;
      status = handleValidate()
      if (status) {
        console.log("beforeUpdate Data", datas)
        await axios({
          url: "http://localhost:5100/add-user",
          method: "POST",
          data: datas,
        })
          .then((response) => {
            console.log('Saved ', response)
            setOpen(false)
            setDatas(initData)
            setIsupdate(false)
            getData()
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: "Data Saved ",
              timer: 1500
            })
          })
          .catch((err) => {
            console.log("Something went wrong", err)
            setOpen(false)
            Swal.fire({
              icon: 'error',
              title: 'Invalid',
              text: 'Email Already Exist'
            })
          });
      }
    }
  }
  const handleLogout = () => {
    Swal.fire({
      title: 'Do you want to Logout?',
      showDenyButton: true,

      confirmButtonText: 'Yes',
      denyButtonText: `Cancel`,
    }).then((result) => {

      if (result.isConfirmed) {
        window.localStorage.removeItem('Email')
        window.localStorage.removeItem('Password')
        navigate('/')
      }
    })

  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius:"20px"
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Employees Details
            </Typography>
            <p className="userText">{window.localStorage.getItem('Email')}</p>
            <Button variant="contained" color="error"
              onClick={handleLogout} >Log out</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ width: '100%' }} >
        <Button sx={{margin: 2}} variant="contained" color="success"
          onClick={addData} >Add Data</Button>
      </Box>
      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={[...data]}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[4, 5, 6, 7, 8, 9, 10]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {!isUpdate ? <h1>Add Data</h1> : <h1>Update Data</h1>}
            <div>
              <TextField
                error={isValidate.name}
                id="standard-error-helper-text"
                label="Name"
                onChange={handleChange('name')}
                variant="standard"
                fullWidth
                defaultValue={isUpdate ? datas.name : ""}
                helperText={isValidate.name}
                required
              />
            </div><br></br>
            <div>
              <TextField
                error={isValidate.age}
                id="standard-error-helper-text"
                label="Age"
                InputProps={{ inputProps: { min: "0", max: "99" } }}
                type="number"
                fullWidth
                onChange={handleChange('age')}
                variant="standard"
                defaultValue={isUpdate ? datas.age : ""}
                helperText={isValidate.age}
                required
              />
            </div><br></br>
            <div>
              <TextField
                error={isValidate.mobile}
                id="standard-error-helper-text"
                label="Mobile"
                type="number"
                InputProps={{ inputProps: { maxLength: 12 } }}
                onChange={handleChange('mobile')}
                defaultValue={isUpdate ? datas.mobile : ""}
                fullWidth
                helperText={isValidate.mobile}
                variant="standard"
                required
              />
            </div><br></br>
            <div>
              <TextField
                error={isValidate.email}
                id="standard-error-helper-text"
                label="Email"
                fullWidth
                defaultValue={isUpdate ? datas.email : ""}
                onChange={handleChange('email')}
                helperText={isValidate.email}
                variant="standard"
                required
              />
            </div><br></br>
            <div>
              <TextField
                error={isValidate.address}
                id="standard-error-helper-text"
                label="Address"
                defaultValue={isUpdate ? datas.address : ""}
                onChange={handleChange('address')}
                variant="standard"
                fullWidth
                helperText={isValidate.address}
                required
              />
            </div><br></br>
            <div>
              <TextField
                error={isValidate.designation}
                id="standard-error-helper-text"
                fullWidth
                label="Designation"
                defaultValue={isUpdate ? datas.designation : ""}
                onChange={handleChange('designation')}
                variant="standard"
                helperText={isValidate.designation}
                required
              />
            </div>   <br></br>
            <div className='modalbtn' >        
             <Button variant="contained" color="success" onClick={isUpdate ? handleUpdate : addedData}>{isUpdate ? "Update" : "Save"}</Button>
            <Button variant="contained" color='error'  onClick={handleClose} type="button">Cancel</Button></div>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default HomePage
