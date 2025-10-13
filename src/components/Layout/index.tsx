import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import Footer from "../Footer";
import Header from "../Header";
import type { FC } from "react";

const Layout: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100wh',
      }}
    >

      <Header />
      <Container sx={{ flexGrow: 1, py: 4 }}>

        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;