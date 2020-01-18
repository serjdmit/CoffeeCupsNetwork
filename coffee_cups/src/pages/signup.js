import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as AppIcon } from "../images/icon.svg";

const useStyles = makeStyles(theme => ({
    ...theme.spreadIt
}));

const Signup = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [handle, setHandle] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const classes = useStyles();

    Signup.propTypes = {
        classes: PropTypes.object.isRequired
    };

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true);

        const newUserData = {
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            handle: handle
        };

        axios
            .post("/signup", newUserData)
            .then(res => {
                console.log(res.data);
                localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
                setLoading(false);
                props.history.push("/");
            })
            .catch(err => {
                setErrors(err.response.data);
                setLoading(false);
            });

        console.log(email, password);
    };
    return (
        <Grid container className={classes.form}>
            <Grid item sm></Grid>
            <Grid item sm>
                <AppIcon alt="Coffee image" className={classes.image} />
                <Typography variant="h2" className={classes.pageTitle}>
                    Signup
                </Typography>
                <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={classes.formInner}
                >
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        className={classes.textField}
                        value={email}
                        helperText={errors.email}
                        error={errors.email ? true : false}
                        onChange={event => setEmail(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        value={password}
                        helperText={errors.password}
                        error={errors.password ? true : false}
                        onChange={event => setPassword(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        className={classes.textField}
                        value={confirmPassword}
                        helperText={errors.confirmPassword}
                        error={errors.confirmPassword ? true : false}
                        onChange={event =>
                            setConfirmPassword(event.target.value)
                        }
                        fullWidth
                    />
                    <TextField
                        id="handle"
                        name="handle"
                        type="text"
                        label="Handle"
                        className={classes.textField}
                        value={handle}
                        helperText={errors.handle}
                        error={errors.handle ? true : false}
                        onChange={event => setHandle(event.target.value)}
                        fullWidth
                    />
                    {errors.general && (
                        <Typography
                            variant="body2"
                            className={classes.customError}
                        >
                            {errors.general}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        type="submit"
                        disabled={loading}
                    >
                        Signup
                        {loading && (
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        )}
                    </Button>
                    <br />
                    <small>
                        Already have an account? login
                        <Link to="/login"> here</Link>
                    </small>
                </form>
            </Grid>
            <Grid item sm></Grid>
        </Grid>
    );
};

export default Signup;
