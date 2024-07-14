import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DashEditUsers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: 0,
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.firstName =
      user.firstName === "" ? "First name is required" : "";
    tempErrors.lastName = user.lastName === "" ? "Last name is required" : "";
    tempErrors.email = user.email === "" ? "Email is required" : "";
    tempErrors.role = user.role === "" ? "Role is required" : "";

    setError(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(`/api/user/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(user)
        })
        const data = await response.json();
        console.log(data);
        navigate('/admin/users')
        
      } catch (error) {}
    }
  };

  console.log(user);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: 4,
      }}
    >
      <Box
        onSubmit={handleSubmit}
        component="form"
        className="form_style border-style"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h5" component="h2" sx={{ pb: 3 }}>
            Edit User
          </Typography>
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="First Name"
            value={user.firstName}
            onChange={handleChange}
            error={Boolean(error.firstName)}
            helperText={error.firstName}
          />
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Last Name"
            value={user.lastName}
            onChange={handleChange}
            error={error.lastName}
            helperText={error.lastName}
          />
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="email"
            label="Email"
            name="email"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            className="px-2 my-2"
            variant="outlined"
            name="role"
            id="role"
            select
            label="Role"
            value={user.role}
            onChange={handleChange}
            error={Boolean(error.role)}
            helperText={error.role}
          >
            <MenuItem key={10} value={1}>Admin</MenuItem>
            <MenuItem key={11} value={0}>Regular User</MenuItem>
          </TextField>

          <Button fullWidth variant="contained" type="submit">
            Edit User
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DashEditUsers;
