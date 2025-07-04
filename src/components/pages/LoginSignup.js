import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  Input,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Lock,
  Email,
  Business,
  Person,
  Language,
  LocationOn,
  Work,
  Phone,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
} from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_API } from "../../utils/api";

const endpoints = {
  login: {
    candidate: `${BASE_API}/login/candidate`,
    company: `${BASE_API}/login/company`,
  },
  register: {
    candidate: `${BASE_API}/register/candidate`,
    company: `${BASE_API}/register/company`,
  },
};

const initialCandidate = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  current_title: "",
  years_experience: "",
};
const initialCompany = {
  name: "",
  email: "",
  password: "",
  description: "",
  website: "",
  location: "",
  industry: "",
};

const inputSx = (theme) => ({
  marginBottom: "20px",
});

export default function LoginSignup() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [userType, setUserType] = useState("candidate"); // 'candidate' or 'company'
  const [form, setForm] = useState(initialCandidate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tabAnim, setTabAnim] = useState(true);

  React.useEffect(() => {
    setForm(userType === "candidate" ? initialCandidate : initialCompany);
    setError("");
    setSuccess("");
    setTabAnim(false);
    setTimeout(() => setTabAnim(true), 100);
  }, [mode, userType]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const endpoint = endpoints[mode][userType];
      let body;
      if (mode === "login") {
        // Only send email and password for login
        body = {
          email: form.email,
          password: form.password,
        };
      } else {
        body = { ...form };
        if (userType === "candidate" && mode === "register") {
          body.years_experience = Number(body.years_experience) || 0;
        }
      }
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      if (mode === "login") {
        // Save token and user info
        authLogin(
          {
            user_type: data.user_type,
            user_id: data.user_id,
          },
          data.access_token
        );
        // Redirect based on user_type
        if (data.user_type === "candidate") {
          navigate("/candidate");
        } else if (data.user_type === "company") {
          navigate("/company");
        }
        return;
      }
      setSuccess(
        mode === "login" ? "Login successful!" : "Registration successful!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    if (userType === "candidate") {
      return (
        <>
          {mode === "register" && (
            <Grid container spacing={4} justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Current Title"
                  name="current_title"
                  value={form.current_title}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Years Experience"
                  name="years_experience"
                  value={form.years_experience}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  sx={inputSx(theme)}
                />
              </Grid>
            </Grid>
          )}
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={inputSx(theme)}
          />
          <Input
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx(theme)}
          />
        </>
      );
    } else {
      return (
        <>
          {mode === "register" && (
            <Grid container spacing={4} justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Company Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Language />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  placeholder="Industry"
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={inputSx(theme)}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  placeholder="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  sx={inputSx(theme)}
                />
              </Grid>
            </Grid>
          )}
          <Input
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={inputSx(theme)}
          />
          <Input
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx(theme)}
          />
        </>
      );
    }
  };

  return (
    <Box
      className="d-flex align-items-center justify-content-center w-100 min-vh-100"
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        p: 3,
      }}
    >
      {/* Abstract shapes background */}
      <Box
        sx={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle
            cx="1200"
            cy="200"
            r="220"
            fill={theme.palette.primary.main}
            fillOpacity="0.13"
          />
          <circle
            cx="300"
            cy="800"
            r="180"
            fill={theme.palette.secondary.main}
            fillOpacity="0.12"
          />
          <ellipse
            cx="900"
            cy="700"
            rx="180"
            ry="90"
            fill={theme.palette.success.main}
            fillOpacity="0.10"
          />
        </svg>
      </Box>
      <Fade in={tabAnim} timeout={500}>
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 5 },
            minWidth: 450,
            maxWidth: 550,
            width: "100%",
            borderRadius: 6,
            boxShadow: "0 8px 32px rgba(25,118,210,0.10)",
            background: `linear-gradient(120deg, ${theme.palette.background.paper} 80%, #f7faff 100%)`,
            border: `1.5px solid ${theme.palette.primary.light}22`,
            backdropFilter: "blur(18px)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "box-shadow 0.2s",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(25,118,210,0.18)",
            },
          }}
        >
          {/* Logo/Brand */}
          <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px #1976d233",
                border: `2.5px solid ${theme.palette.secondary.main}`,
              }}
            >
              <LoginIcon sx={{ color: "#fff", fontSize: 30 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={900}
              color={theme.palette.primary.main}
              letterSpacing={1.5}
              sx={{ ml: 1, fontFamily: "Montserrat, sans-serif" }}
            >
              Jobsy
            </Typography>
          </Box>
          {/* Tabs */}
          <Tabs
            value={mode}
            onChange={(_, v) => setMode(v)}
            variant="fullWidth"
            sx={{ mb: 2, minWidth: "100%" }}
            TabIndicatorProps={{
              style: { background: theme.palette.primary.main },
            }}
          >
            <Tab
              icon={<LoginIcon sx={{ fontSize: 20 }} />}
              label="Login"
              value="login"
              sx={{
                fontWeight: 700,
                color:
                  mode === "login"
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                opacity: mode === "login" ? 1 : 0.6,
                transition: "color 0.2s, opacity 0.2s",
              }}
            />
            <Tab
              icon={<RegisterIcon sx={{ fontSize: 20 }} />}
              label="Sign Up"
              value="register"
              sx={{
                fontWeight: 700,
                color:
                  mode === "register"
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                opacity: mode === "register" ? 1 : 0.6,
                transition: "color 0.2s, opacity 0.2s",
              }}
            />
          </Tabs>
          <Tabs
            value={userType}
            onChange={(_, v) => setUserType(v)}
            variant="fullWidth"
            sx={{ mb: 2, minWidth: "100%" }}
            TabIndicatorProps={{
              style: { background: theme.palette.secondary.main },
            }}
          >
            <Tab
              label="Candidate"
              value="candidate"
              sx={{
                fontWeight: 600,
                color:
                  userType === "candidate"
                    ? theme.palette.secondary.main
                    : theme.palette.text.secondary,
                opacity: userType === "candidate" ? 1 : 0.6,
                transition: "color 0.2s, opacity 0.2s",
              }}
            />
            <Tab
              label="Company"
              value="company"
              sx={{
                fontWeight: 600,
                color:
                  userType === "company"
                    ? theme.palette.secondary.main
                    : theme.palette.text.secondary,
                opacity: userType === "company" ? 1 : 0.6,
                transition: "color 0.2s, opacity 0.2s",
              }}
            />
          </Tabs>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.text.primary,
              letterSpacing: 0.5,
            }}
          >
            {mode === "login" ? "Welcome Back!" : "Create Your Account"}
          </Typography>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            style={{ width: "100%" }}
          >
            <Zoom in={tabAnim} timeout={400}>
              <Box>{renderFields()}</Box>
            </Zoom>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success}
              </Alert>
            )}
            <Box sx={{ mt: 3, position: "relative" }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2.5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: "0 2px 12px #1976d233",
                  color: "#fff",
                  textTransform: "none",
                  letterSpacing: 1,
                  fontSize: "1.1rem",
                  transition: "background 0.2s, transform 0.1s",
                  "&:hover": {
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: "scale(1.04)",
                  },
                  "&:active": {
                    background: theme.palette.primary.main,
                    transform: "scale(0.98)",
                  },
                  "&:focus": {
                    outline: `2.5px solid ${theme.palette.success.main}`,
                    outlineOffset: "2px",
                  },
                }}
              >
                {mode === "login" ? "Login" : "Sign Up"}
              </Button>
              {loading && (
                <CircularProgress
                  size={28}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    mt: "-14px",
                    ml: "-14px",
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </Box>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
