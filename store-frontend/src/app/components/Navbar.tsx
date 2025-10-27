"use client";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import Link from "next/link";

const Navbar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Button
          color="inherit"
          startIcon={<StoreIcon />}
          component={Link}
          href="/"
          sx={{ textTransform: "none" }}
        >
          <Typography variant="h6" component="span">
            Code Store
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
