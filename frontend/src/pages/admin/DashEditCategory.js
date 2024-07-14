import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DashEditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/type/getjob/${id}`);
        const data = await response.json();
        setCategory(data.jobTypeName);
      } catch (error) {}
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category === "") {
      setError("Please enter a Category");
      return;
    }
    try {
        setError("")
      const response = await fetch(`/api/type/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTypeName: category }),
      });
      const data = await response.json();
      setCategory(data.jobTypeName);
      navigate('/admin/category');
    } catch (error) {}
  };

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
            Edit Category
          </Typography>

          <TextField
            sx={{ mb: 3 }}
            fullWidth
            id="category"
            label="Category"
            name="category"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />

          <Button fullWidth variant="contained" type="submit">
            Update Category
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DashEditCategory;
