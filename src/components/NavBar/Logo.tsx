import { Stack, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, useContext } from 'react'
import getConfig from 'next/config'
import { AppContext } from '../AppContext'

const { publicRuntimeConfig } = getConfig()

const styles = {
  root: {
    cursor: 'pointer',
  },
  image: {
    height: '64px',
  },
  title: {
    padding: 0,
    margin: 0,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  subtitle: {
    padding: 0,
    margin: 0,
  },
  button: {
    borderRadius: 0,
    position: 'absolute',
    right: '10px',
    margin: {
      xs:'0px auto 0 auto',
      md: '0px auto 0 auto',
    },
    color: (theme) => theme.palette.background.default,
    width: 300,
    padding: '1rem 1rem',
    backgroundColor:'#004494',
  },
}

const Logo: FC = () => {
  const { geoJSON } = useContext(AppContext)

  const isNarrowScreen = window.matchMedia("(max-width: 600px)").matches;

  const router = useRouter()

  const handleGoToHome = () => {
    router.push('/')
  }
  
  const downloadZH = (event) => {
    const jsonData = new Blob([JSON.stringify(geoJSON)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    link.download = `zones_humides_74.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack
      sx={styles.root}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={1}
    >
      {publicRuntimeConfig?.layout?.header?.logo && (
        <img
          style={styles.image}
          src={publicRuntimeConfig.layout.header.logo.src}
          alt={publicRuntimeConfig.layout.header.logo.alt}
        />
      )}
      <Typography 
        sx={styles.subtitle}
        color="primary"
        onClick={handleGoToHome}
      >
        Zones humides
      </Typography>
      {!isNarrowScreen && window.location.pathname === "/map/" &&
        <Button 
          sx={styles.button} 
          onClick={downloadZH}
        >
          Téléchargez les Zones Humides
        </Button>
      }
    </Stack>
  )
}

export default Logo
