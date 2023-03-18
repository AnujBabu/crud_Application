import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom';
const theme = createTheme();

const SignIn = () => {
    const navigate = useNavigate()
    const initData = {
        email: '',
        password: '',
    }
    const [data, setData] = useState(initData)
    const [isValidate, setIsvalidate] = useState(initData)
    const emailPattern = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
    const regExpPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    const handleValidate = (e) => {
        let obj = {}, status = true
        if (emailPattern.test(data.email) == false) {
            obj.email = "Validation Error eg: xxxx@ss.zz"
            status = false
        }
        if (regExpPassword.test(data.password) == false) {
            obj.password = "Validation Error eg: Use atleast one number and Special Character , length 6-15"
            status = false
        }
        setIsvalidate(obj);
        return status;
    }
    const handleChange = (props) => {
        setData({ ...data, [props.target.name]: props.target.value })
        handleValidate()

    };
    console.log("data", data)
    const handleSubmit = async (e) => {
        if (data.email === "" || data.password === "") {
            return
        } else {
            console.log(data)
            let status = true
            status = handleValidate();
            if (status) {

                await axios({
                    url: "http://localhost:5100/signin",
                    method: "POST",
                    data: {
                        email: `${data.email}`,
                        password: `${data.password}`
                    },
                })
                    .then((response) => {
                        console.log('SignIn successfully', response);
                        if (response.status == 200) {
                            window.localStorage.setItem(
                                "Email", data.email
                            )
                            window.localStorage.setItem(
                                "Password", data.password
                            )

                            navigate('/homePage')
                        }
                    })
                    .catch((err) => {
                        console.log("Something went wrong", err.response.data)
                        if(err.response.data.email==null && err.response.data.password==null){
                        Swal.fire({
                            icon: 'error',
                            text: `Email And Password are not exist in DataBase`,

                        })
                    }else if(err.response.data.email==null){
                        Swal.fire({
                            icon: 'error',
                            text: `Email is not exist in DataBase`,

                        })
                    }else if(err.response.data.password==null){
                        Swal.fire({
                            icon: 'error',
                            text: `password is not exist in DataBase`,

                        })
                    }
                    });
            }

        }

    };

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
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            error={isValidate.email}
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            helperText={isValidate.email}
                            autoFocus
                        />

                        <TextField
                            error={isValidate.password}
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            helperText={isValidate.password}
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to='/' >
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to='/signUp'>
                                    {"Register here?"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
export default SignIn