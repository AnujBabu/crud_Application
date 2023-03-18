import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function SignUp() {
    const navigate = useNavigate()
    const initData = {
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    }
    const [data, setData] = useState(initData)
    const [isValidate, setIsValidate] = useState(initData)
    const regexEmail = /^([_\-\.1-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
    const regexPassword = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/
    const regexMobile = /^[0-9]{10,12}$/;
    const regexName = /^[a-zA-Z ]{2,25}$/;

    const forValidate = () => {
        let obj = {}, status = true
        if (regexEmail.test(data.email) == false) {
            obj.email = "Validation Error eg: xxxx@ss.zz"
            status = false
        }
        if (regexName.test(data.name) == false) {
            obj.name = "Validation Error eg:use only Alphabetic Character, Length 2-25"
            status = false
        }
        if (regexPassword.test(data.password) == false) {
            obj.password = "Validation Error eg: Use atleast one number and Special Character , length 6-15"
            status = false
        }
        if (regexMobile.test(data.mobile) == false) {
            obj.mobile = "Validation Error eg: Number length 10-12 digit "
            status = false
        }
        setIsValidate(obj)
        return status;
    }
    const handleChange =
        (prop) => (event) => {
            setData({ ...data, [prop]: event.target.value });
            forValidate()
        }
    // console.log("data", data)
    const handleSubmit = async (e) => {
        if (data.email === "" || data.name === "" || data.mobile === "" || data.password === "") {
            return
        } else {
            let status = true;
            status = forValidate()
            if (status) {
                await axios({
                    url: "http://localhost:5100/signup",
                    method: "POST",
                    data: {
                        name: `${data.name}`,
                        email: `${data.email}`,
                        mobile: `${data.mobile}`,
                        password: `${data.password}`
                    },
                })
                    .then((response) => {
                        console.log('SignUp successfully', response)
                        if(response.data)
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            text: "Sign Up Successfully",
                            timer: 1500
                        })
                        navigate('/')
                    })
                    .catch((err) => {
                        console.log("Email Already Exist", err)
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid',
                            text: 'Users Email Already exist '
                        })
                    });
            }
        }
    };
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" className="signInBody2" >
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddAltIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box>
                        <TextField
                            error={isValidate.name}
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange('name')}
                            name="Name"
                            label="Name"
                            id="name"
                            helperText={isValidate.name}
                            autoComplete="off"
                        />
                        <TextField
                            margin="normal"
                            error={isValidate.mobile}
                            required
                            fullWidth
                            onChange={handleChange('mobile')}
                            id="mobile"
                            label="Mobile"
                            type="number"
                            name="mobile"
                            autoComplete="mobile"
                            helperText={isValidate.mobile}
                            autoFocus
                        />
                        <TextField
                            error={isValidate.email}
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange('email')}
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            helperText={isValidate.email}
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            error={isValidate.password}
                            fullWidth
                            onChange={handleChange('password')}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            helperText={isValidate.password}
                            autoComplete="current-password"
                        />
                        <TextField
                            error={data.confirmPassword !== data.password}
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange('confirmPassword')}
                            id="confirmPassword"
                            label="Confirm Password"
                            name="confirmPassword"
                            autoComplete="off"
                            helperText={data.confirmPassword == data.password ? "" : "Your password and confirm password are not same"}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to='/' >
                                    {"Already have an account?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}